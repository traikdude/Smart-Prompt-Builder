from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
import asyncio
from google import genai
import traceback
import logging

# Configure extreme logging
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
    error_trace = traceback.format_exc()
    logger.error(f"CRITICAL ERROR on {request.url.path}:\n{error_trace}")
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error caught by global handler.",
            "trace": str(exc),
            "traceback": error_trace
        }
    )

# CORS Middleware for Frontend connectivity
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
    id: str
    contents: List[Any]

class BatchGenerateRequest(BaseModel):
    model_name: str = "gemini-2.5-flash"
    tasks: List[ActiveTemplate]
    
class TaskResult(BaseModel):
    id: str
    status: str
    raw_text: Optional[str] = None
    error: Optional[str] = None

# Async Task Executor Process
async def generate_single_prompt(task: ActiveTemplate, model_name: str) -> TaskResult:
    try:
        logger.info(f"Starting generation for task {task.id} using model {model_name}")
        # Build Gemini SDK-compatible content parts.
        # Maps JS-style camelCase inlineData → Python snake_case inline_data.
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
        logger.info(f"Task {task.id} completed successfully.")
        return TaskResult(
            id=task.id,
            status="completed",
            raw_text=response.text
        )
    except Exception as e:
        error_trace = traceback.format_exc()
        logger.error(f"Generate single prompt failed for {task.id}:\n{error_trace}")
        return TaskResult(
            id=task.id,
            status="failed",
            error=str(e) + "\nTraceback: " + error_trace
        )

@app.get("/")
def health_check():
    """Health check for Google Cloud Run deployment"""
    return {"status": "healthy", "service": "smart-prompt-builder-engine"}

@app.post("/api/v1/generate/batch", response_model=Dict[str, List[TaskResult]])
async def batch_generate(request: BatchGenerateRequest):
    """
    True server-side concurrent processing via Promise.all equivalent (asyncio.gather).
    """
    logger.info(f"Received batch generation request for {len(request.tasks)} tasks.")
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
    except Exception as e:
        error_trace = traceback.format_exc()
        logger.error(f"Batch generation pipeline failed critically:\n{error_trace}")
        raise

if __name__ == "__main__":
    import uvicorn
    # Optional local dev server start
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
