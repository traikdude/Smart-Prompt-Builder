"""
Export Google Sheets RLHF telemetry into Gemini JSONL fine-tuning format.
"""
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
    """Maps expected column names to their index, case-insensitively."""
    normalized = [str(h).strip().lower() for h in header]
    required = {
        "rating": ["rating", "score", "thumbs"],
        "prompt": ["prompt", "user_request", "request"],
        "lens": ["lens", "format", "mode"],
        "output": ["output", "response", "result"],
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
    return index


def build_record(row: list, cols: dict, max_idx: int):
    """Returns a (text_input, output) tuple for a valid positive row, else None."""
    if len(row) <= max_idx:
        return None
    if str(row[cols["rating"]]).strip() != "1":
        return None

    prompt = str(row[cols["prompt"]]).strip()
    lens = str(row[cols["lens"]]).strip()
    output = str(row[cols["output"]]).strip()

    if len(prompt) < 3 or len(output) < 10:
        return "SHORT"

    text_input = f"Format this according to the '{lens}' lens.\nUser Request: {prompt}"
    return (text_input, output)


def write_dataset(data_rows: list, cols: dict, output_file: str) -> dict:
    """Writes filtered, deduped records to output_file. Returns counters."""
    max_idx = max(cols.values())
    seen = set()
    stats = {"count": 0, "short": 0, "dupes": 0}

    with open(output_file, "w", encoding="utf-8") as f:
        for row in data_rows:
            record = build_record(row, cols, max_idx)
            if record is None:
                continue
            if record == "SHORT":
                stats["short"] += 1
                continue
            if record in seen:
                stats["dupes"] += 1
                continue
            seen.add(record)
            f.write(json.dumps({"text_input": record[0], "output": record[1]}) + "\n")
            stats["count"] += 1

    return stats


def main():
    """Main export loop."""
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
        output_file = "tuning_dataset.jsonl"
        stats = write_dataset(rows[1:], cols, output_file)

        logger.info(
            "Exported %d examples to %s (skipped %d short, %d duplicates)",
            stats["count"], output_file, stats["short"], stats["dupes"]
        )

    except Exception:  # pylint: disable=broad-exception-caught
        logger.exception("Failed to export RLHF data")
        sys.exit(1)


if __name__ == "__main__":
    main()
