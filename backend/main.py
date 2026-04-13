"""
Smart-Prompt-Builder Engine API
FastAPI backend for multi-modal, concurrent prompt generation via the Gemini GenAI SDK.
"""
import asyncio
import logging
import os
import traceback
from contextlib import asynccontextmanager
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from google import genai
from pydantic import BaseModel

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Module-level GenAI client — intentionally unset until lifespan validates the secret.
# UPPER_CASE signals this is a module-level constant (Pylint C0103).
# Initialized inside lifespan() to ensure GEMINI_API_KEY is present first.
CLIENT: Optional[genai.Client] = None


@asynccontextmanager
async def lifespan(app: FastAPI):  # pylint: disable=redefined-outer-name,unused-argument
    """
    Application lifespan manager.
    Validates GEMINI_API_KEY and initializes the GenAI client before the
    server begins accepting requests. Raises RuntimeError on missing secret
    so Cloud Run's readiness probe fails fast with a visible error instead
    of silently routing traffic to a broken instance.
    """
    global CLIENT  # pylint: disable=global-statement
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError(
            "GEMINI_API_KEY is not set in the environment. "
            "Verify the Secret Manager binding on the Cloud Run service and redeploy."
        )
    CLIENT = genai.Client()
    logger.info("GEMINI_API_KEY validated. GenAI client initialized. Service ready.")
    yield
    # Teardown — release CLIENT reference on shutdown
    CLIENT = None
    logger.info("Service shutdown complete.")


app = FastAPI(
    title="Smart-Prompt-Builder Engine API",
    description="High-performance multi-modal processing backend",
    version="2.12.0",
    lifespan=lifespan,
)

# Exception handler for unhandled exceptions to catch the 500 error
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global trap for all unhandled backend HTTP exceptions."""
    error_trace = traceback.format_exc()
    logger.error("CRITICAL ERROR on %s:\n%s", request.url.path, error_trace)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error caught by global handler.",
            "trace": str(exc),
            "traceback": error_trace
        }
    )

# CORS Middleware — open to all origins so the GAS iframe can reach the backend.
# The API has no user auth layer — security comes from the server-side Gemini API key.
# NOTE: Once the real GAS iframe Origin is captured from logs, lock allow_origins
#       back down to that specific subdomain pattern.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


# ── Request / Response Models ────────────────────────────────────────────────

class ActiveTemplate(BaseModel):
    """Schema representing an active prompt template item requested from the client."""

    id: str
    contents: List[Any]


class BatchGenerateRequest(BaseModel):
    """Schema enforcing the batch of prompts to process simultaneously."""

    model_name: str = "gemini-2.5-flash"
    tasks: List[ActiveTemplate]


class TaskResult(BaseModel):
    """Schema representing the status and generated payload of a processed task."""

    id: str
    status: str
    raw_text: Optional[str] = None
    error: Optional[str] = None


# ── Core Generation Logic ────────────────────────────────────────────────────

async def generate_single_prompt(task: ActiveTemplate, model_name: str) -> TaskResult:
    """Executes a single structural task request asynchronously via the Gemini SDK."""
    try:
        logger.info("Starting generation for task %s using model %s", task.id, model_name)
        # Build Gemini SDK-compatible content parts.
        # Maps JS-style camelCase inlineData -> Python snake_case inline_data.
        final_parts = []
        for item in task.contents:
            if isinstance(item, str):
                final_parts.append(item)
            elif isinstance(item, dict) and "inlineData" in item:
                final_parts.append({
                    "inline_data": {
                        "data": item["inlineData"]["data"],
                        "mime_type": item["inlineData"]["mimeType"]
                    }
                })

        # Run generation async natively with the Google GenAI SDK
        response = await CLIENT.aio.models.generate_content(
            model=model_name,
            contents=final_parts
        )
        logger.info("Task %s completed successfully.", task.id)
        return TaskResult(
            id=task.id,
            status="completed",
            raw_text=response.text
        )
    except Exception as e:  # pylint: disable=broad-exception-caught
        error_trace = traceback.format_exc()
        logger.error("Generate single prompt failed for %s:\n%s", task.id, error_trace)
        return TaskResult(
            id=task.id,
            status="failed",
            error=str(e) + "\nTraceback: " + error_trace
        )


# ── Routes ───────────────────────────────────────────────────────────────────

@app.get("/")
def health_check():
    """Health check for Google Cloud Run deployment."""
    return {"status": "healthy", "service": "smart-prompt-builder", "version": "2.12.5"}


@app.post("/api/v1/generate/batch", response_model=Dict[str, List[TaskResult]])
async def batch_generate(request: Request, body: BatchGenerateRequest):
    """
    True server-side concurrent processing via Promise.all equivalent (asyncio.gather).
    Maps model aliases, dispatches all tasks concurrently, and returns aggregated results.
    API key validation is handled at startup via the lifespan manager — not per-request.
    """
    origin = request.headers.get("origin", "NO-ORIGIN-HEADER")
    logger.info("Batch request from Origin: %s | tasks: %s", origin, len(body.tasks))

    try:
        # Cost optimization (2026-04-13): '3.1' previously mapped to gemini-2.5-pro
        # which is 8-10x more expensive than Flash for standard workloads. Pro
        # restored by request — the frontend UI now clearly labels it as a premium model.
        # 💰 Cost reference: Flash = $2.50/1M output tokens | Pro = $10-15/1M output tokens
        model_mapping = {
            "2.5": "gemini-2.5-flash",
            "3.1": "gemini-2.5-pro"
        }
        actual_model_name = model_mapping.get(body.model_name, body.model_name)

        coroutines = [
            generate_single_prompt(task, actual_model_name)
            for task in body.tasks
        ]

        # Process all template nodes concurrently without blocking
        results = await asyncio.gather(*coroutines)
        logger.info("Batch generation completed successfully.")
        return {"results": list(results)}
    except Exception:
        error_trace = traceback.format_exc()
        logger.error("Batch generation pipeline failed critically:\n%s", error_trace)
        raise


if __name__ == "__main__":
    import uvicorn
    # Optional local dev server start
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
