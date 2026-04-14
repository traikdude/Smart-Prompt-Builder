"""
One-shot wrapper that chains the full Corrections → Vertex tuning pipeline:

  1. export_corrections_vertex.py  → writes a local JSONL from the Corrections tab
  2. submit_vertex_tuning_job.py   → uploads the JSONL and submits an SFT job

All flags after known wrapper args are forwarded to the submit step, so you can
still override --base-model, --epochs, etc.

Required env: GOOGLE_SERVICE_ACCOUNT_JSON, RLHF_SHEET_ID
Required flag: --bucket (GCS bucket for the uploaded dataset)

Usage:
  python tune_from_corrections.py --bucket my-tuning-bucket
  python tune_from_corrections.py --bucket my-tuning-bucket --dry-run
  python tune_from_corrections.py --bucket my-tuning-bucket --base-model gemini-2.5-flash-002 --epochs 3
"""
import argparse
import datetime
import os
import subprocess
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
EXPORTER = os.path.join(SCRIPT_DIR, "export_corrections_vertex.py")
SUBMITTER = os.path.join(SCRIPT_DIR, "submit_vertex_tuning_job.py")


def parse_known():
    p = argparse.ArgumentParser(
        description="Export Corrections tab and submit a Vertex tuning job in one shot.",
        add_help=True,
    )
    p.add_argument("--bucket", required=True, help="GCS bucket for dataset upload.")
    p.add_argument("--workdir", default=None,
                   help="Directory for the intermediate JSONL (default: system temp).")
    p.add_argument("--keep", action="store_true",
                   help="Keep the local JSONL after submission (default: delete).")
    p.add_argument("--dry-run", action="store_true",
                   help="Pass --dry-run through to the submit step.")
    return p.parse_known_args()


def run(cmd: list):
    print(f"\n$ {' '.join(cmd)}", flush=True)
    result = subprocess.run(cmd, check=False)
    if result.returncode != 0:
        print(f"Step failed with exit code {result.returncode}", file=sys.stderr)
        sys.exit(result.returncode)


def main():
    args, passthrough = parse_known()

    if not os.environ.get("GOOGLE_SERVICE_ACCOUNT_JSON"):
        print("ERROR: GOOGLE_SERVICE_ACCOUNT_JSON is not set.", file=sys.stderr)
        sys.exit(1)
    if not os.environ.get("RLHF_SHEET_ID"):
        print("ERROR: RLHF_SHEET_ID is not set.", file=sys.stderr)
        sys.exit(1)

    workdir = args.workdir or os.environ.get("TMPDIR") or os.environ.get("TEMP") or "/tmp"
    os.makedirs(workdir, exist_ok=True)
    ts = datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    jsonl_path = os.path.join(workdir, f"corrections-{ts}.jsonl")

    # Step 1 — export
    run([sys.executable, EXPORTER, "--output", jsonl_path])

    if not os.path.isfile(jsonl_path) or os.path.getsize(jsonl_path) == 0:
        print("Exporter produced no data. Nothing to tune. Exiting.", file=sys.stderr)
        sys.exit(0)

    # Step 2 — submit (passthrough flags tacked on at the end so user overrides win)
    submit_cmd = [
        sys.executable, SUBMITTER,
        "--dataset", jsonl_path,
        "--bucket", args.bucket,
    ]
    if args.dry_run:
        submit_cmd.append("--dry-run")
    submit_cmd.extend(passthrough)
    run(submit_cmd)

    if not args.keep:
        try:
            os.remove(jsonl_path)
            print(f"Removed intermediate {jsonl_path}")
        except OSError as e:
            print(f"Warning: could not remove {jsonl_path}: {e}", file=sys.stderr)


if __name__ == "__main__":
    main()
