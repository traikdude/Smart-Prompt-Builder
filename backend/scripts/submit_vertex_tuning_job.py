"""
Submit a supervised fine-tuning job to Vertex AI using a Corrections JSONL
dataset produced by `export_corrections_vertex.py`.

Flow:
  1. Accept a local JSONL path or an existing gs:// URI as the training set.
  2. If local, upload it to a GCS bucket under a timestamped prefix.
  3. Kick off a Vertex AI supervised tuning job via `vertexai.tuning.sft.train`.
  4. Print the tuning job resource name so it can be monitored or polled later.

Extra deps (not in backend/requirements.txt — install ad hoc for this script):
  pip install google-cloud-aiplatform google-cloud-storage

Usage:
  python submit_vertex_tuning_job.py \\
      --dataset corrections.jsonl \\
      --bucket my-tuning-bucket \\
      --project mortalzwardrobe \\
      --location us-central1 \\
      --base-model gemini-2.5-flash-002 \\
      --tuned-name spb-corrections-v1

  # Using an already-uploaded dataset:
  python submit_vertex_tuning_job.py \\
      --dataset gs://my-tuning-bucket/datasets/corrections-2026-04-14.jsonl \\
      --project mortalzwardrobe

  # Dry run (upload but do not submit):
  python submit_vertex_tuning_job.py --dataset corrections.jsonl --bucket my-tuning-bucket --dry-run
"""
import argparse
import datetime
import logging
import os
import sys

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


def parse_args():
    p = argparse.ArgumentParser(description="Submit Vertex AI supervised tuning job.")
    p.add_argument("--dataset", required=True,
                   help="Local .jsonl path OR gs:// URI of training data.")
    p.add_argument("--bucket", default=None,
                   help="GCS bucket name for upload (required if --dataset is local).")
    p.add_argument("--project", default=os.environ.get("GOOGLE_CLOUD_PROJECT", "mortalzwardrobe"),
                   help="GCP project ID.")
    p.add_argument("--location", default="us-central1", help="Vertex AI region.")
    p.add_argument("--base-model", default="gemini-2.5-flash-002",
                   help="Tunable Gemini base model ID.")
    p.add_argument("--tuned-name", default=None,
                   help="Display name for the tuned model (default: auto-timestamped).")
    p.add_argument("--epochs", type=int, default=None, help="Optional epoch count override.")
    p.add_argument("--learning-rate-multiplier", type=float, default=None,
                   help="Optional LR multiplier override.")
    p.add_argument("--adapter-size", type=int, default=None,
                   help="Optional adapter size override.")
    p.add_argument("--dry-run", action="store_true",
                   help="Upload dataset (if local) and print config, but do not submit.")
    return p.parse_args()


def upload_to_gcs(local_path: str, bucket_name: str, project: str) -> str:
    """Uploads a local file to gs://bucket/tuning-datasets/<timestamp>/<basename>."""
    try:
        from google.cloud import storage  # pylint: disable=import-outside-toplevel
    except ImportError:
        logger.error("google-cloud-storage not installed. Run: pip install google-cloud-storage")
        sys.exit(1)

    if not os.path.isfile(local_path):
        logger.error("Local dataset not found: %s", local_path)
        sys.exit(1)

    ts = datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    blob_path = f"tuning-datasets/{ts}/{os.path.basename(local_path)}"

    client = storage.Client(project=project)
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(blob_path)
    logger.info("Uploading %s → gs://%s/%s", local_path, bucket_name, blob_path)
    blob.upload_from_filename(local_path, content_type="application/jsonl")
    gcs_uri = f"gs://{bucket_name}/{blob_path}"
    logger.info("Upload complete: %s", gcs_uri)
    return gcs_uri


def resolve_dataset_uri(args) -> str:
    """Returns a gs:// URI, uploading the local file first if necessary."""
    if args.dataset.startswith("gs://"):
        return args.dataset
    if not args.bucket:
        logger.error("--bucket is required when --dataset is a local path.")
        sys.exit(1)
    return upload_to_gcs(args.dataset, args.bucket, args.project)


def submit_tuning_job(args, train_uri: str):
    try:
        import vertexai  # pylint: disable=import-outside-toplevel
        from vertexai.tuning import sft  # pylint: disable=import-outside-toplevel
    except ImportError:
        logger.error("google-cloud-aiplatform not installed. "
                     "Run: pip install google-cloud-aiplatform")
        sys.exit(1)

    vertexai.init(project=args.project, location=args.location)

    display_name = args.tuned_name or (
        "spb-corrections-"
        + datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    )

    kwargs = {
        "source_model": args.base_model,
        "train_dataset": train_uri,
        "tuned_model_display_name": display_name,
    }
    if args.epochs is not None:
        kwargs["epochs"] = args.epochs
    if args.learning_rate_multiplier is not None:
        kwargs["learning_rate_multiplier"] = args.learning_rate_multiplier
    if args.adapter_size is not None:
        kwargs["adapter_size"] = args.adapter_size

    logger.info("Submitting tuning job with config: %s", kwargs)
    job = sft.train(**kwargs)

    logger.info("Tuning job submitted.")
    logger.info("  resource name: %s", getattr(job, "resource_name", "(unknown)"))
    logger.info("  state:         %s", getattr(job, "state", "(unknown)"))
    logger.info("  display name:  %s", display_name)
    return job


def main():
    args = parse_args()
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:  # pylint: disable=broad-exception-caught
        pass

    # Dry run: don't upload a local dataset — just preview the intended config.
    if args.dry_run:
        preview_uri = args.dataset
        if not preview_uri.startswith("gs://"):
            preview_uri = f"<would upload {preview_uri} to gs://{args.bucket}/tuning-datasets/…>"
        logger.info("DRY RUN — not uploading or submitting.")
        logger.info("Would submit tuning job with:")
        logger.info("  project:     %s", args.project)
        logger.info("  location:    %s", args.location)
        logger.info("  base model:  %s", args.base_model)
        logger.info("  dataset:     %s", preview_uri)
        logger.info("  tuned name:  %s", args.tuned_name or "(auto-timestamped)")
        return

    train_uri = resolve_dataset_uri(args)
    submit_tuning_job(args, train_uri)


if __name__ == "__main__":
    main()
