#!/usr/bin/env python3
"""
OpenAI LLM Metrics Proxy - Main Application

A simple reverse proxy that monitors OpenAI-compatible API requests and provides metrics.
This server only exposes the OpenAI API endpoints for security.
"""

import time
import logging
from datetime import datetime
from fastapi import FastAPI, Request, HTTPException, Response
import uvicorn
import httpx

from backend.database.migrations import run_migrations
from backend.services.proxy_service import ProxyService
from backend.utils.config import Config

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(title="OpenAI LLM Metrics Proxy", version="1.0.0")

# Initialize proxy service
proxy_service = ProxyService(Config.get_backend_url())


@app.on_event("startup")
async def startup_event():
    """Initialize application on startup."""
    # Run database migrations
    run_migrations()
    
    logger.info(f"OpenAI LLM Metrics Proxy started")
    logger.info(f"Proxying to: {Config.get_backend_url()}")
    logger.info(f"Listening on port: {Config.get_proxy_port()}")
    logger.info(f"Metrics dashboard available on separate port")
    
    print(f"OpenAI LLM Metrics Proxy started")
    print(f"Proxying to: {Config.get_backend_url()}")
    print(f"Listening on port: {Config.get_proxy_port()}")
    print(f"Metrics dashboard available on separate port")


@app.post("/v1/chat/completions")
async def proxy_chat_completions(request: Request):
    """Proxy chat completion requests to backend and track enhanced metrics."""
    start_time = time.time()
    request_id = f"req_{int(start_time * 1000)}"
    
    logger.info(f"[{request_id}] New completion request received")
    
    # Get request body
    body = await request.body()
    logger.info(f"[{request_id}] Request body size: {len(body)} bytes")
    
    # Get request headers
    headers = dict(request.headers)
    # Remove headers that shouldn't be forwarded
    headers.pop("host", None)
    headers.pop("content-length", None)
    
    # Extract request parameters for metrics
    request_metrics = proxy_service.extract_request_metrics(request, body)
    
    logger.info(f"[{request_id}] Request details - Model: {request_metrics['model']}, "
                f"User: {request_metrics['user']}, Origin: {request_metrics['origin']}, "
                f"Streaming: {request_metrics['is_streaming']}, Messages: {request_metrics['message_count']}")
    
    try:
        # Forward request to backend
        logger.info(f"[{request_id}] Forwarding request to backend: {Config.get_backend_url()}/v1/chat/completions")
        
        if request_metrics["is_streaming"]:
            # Handle streaming responses
            logger.info(f"[{request_id}] Handling streaming response")
            return await proxy_service.handle_streaming_response(
                body, headers, start_time, request_metrics, request_id
            )
        else:
            # Handle non-streaming responses
            logger.info(f"[{request_id}] Handling non-streaming response")
            return await proxy_service.handle_non_streaming_response(
                body, headers, start_time, request_metrics, request_id
            )
            
    except Exception as e:
        # Record failed request
        logger.error(f"[{request_id}] Request failed with error: {e}")
        
        # Record the failed request
        proxy_service._record_failed_request(
            start_time, request_metrics, 500, "connection_error", str(e)
        )
        
        raise HTTPException(
            status_code=500,
            detail=f"Failed to connect to backend: {str(e)}"
        )


@app.get("/v1/models")
async def proxy_models():
    """Proxy models list requests to backend without logging to database."""
    logger.info("Models list request received")
    
    try:
        # Forward request to backend
        logger.info(f"Forwarding models request to backend: {Config.get_backend_url()}/v1/models")
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{Config.get_backend_url()}/v1/models",
                timeout=30.0
            )
            
            logger.info(f"Backend models response - Status: {response.status_code}")
            
            # Return the response from backend
            return Response(
                content=response.content,
                status_code=response.status_code,
                headers=dict(response.headers)
            )
            
    except Exception as e:
        logger.error(f"Models request failed with error: {e}")
        
        raise HTTPException(
            status_code=500,
            detail=f"Failed to connect to backend: {str(e)}"
        )


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}


@app.get("/test-stream")
async def test_stream():
    """Test streaming endpoint to verify streaming functionality."""
    import asyncio
    from fastapi.responses import StreamingResponse
    
    async def test_stream_generator():
        for i in range(10):
            yield f"data: {{'message': 'Test message {i}', 'timestamp': '{datetime.now().isoformat()}'}}\n\n"
            await asyncio.sleep(0.5)
        yield "data: [DONE]\n\n"
    
    return StreamingResponse(
        test_stream_generator(),
        media_type="text/event-stream"
    )


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=Config.get_proxy_port())
