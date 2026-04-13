"""
Smart-Prompt-Builder Engine API
FastAPI backend for multi-modal, concurrent prompt generation via the Gemini GenAI SDK.
"""
import asyncio
import logging
import os
import traceback
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from google import genai
from pydantic import BaseModel

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize the Gemini GenAI Client
# Automatically picks up GEMINI_API_KEY from the environment
client = genai.Client()

app = FastAPI(
    title="Smart-Prompt-Builder Engine API",
    description="High-performance multi-modal processing backend",
    version="1.0.0"
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

# CORS Middleware - restricted to Google Apps Script origins only
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://script.google.com"],
    allow_origin_regex=r"https://.*\.script\.googleusercontent\.com",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request Models
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


# Async Task Executor Process
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
        response = await client.aio.models.generate_content(
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


@app.get("/")
def health_check():
    """Health check for Google Cloud Run deployment."""
    return {"status": "healthy", "service": "smart-prompt-builder-engine"}


@app.post("/api/v1/generate/batch", response_model=Dict[str, List[TaskResult]])
async def batch_generate(request: BatchGenerateRequest):
    """
    True server-side concurrent processing via Promise.all equivalent (asyncio.gather).
    Validates API key presence, maps model aliases, and dispatches all tasks concurrently.
    """
    logger.info("Received batch generation request for %s tasks.", len(request.tasks))
    if not os.environ.get("GEMINI_API_KEY"):
        logger.error("GEMINI_API_KEY not configured on server.")
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured on server.")

    try:
        # Map frontend visual tags to precise model IDs
        model_mapping = {
            "2.5": "gemini-2.5-flash",
            "3.1": "gemini-2.5-pro"
        }
        actual_model_name = model_mapping.get(request.model_name, request.model_name)

        coroutines = [
            generate_single_prompt(task, actual_model_name)
            for task in request.tasks
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
