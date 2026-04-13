from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
import asyncio
from google import genai
from google.genai import types

# Initialize the Gemini GenAI Client
# Automatically picks up GEMINI_API_KEY from the environment
client = genai.Client()

app = FastAPI(
    title="Smart-Prompt-Builder Engine API",
    description="High-performance multi-modal processing backend",
    version="1.0.0"
)

# CORS Middleware for Frontend connectivity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to the exact caller origins (Google Sites URL, etc.)
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
        return TaskResult(
            id=task.id,
            status="completed",
            raw_text=response.text
        )
    except Exception as e:
        return TaskResult(
            id=task.id,
            status="failed",
            error=str(e)
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
    if not os.environ.get("GEMINI_API_KEY"):
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured on server.")
        
    coroutines = [
        generate_single_prompt(task, request.model_name)
        for task in request.tasks
    ]
    
    # Process all template nodes concurrently without blocking
    results = await asyncio.gather(*coroutines)
    
    return {"results": list(results)}

if __name__ == "__main__":
    import uvicorn
    # Optional local dev server start
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
