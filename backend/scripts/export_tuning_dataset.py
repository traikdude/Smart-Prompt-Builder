"""
Export Google Sheets RLHF telemetry into Gemini JSONL fine-tuning format.

Supports two training signal paths:
  Path A — Positive (rating=1): uses actual AI output as the target.
  Path B — Correction (rating=0 + ideal_output): uses human-supplied correction as target.

Usage:
  python export_tuning_dataset.py                        # Full export
  python export_tuning_dataset.py --dry-run --limit 5    # Smoke-test
"""
import argparse
import json
import logging
import os
import sys

from google.oauth2 import service_account
from googleapiclient.discovery import build

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


def get_sheets_service():
    """Initializes and returns the authenticated Google Sheets API service."""
    sa_json = os.environ.get("GOOGLE_SERVICE_ACCOUNT_JSON")
    if not sa_json:
        logger.error("Missing GOOGLE_SERVICE_ACCOUNT_JSON.")
        sys.exit(1)

    credentials_dict = json.loads(sa_json)
    credentials = service_account.Credentials.from_service_account_info(
        credentials_dict,
        scopes=["https://www.googleapis.com/auth/spreadsheets.readonly"]
    )
    return build('sheets', 'v4', credentials=credentials)


def fetch_sheet_rows(service, sheet_id: str) -> list:
    """Fetches all rows from the first tab of the given spreadsheet."""
    sheet_metadata = service.spreadsheets().get(  # pylint: disable=no-member
        spreadsheetId=sheet_id
    ).execute()

    sheets = sheet_metadata.get('sheets', '')
    if not sheets:
        logger.error("No sheets found in the provided Spreadsheet ID.")
        sys.exit(1)

    first_sheet_name = sheets[0].get("properties", {}).get("title", "")
    range_name = f"{first_sheet_name}!A:Z"

    result = service.spreadsheets().values().get(  # pylint: disable=no-member
        spreadsheetId=sheet_id, range=range_name
    ).execute()

    return result.get('values', [])


def build_column_index(header: list) -> dict:
    """Maps expected column names to their index, case-insensitively.

    Required columns: rating, prompt, lens, output.
    Optional columns: ideal_output (Phase 7.4).
    """
    normalized = [str(h).strip().lower() for h in header]
    required = {
        "rating": ["rating", "score", "thumbs"],
        "prompt": ["prompt", "user_request", "request"],
        "lens": ["lens", "format", "mode"],
        "output": ["output", "response", "result"],
    }
    optional = {
        "ideal_output": ["ideal_output", "correction", "ideal"],
    }

    index = {}
    for key, aliases in required.items():
        for alias in aliases:
            if alias in normalized:
                index[key] = normalized.index(alias)
                break
        if key not in index:
            logger.error("Missing required column '%s' in sheet header: %s", key, header)
            sys.exit(1)

    for key, aliases in optional.items():
        for alias in aliases:
            if alias in normalized:
                index[key] = normalized.index(alias)
                break

    return index


def build_text_input(prompt: str, lens: str) -> str:
    """Constructs the standard text_input format for a training example."""
    return f"Format this according to the '{lens}' lens.\nUser Request: {prompt}"


def build_positive_record(row: list, cols: dict, max_required_idx: int):
    """Returns a (text_input, output) tuple for a valid positive (rating=1) row, else None."""
    if len(row) <= max_required_idx:
        return None
    if str(row[cols["rating"]]).strip() != "1":
        return None

    prompt = str(row[cols["prompt"]]).strip()
    lens = str(row[cols["lens"]]).strip()
    output = str(row[cols["output"]]).strip()

    if len(prompt) < 3 or len(output) < 10:
        return "SHORT"

    return (build_text_input(prompt, lens), output)


def build_correction_record(row: list, cols: dict, max_required_idx: int):
    """Returns a (text_input, ideal_output) tuple for a valid correction (rating=0) row, else None.

    Only produces a record if the row has a non-empty ideal_output column.
    """
    if len(row) <= max_required_idx:
        return None
    if str(row[cols["rating"]]).strip() != "0" or "ideal_output" not in cols:
        return None

    ideal_col = cols["ideal_output"]
    ideal = str(row[ideal_col]).strip() if len(row) > ideal_col else ""
    if len(ideal) < 10:
        return None

    prompt = str(row[cols["prompt"]]).strip()
    lens = str(row[cols["lens"]]).strip()

    if len(prompt) < 3:
        return "SHORT"

    return (build_text_input(prompt, lens), ideal)


def process_rows(data_rows: list, cols: dict, limit: int = 0) -> dict:
    """Processes rows into positive and correction records. Returns structured results."""
    max_required_idx = max(
        cols[k] for k in ("rating", "prompt", "lens", "output")
    )
    seen = set()
    stats = {"positive": 0, "correction": 0, "short": 0, "dupes": 0, "skipped": 0}
    records = []

    total_limit = limit if limit > 0 else len(data_rows)

    for row in data_rows:
        if len(records) >= total_limit:
            break

        # Try Path A (positive)
        pos = build_positive_record(row, cols, max_required_idx)
        if pos == "SHORT":
            stats["short"] += 1
            continue
        if pos is not None:
            if pos in seen:
                stats["dupes"] += 1
                continue
            seen.add(pos)
            records.append({"text_input": pos[0], "output": pos[1], "type": "positive"})
            stats["positive"] += 1
            continue

        # Try Path B (correction)
        corr = build_correction_record(row, cols, max_required_idx)
        if corr == "SHORT":
            stats["short"] += 1
            continue
        if corr is not None:
            if corr in seen:
                stats["dupes"] += 1
                continue
            seen.add(corr)
            records.append({"text_input": corr[0], "output": corr[1], "type": "correction"})
            stats["correction"] += 1
            continue

        stats["skipped"] += 1

    return {"records": records, "stats": stats}


def write_dataset(records: list, output_file: str):
    """Writes records to a JSONL file."""
    with open(output_file, "w", encoding="utf-8") as f:
        for rec in records:
            f.write(json.dumps({"text_input": rec["text_input"], "output": rec["output"]}) + "\n")


def parse_args():
    """Parses command-line arguments."""
    parser = argparse.ArgumentParser(
        description="Export RLHF telemetry to Gemini JSONL fine-tuning format."
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Print records to stdout instead of writing to file."
    )
    parser.add_argument(
        "--limit", type=int, default=0,
        help="Limit the number of records to export (0 = unlimited)."
    )
    parser.add_argument(
        "--output", type=str, default="tuning_dataset.jsonl",
        help="Output JSONL file path (default: tuning_dataset.jsonl)."
    )
    return parser.parse_args()


def main():
    """Main export loop."""
    args = parse_args()
    sheet_id = os.environ.get("RLHF_SHEET_ID")
    if not sheet_id:
        logger.error("Missing required environment variable: RLHF_SHEET_ID")
        sys.exit(1)

    try:
        rows = fetch_sheet_rows(get_sheets_service(), sheet_id)
        if not rows or len(rows) < 2:
            logger.info("No data rows found in Google Sheet.")
            sys.exit(0)

        cols = build_column_index(rows[0])
        result = process_rows(rows[1:], cols, limit=args.limit)
        records = result["records"]
        stats = result["stats"]

        if args.dry_run:
            logger.info("=== DRY RUN MODE (limit=%d) ===", args.limit)
            for i, rec in enumerate(records):
                print(f"\n--- Record {i + 1} [{rec['type'].upper()}] ---")
                print(json.dumps(
                    {"text_input": rec["text_input"], "output": rec["output"]},
                    indent=2
                ))
            logger.info(
                "Dry run complete: %d positive, %d corrections, %d short, %d dupes, %d skipped",
                stats["positive"], stats["correction"],
                stats["short"], stats["dupes"], stats["skipped"]
            )
        else:
            write_dataset(records, args.output)
            logger.info(
                "Exported %d examples to %s (%d positive, %d corrections, "
                "skipped %d short, %d duplicates, %d other)",
                len(records), args.output,
                stats["positive"], stats["correction"],
                stats["short"], stats["dupes"], stats["skipped"]
            )

    except Exception:  # pylint: disable=broad-exception-caught
        logger.exception("Failed to export RLHF data")
        sys.exit(1)


if __name__ == "__main__":
    main()
