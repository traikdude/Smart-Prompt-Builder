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
    range_name = f"{first_sheet_name}!A:F"

    result = service.spreadsheets().values().get(  # pylint: disable=no-member
        spreadsheetId=sheet_id, range=range_name
    ).execute()

    return result.get('values', [])


def main():
    """Main export loop."""
    sheet_id = os.environ.get("RLHF_SHEET_ID")
    if not sheet_id:
        logger.error("Missing required environment variable: RLHF_SHEET_ID")
        sys.exit(1)

    try:
        service = get_sheets_service()
        rows = fetch_sheet_rows(service, sheet_id)

        if not rows:
            logger.info("No data found in Google Sheet.")
            sys.exit(0)

        output_file = "tuning_dataset.jsonl"
        count = 0

        with open(output_file, "w", encoding="utf-8") as f:
            for row in rows:
                if len(row) < 6:
                    continue

                rating = str(row[1]).strip()
                prompt, lens, output = row[2], row[3], row[5]

                # Filter only positive feedback
                if rating == "1":
                    text_input = (
                        f"Format this according to the '{lens}' lens.\n"
                        f"User Request: {prompt}"
                    )
                    record = {
                        "text_input": text_input,
                        "output": output
                    }
                    f.write(json.dumps(record) + "\n")
                    count += 1

        logger.info(
            "Successfully exported %d high-rated examples to %s",
            count,
            output_file
        )

    except Exception as e:  # pylint: disable=broad-exception-caught
        logger.error("Failed to export RLHF data: %s", str(e))
        sys.exit(1)


if __name__ == "__main__":
    main()
