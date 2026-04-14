"""
Convert the `Corrections` tab of the RLHF telemetry sheet into a JSONL
dataset in Vertex AI supervised-tuning format for Gemini models.

Vertex AI expects each line to be a JSON object shaped like:
  {
    "systemInstruction": {"role": "system", "parts": [{"text": "..."}]},
    "contents": [
      {"role": "user",  "parts": [{"text": "<prompt>"}]},
      {"role": "model", "parts": [{"text": "<ideal output>"}]}
    ]
  }

Every row in the Corrections tab is, by construction, a downvote with a
human-supplied ideal_output — so the training signal is:
    input  = original_prompt (conditioned on the lens via systemInstruction)
    target = ideal_output

Usage:
  GOOGLE_SERVICE_ACCOUNT_JSON=... RLHF_SHEET_ID=... \\
      python export_corrections_vertex.py --output corrections.jsonl
  python export_corrections_vertex.py --dry-run --limit 3
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

CORRECTIONS_TAB = "Corrections"
MIN_PROMPT_LEN = 3
MIN_IDEAL_LEN = 10

COLUMN_ALIASES = {
    "prompt": ["prompt", "original_prompt", "user_request", "request"],
    "lens": ["lens", "selected_lens", "format", "mode"],
    "ideal_output": ["ideal_output", "correction", "ideal"],
    "rating": ["rating", "score"],
}


def get_sheets_service():
    sa_json = os.environ.get("GOOGLE_SERVICE_ACCOUNT_JSON")
    if not sa_json:
        logger.error("Missing GOOGLE_SERVICE_ACCOUNT_JSON env var.")
        sys.exit(1)
    creds = service_account.Credentials.from_service_account_info(
        json.loads(sa_json),
        scopes=["https://www.googleapis.com/auth/spreadsheets.readonly"],
    )
    return build("sheets", "v4", credentials=creds)


def fetch_corrections_rows(service, sheet_id: str) -> list:
    """Pulls all rows from the `Corrections` tab. Fails loudly if absent."""
    meta = service.spreadsheets().get(spreadsheetId=sheet_id).execute()  # pylint: disable=no-member
    titles = [s["properties"]["title"] for s in meta.get("sheets", [])]
    if CORRECTIONS_TAB not in titles:
        logger.error("Tab %r not found in sheet. Present tabs: %s", CORRECTIONS_TAB, titles)
        sys.exit(1)

    result = service.spreadsheets().values().get(  # pylint: disable=no-member
        spreadsheetId=sheet_id, range=f"{CORRECTIONS_TAB}!A:Z"
    ).execute()
    return result.get("values", [])


def build_column_index(header: list) -> dict:
    normalized = [str(h).strip().lower() for h in header]
    index = {}
    for key, aliases in COLUMN_ALIASES.items():
        for alias in aliases:
            if alias in normalized:
                index[key] = normalized.index(alias)
                break
    missing = [k for k in ("prompt", "lens", "ideal_output") if k not in index]
    if missing:
        logger.error("Corrections header missing required columns %s. Got: %s", missing, header)
        sys.exit(1)
    return index


def cell(row: list, idx: int) -> str:
    return str(row[idx]).strip() if idx is not None and len(row) > idx else ""


def build_record(prompt: str, lens: str, ideal: str) -> dict:
    """Emits one Vertex AI supervised-tuning example."""
    sys_text = (
        f"You are the Smart-Prompt-Builder engine operating under the '{lens}' lens. "
        f"Produce output that strictly matches the format and quality of the target response."
    )
    return {
        "systemInstruction": {"role": "system", "parts": [{"text": sys_text}]},
        "contents": [
            {"role": "user", "parts": [{"text": prompt}]},
            {"role": "model", "parts": [{"text": ideal}]},
        ],
    }


def process_rows(data_rows: list, cols: dict, limit: int = 0) -> dict:
    seen = set()
    records = []
    stats = {"emitted": 0, "short": 0, "dupes": 0, "skipped_rating": 0, "empty": 0}

    for row in data_rows:
        if limit and len(records) >= limit:
            break

        prompt = cell(row, cols["prompt"])
        lens = cell(row, cols["lens"]) or "none"
        ideal = cell(row, cols["ideal_output"])

        if "rating" in cols:
            rating = cell(row, cols["rating"])
            if rating and rating != "0":
                stats["skipped_rating"] += 1
                continue

        if not prompt or not ideal:
            stats["empty"] += 1
            continue
        if len(prompt) < MIN_PROMPT_LEN or len(ideal) < MIN_IDEAL_LEN:
            stats["short"] += 1
            continue

        dedup_key = (prompt, ideal, lens)
        if dedup_key in seen:
            stats["dupes"] += 1
            continue
        seen.add(dedup_key)

        records.append(build_record(prompt, lens, ideal))
        stats["emitted"] += 1

    return {"records": records, "stats": stats}


def write_jsonl(records: list, path: str):
    with open(path, "w", encoding="utf-8") as f:
        for rec in records:
            f.write(json.dumps(rec, ensure_ascii=False) + "\n")


def parse_args():
    p = argparse.ArgumentParser(
        description="Export the Corrections tab to Vertex AI supervised-tuning JSONL."
    )
    p.add_argument("--output", default="corrections_vertex.jsonl", help="Output JSONL path.")
    p.add_argument("--limit", type=int, default=0, help="Max records to emit (0 = no limit).")
    p.add_argument("--dry-run", action="store_true", help="Print records instead of writing.")
    return p.parse_args()


def main():
    args = parse_args()
    # Windows consoles default to cp1252 — force UTF-8 so dry-run prints don't crash.
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:  # pylint: disable=broad-exception-caught
        pass
    sheet_id = os.environ.get("RLHF_SHEET_ID")
    if not sheet_id:
        logger.error("Missing RLHF_SHEET_ID env var.")
        sys.exit(1)

    try:
        rows = fetch_corrections_rows(get_sheets_service(), sheet_id)
        if not rows or len(rows) < 2:
            logger.info("Corrections tab has no data rows yet. Nothing to export.")
            sys.exit(0)

        cols = build_column_index(rows[0])
        result = process_rows(rows[1:], cols, limit=args.limit)
        records, stats = result["records"], result["stats"]

        if args.dry_run:
            for i, rec in enumerate(records, 1):
                print(f"\n--- Record {i} ---")
                print(json.dumps(rec, indent=2, ensure_ascii=False))
            logger.info(
                "Dry run: %d emitted, %d short, %d dupes, %d empty, %d non-downvote",
                stats["emitted"], stats["short"], stats["dupes"],
                stats["empty"], stats["skipped_rating"],
            )
            return

        write_jsonl(records, args.output)
        logger.info(
            "Wrote %d Vertex AI tuning examples to %s "
            "(short=%d, dupes=%d, empty=%d, non-downvote=%d)",
            stats["emitted"], args.output,
            stats["short"], stats["dupes"], stats["empty"], stats["skipped_rating"],
        )

    except Exception:  # pylint: disable=broad-exception-caught
        logger.exception("Failed to export Corrections tab")
        sys.exit(1)


if __name__ == "__main__":
    main()
