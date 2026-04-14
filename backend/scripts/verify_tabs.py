import os, json
from google.oauth2 import service_account
from googleapiclient.discovery import build

creds_info = json.loads(os.environ["GOOGLE_SERVICE_ACCOUNT_JSON"])
creds = service_account.Credentials.from_service_account_info(creds_info, scopes=["https://www.googleapis.com/auth/spreadsheets.readonly"])
service = build("sheets", "v4", credentials=creds)

sheet_id = os.environ["RLHF_SHEET_ID"]
sheet_metadata = service.spreadsheets().get(spreadsheetId=sheet_id).execute()

for sheet in sheet_metadata.get("sheets", []):
    title = sheet["properties"]["title"]
    print(f"\n=== Tab: {title} ===")
    result = service.spreadsheets().values().get(spreadsheetId=sheet_id, range=f"{title}!A:H").execute()
    values = result.get("values", [])
    if not values:
        continue
    rows = values[1:]
    for i, r in enumerate(rows):
        if len(r) >= 8:
             print(f"Row {i+2}: timestamp={r[0]} rating={r[1]} app_version={r[7]}")
