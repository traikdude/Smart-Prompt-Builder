"""
Smart-Prompt-Builder Engine API
FastAPI backend for multi-modal, concurrent prompt generation via the Gemini GenAI SDK.
"""
import asyncio
import datetime
import json
import logging
import os
import traceback
from contextlib import asynccontextmanager
from enum import Enum
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from google import genai
from google.oauth2 import service_account
from googleapiclient.discovery import build
from pydantic import BaseModel

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Module-level GenAI client — intentionally unset until lifespan validates the secret.
CLIENT: Optional[genai.Client] = None

# Global Singleton Cache for RLHF
# Maps `selected_lens` -> List of high-rating (prompt, output) pairs.
RLHF_CACHE: Dict[str, List[Dict[str, str]]] = {}


async def refresh_rlhf_cache():
    """Fetches high-rated examples from Google Sheets and caches them in-memory."""
    global RLHF_CACHE  # pylint: disable=global-statement
    try:
        logger.info("--- Starting RLHF cache population from Google Sheets ---")
        sheet_id = os.environ.get("RLHF_SHEET_ID")
        sa_json = os.environ.get("GOOGLE_SERVICE_ACCOUNT_JSON")

        if not sheet_id or not sa_json:
            logger.warning("RLHF credentials missing; skipping cache population.")
            return

        credentials_dict = json.loads(sa_json)
        credentials = service_account.Credentials.from_service_account_info(
            credentials_dict,
            scopes=["https://www.googleapis.com/auth/spreadsheets.readonly"]
        )
        service = build('sheets', 'v4', credentials=credentials)

        result = service.spreadsheets().values().get(  # pylint: disable=no-member
            spreadsheetId=sheet_id,
            range="A:F"
        ).execute()

        rows = result.get('values', [])
        if not rows:
            logger.info("No RLHF data found.")
            return

        new_cache: Dict[str, List[Dict[str, str]]] = {}
        # Expected columns: timestamp, rating, prompt, lens, model, output
        for row in rows:
            if len(row) < 6:
                continue
            rating, prompt, lens, output = row[1], row[2], row[3], row[5]
            if str(rating).strip() == "1":
                if lens not in new_cache:
                    new_cache[lens] = []
                new_cache[lens].append({'prompt': prompt, 'output': output})

        RLHF_CACHE = new_cache
        logger.info(
            "--- RLHF Cache populated successfully with %d lenses. ---", len(RLHF_CACHE)
        )
    except Exception as e:  # pylint: disable=broad-exception-caught
        logger.error("Failed to populate RLHF cache: %s", str(e))


@asynccontextmanager
async def lifespan(app: FastAPI):  # pylint: disable=redefined-outer-name,unused-argument
    """
    Application lifespan manager.
    Validates GEMINI_API_KEY and initializes the GenAI client.
    """
    global CLIENT  # pylint: disable=global-statement
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is not set in the environment.")
    CLIENT = genai.Client()
    logger.info("GEMINI_API_KEY validated. GenAI client initialized. Service ready.")

    # Start cache refresh asynchronously so it doesn't block startup
    asyncio.create_task(refresh_rlhf_cache())

    yield
    CLIENT = None
    logger.info("Service shutdown complete.")


app = FastAPI(
    title="Smart-Prompt-Builder Engine API",
    description="High-performance multi-modal processing backend",
    version="2.13.0",
    lifespan=lifespan,
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global trap for all unhandled backend exceptions (Sanitized)."""
    logger.exception("CRITICAL ERROR on %s: %s", request.url.path, str(exc))
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error. The incident has been logged.",
            "type": type(exc).__name__
        }
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


# ── Configuration ────────────────────────────────────────────────────────────

class ModelAlias(str, Enum):
    """Stable aliases for frontend-facing model selection."""
    FLASH = "2.5"
    PRO = "3.1"


# Maps stable aliases to actual Gemini GenAI model IDs.
MODEL_ID_MAP = {
    ModelAlias.FLASH: "gemini-2.5-flash",
    ModelAlias.PRO: "gemini-2.5-pro"
}

# Fallback sequence for high-reliability streaming requests.
MODEL_FALLBACK_CHAIN = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash"
]


# ── Request / Response Models ────────────────────────────────────────────────

class ActiveTemplate(BaseModel):
    """Schema representing an active prompt template item."""
    id: str
    contents: List[Any]


class BatchGenerateRequest(BaseModel):
    """Schema for batch prompt processing."""
    model_name: str = "gemini-2.5-flash"
    active_lenses: Optional[List[str]] = None
    tasks: List[ActiveTemplate]


class StreamGenerateRequest(BaseModel):
    """Schema for single-task streaming generation."""
    model_name: str = "gemini-2.5-flash"
    active_lenses: Optional[List[str]] = None
    contents: List[Any]
    system_instruction: Optional[str] = None


class TaskResult(BaseModel):
    """Schema representing the status and generated payload of a processed task."""
    id: str
    status: str
    raw_text: Optional[str] = None
    error: Optional[str] = None


class FeedbackRequest(BaseModel):
    """Schema for RLHF feedback submission."""
    rating: int  # 1 for up, 0 for down
    payload_content: str
    original_prompt: str
    selected_lens: str
    model_used: str


# ── Core Helpers ─────────────────────────────────────────────────────────────

def map_contents(contents: List[Any]) -> List[Any]:
    """Maps frontend content parts to SDK-compatible structures."""
    final_parts = []
    for item in contents:
        if isinstance(item, str):
            final_parts.append(item)
        elif (isinstance(item, dict) and
              "inlineData" in item and
              isinstance(item["inlineData"], dict)):
            final_parts.append({
                "inline_data": {
                    "data": item["inlineData"].get("data"),
                    "mime_type": item["inlineData"].get("mimeType", "application/octet-stream")
                }
            })
    return final_parts


def build_system_instruction(
    active_lenses: Optional[List[str]],
    base_instruction: Optional[str] = None
) -> Optional[str]:
    """Retrieves high-rating examples from the RLHF cache to construct a dynamic system prompt."""
    if not active_lenses or not RLHF_CACHE:
        return base_instruction

    examples_sections = []
    for lens in active_lenses:
        if lens in RLHF_CACHE and RLHF_CACHE[lens]:
            # Take the top 3 examples for this lens
            top_examples = RLHF_CACHE[lens][-3:]
            for ex in top_examples:
                section = (
                    f"--- [GOLD STANDARD EXAMPLE FOR {lens}] ---\n"
                    f"USER REQUEST: {ex['prompt']}\n"
                    f"REQUIRED OUTPUT FORMAT:\n{ex['output']}"
                )
                examples_sections.append(section)

    if not examples_sections:
        return base_instruction

    preamble = (
        "CRITICAL IN-CONTEXT EXAMPLES:\n"
        "You must study the following examples. These are highly-rated examples "
        "representing exactly how you should structure and format your response.\n\n"
    )
    injection = (
        preamble
        + "\n\n".join(examples_sections)
        + "\n\nEnd of Examples. Base instruction follows:\n"
    )

    if base_instruction:
        return injection + base_instruction
    return injection


# ── Generation Logic ─────────────────────────────────────────────────────────

async def generate_single_prompt(
    task: ActiveTemplate,
    model_name: str,
    sys_instruction: Optional[str] = None
) -> TaskResult:
    """Executes a single task request asynchronously."""
    try:
        logger.info("Starting task %s using model %s", task.id, model_name)
        parts = map_contents(task.contents)

        config: Dict[str, Any] = {"temperature": 0.1}
        if sys_instruction:
            config["system_instruction"] = sys_instruction

        response = await CLIENT.aio.models.generate_content(
            model=model_name,
            contents=parts,
            config=config
        )
        logger.info("Task %s completed successfully.", task.id)
        return TaskResult(id=task.id, status="completed", raw_text=response.text)
    except Exception as e:  # pylint: disable=broad-exception-caught
        logger.exception("Generate single prompt failed for %s", task.id)
        return TaskResult(id=task.id, status="failed", error=f"{type(e).__name__}: {str(e)}")


# ── Routes ───────────────────────────────────────────────────────────────────

@app.get("/")
def health_check():
    """Service health check."""
    return {"status": "healthy", "service": "smart-prompt-builder", "version": "2.13.0"}


@app.post("/api/v1/generate/batch", response_model=Dict[str, List[TaskResult]])
async def batch_generate(request: Request, body: BatchGenerateRequest):
    """Concurrent processing for prompt batches."""
    origin = request.headers.get("origin", "NO-ORIGIN-HEADER")
    logger.info("Batch request from Origin: %s | tasks: %s", origin, len(body.tasks))

    try:
        actual_model_name = MODEL_ID_MAP.get(body.model_name, body.model_name)
        sys_instruction = build_system_instruction(body.active_lenses)
        coroutines = [
            generate_single_prompt(task, actual_model_name, sys_instruction)
            for task in body.tasks
        ]
        results = await asyncio.gather(*coroutines)
        return {"results": list(results)}
    except Exception:
        logger.error("Batch generation pipeline failed critically:\n%s", traceback.format_exc())
        raise


@app.post("/api/v1/generate/stream")
async def stream_generate(body: StreamGenerateRequest):
    """Universal streaming endpoint with server-side fallback."""
    async def event_generator():
        requested_model = MODEL_ID_MAP.get(body.model_name, body.model_name)
        models_to_try = [requested_model]
        for m in MODEL_FALLBACK_CHAIN:
            if m not in models_to_try:
                models_to_try.append(m)

        parts = map_contents(body.contents)
        sys_instruction = build_system_instruction(body.active_lenses, body.system_instruction)

        for model in models_to_try:
            try:
                logger.info("Attempting stream with %s", model)
                async for chunk in await CLIENT.aio.models.generate_content_stream(
                    model=model,
                    contents=parts,
                    config={"system_instruction": sys_instruction, "temperature": 0.1}
                ):
                    if chunk.text:
                        yield chunk.text
                logger.info("Streaming success with %s", model)
                return
            except Exception as e:  # pylint: disable=broad-exception-caught
                logger.warning("Stream failed for %s: %s", model, str(e))
                if model == models_to_try[-1]:
                    yield f"\n[GATEWAY_ERROR] All models exhausted: {str(e)}"

    return StreamingResponse(event_generator(), media_type="text/plain")


@app.post("/api/v1/feedback")
async def receive_feedback(body: FeedbackRequest):
    """Receives RLHF rating data and appends to a Google Sheet data sink."""
    try:
        # Structured logging for local/fallback tracking
        logger.info(
            "FEEDBACK RECEIVED | Rating: %s | Model: %s | Lens: %s | Prompt: %s",
            body.rating, body.model_used, body.selected_lens, body.original_prompt[:50]
        )

        # ── Phase 3: Sheets Persistence ──
        sheet_id = os.environ.get("RLHF_SHEET_ID")
        sa_json = os.environ.get("GOOGLE_SERVICE_ACCOUNT_JSON")

        if not sheet_id or not sa_json:
            logger.warning(
                "RLHF_SHEET_ID or GOOGLE_SERVICE_ACCOUNT_JSON not set. "
                "Feedback logged to stdout only."
            )
            return {
                "status": "success",
                "message": "Feedback recorded locally (Sheets DB inactive)"
            }

        credentials_dict = json.loads(sa_json)
        credentials = service_account.Credentials.from_service_account_info(
            credentials_dict,
            scopes=["https://www.googleapis.com/auth/spreadsheets"]
        )
        service = build('sheets', 'v4', credentials=credentials)

        timestamp = datetime.datetime.now(datetime.timezone.utc).isoformat()
        values = [[
            timestamp,
            body.rating,
            body.original_prompt,
            body.selected_lens,
            body.model_used,
            body.payload_content
        ]]

        body_data = {'values': values}
        # We assume the first sheet/tab is active, appending to A-F
        request = service.spreadsheets().values().append(  # pylint: disable=no-member
            spreadsheetId=sheet_id,
            range="A:F",
            valueInputOption="USER_ENTERED",
            insertDataOption="INSERT_ROWS",
            body=body_data
        )
        request.execute()

        logger.info("Feedback successfully written to Google Sheets.")
        return {"status": "success", "message": "Feedback recorded to database"}

    except Exception as e:  # pylint: disable=broad-exception-caught
        logger.error("Failed to record feedback to sheets: %s", traceback.format_exc())
        return JSONResponse(status_code=500, content={"detail": f"Database error: {str(e)}"})


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
