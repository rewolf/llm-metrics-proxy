#!/usr/bin/env python3
"""
OpenAI LLM Metrics Proxy

A simple reverse proxy that monitors OpenAI-compatible API requests and provides metrics.
This server only exposes the OpenAI API endpoints for security.
"""

import os
import sqlite3
import time
from datetime import datetime
from typing import Dict, Any

import httpx
from fastapi import FastAPI, Request, Response, HTTPException
import uvicorn

# Configuration
BACKEND_HOST = os.getenv("BACKEND_HOST", "ollama")
BACKEND_PORT = int(os.getenv("BACKEND_PORT", "11434"))
PROXY_PORT = int(os.getenv("PROXY_PORT", "8000"))
DB_PATH = os.getenv("DB_PATH", "./data/metrics.db")

# Backend base URL
BACKEND_BASE_URL = f"http://{BACKEND_HOST}:{BACKEND_PORT}"

app = FastAPI(title="OpenAI LLM Metrics Proxy", version="1.0.0")

def init_database():
    """Initialize the SQLite database with metrics table."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS completion_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            success BOOLEAN NOT NULL,
            status_code INTEGER,
            response_time_ms INTEGER,
            model TEXT,
            user TEXT
        )
    ''')
    
    conn.commit()
    conn.close()

def record_request(success: bool, status_code: int, response_time_ms: int, model: str = None, user: str = None):
    """Record a completion request in the database."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO completion_requests (success, status_code, response_time_ms, model, user)
        VALUES (?, ?, ?, ?, ?)
    ''', (success, status_code, response_time_ms, model, user))
    
    conn.commit()
    conn.close()

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup."""
    init_database()
    print(f"OpenAI LLM Metrics Proxy started")
    print(f"Proxying to: {BACKEND_BASE_URL}")
    print(f"Listening on port: {PROXY_PORT}")
    print(f"Metrics dashboard available on separate port")

@app.post("/v1/chat/completions")
async def proxy_chat_completions(request: Request):
    """Proxy chat completion requests to backend and track metrics."""
    start_time = time.time()
    
    # Get request body
    body = await request.body()
    
    # Get request headers
    headers = dict(request.headers)
    # Remove headers that shouldn't be forwarded
    headers.pop("host", None)
    headers.pop("content-length", None)
    
    # Extract model and user from request body for metrics
    model = None
    user = None
    try:
        import json
        body_dict = json.loads(body)
        model = body_dict.get("model")
        user = body_dict.get("user")
    except:
        pass
    
    try:
        # Forward request to backend
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{BACKEND_BASE_URL}/v1/chat/completions",
                content=body,
                headers=headers,
                timeout=300.0  # 5 minute timeout for long completions
            )
            
            # Calculate response time
            response_time_ms = int((time.time() - start_time) * 1000)
            
            # Record the request
            success = response.status_code == 200
            record_request(success, response.status_code, response_time_ms, model, user)
            
            # Return the response from backend
            return Response(
                content=response.content,
                status_code=response.status_code,
                headers=dict(response.headers)
            )
            
    except httpx.RequestError as e:
        # Record failed request
        response_time_ms = int((time.time() - start_time) * 1000)
        record_request(False, 500, response_time_ms, model, user)
        
        raise HTTPException(
            status_code=500,
            detail=f"Failed to connect to backend: {str(e)}"
        )

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=PROXY_PORT)
