import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch
from main import app, ModelAlias, MODEL_ID_MAP

client = TestClient(app, raise_server_exceptions=False)

def test_health_check():
    """Verify the health check endpoint returns 200 and correct metadata."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    assert "version" in response.json()

def test_model_mapping_logic():
    """Verify that the ModelAlias enum and ID map are consistent."""
    assert ModelAlias.FLASH == "2.5"
    assert ModelAlias.PRO == "3.1"
    assert MODEL_ID_MAP[ModelAlias.FLASH] == "gemini-2.5-flash"
    assert MODEL_ID_MAP[ModelAlias.PRO] == "gemini-2.5-pro"

@patch("main.CLIENT")
def test_batch_generate_task_level_sanitization(mock_client):
    """Verify that task-level failures return sanitized error strings, not tracebacks."""
    # Setup mock to raise an exception inside the async call
    mock_client.aio.models.generate_content = MagicMock(side_effect=Exception("Secret Expired"))
    
    payload = {
        "model_name": "2.5",
        "tasks": [{"id": "t1", "contents": ["hello"]}]
    }
    
    response = client.post("/api/v1/generate/batch", json=payload)
    assert response.status_code == 200
    
    results = response.json()["results"]
    assert results[0]["status"] == "failed"
    assert "Exception: Secret Expired" in results[0]["error"]
    # Verify NO traceback in the task-level error string
    assert "Traceback" not in results[0]["error"]
    assert "File \"" not in results[0]["error"]

@patch("main.asyncio.gather", side_effect=RuntimeError("Catastrophic Failure"))
def test_global_exception_handler_sanitization(mock_gather):
    """Verify that a catastrophic failure triggers the sanitized global 500 handler."""
    payload = {
        "model_name": "2.5",
        "tasks": [{"id": "t1", "contents": ["hello"]}]
    }
    
    response = client.post("/api/v1/generate/batch", json=payload)
    assert response.status_code == 500
    data = response.json()
    assert "detail" in data
    assert "Internal server error" in data["detail"]
    assert "traceback" not in data
    assert data["type"] == "RuntimeError"

def test_pydantic_validation():
    """Verify that malformed requests are rejected by Pydantic."""
    bad_payload = {"tasks": "not-a-list"}
    response = client.post("/api/v1/generate/batch", json=bad_payload)
    assert response.status_code == 422 # Unprocessable Entity
