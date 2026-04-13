"""
Smart-Prompt-Builder Engine API
FastAPI backend for multi-modal, concurrent prompt generation via the Gemini GenAI SDK.
"""
import asyncio
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
from pydantic import BaseModel

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Module-level GenAI client — intentionally unset until lifespan validates the secret.
CLIENT: Optional[genai.Client] = None


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
    tasks: List[ActiveTemplate]


class StreamGenerateRequest(BaseModel):
    """Schema for single-task streaming generation."""
    model_name: str = "gemini-2.5-flash"
    contents: List[Any]
    system_instruction: Optional[str] = None


class TaskResult(BaseModel):
    """Schema representing the status and generated payload of a processed task."""
    id: str
    status: str
    raw_text: Optional[str] = None
    error: Optional[str] = None


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


# ── Generation Logic ─────────────────────────────────────────────────────────

async def generate_single_prompt(task: ActiveTemplate, model_name: str) -> TaskResult:
    """Executes a single task request asynchronously."""
    try:
        logger.info("Starting task %s using model %s", task.id, model_name)
        parts = map_contents(task.contents)
        response = await CLIENT.aio.models.generate_content(
            model=model_name,
            contents=parts
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
        coroutines = [generate_single_prompt(task, actual_model_name) for task in body.tasks]
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

        for model in models_to_try:
            try:
                logger.info("Attempting stream with %s", model)
                async for chunk in await CLIENT.aio.models.generate_content_stream(
                    model=model,
                    contents=parts,
                    config={"system_instruction": body.system_instruction, "temperature": 0.1}
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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
