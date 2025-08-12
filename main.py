#!/usr/bin/env python3
"""
OpenAI LLM Metrics Proxy

A simple reverse proxy that monitors OpenAI-compatible API requests and provides metrics.
This server only exposes the OpenAI API endpoints for security.
"""

import os
import sqlite3
import time
import logging
from datetime import datetime
from typing import Dict, Any

import httpx
from fastapi import FastAPI, Request, Response, HTTPException
import uvicorn
import asyncio

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Configuration
BACKEND_HOST = os.getenv("BACKEND_HOST", "ollama")
BACKEND_PORT = int(os.getenv("BACKEND_PORT", "11434"))
PROXY_PORT = int(os.getenv("PROXY_PORT", "8000"))
DB_PATH = os.getenv("DB_PATH", "./data/metrics.db")

# Backend base URL
BACKEND_BASE_URL = f"http://{BACKEND_HOST}:{BACKEND_PORT}"

app = FastAPI(title="OpenAI LLM Metrics Proxy", version="1.0.0")

def init_database():
    """Initialize the SQLite database with enhanced metrics table.
    
    Note: chat_id field was removed in v2.0.0 as it was unreliable
    and added complexity without providing real value.
    """
    logger.info(f"Initializing database at {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Check if old table exists with chat_id column
    cursor.execute("PRAGMA table_info(completion_requests)")
    columns = [column[1] for column in cursor.fetchall()]
    
    if 'chat_id' in columns:
        # Migrate existing table by creating new one without chat_id
        logger.info("Migrating existing database schema - removing chat_id column")
        cursor.execute("ALTER TABLE completion_requests RENAME TO completion_requests_old")
        
        # Create new table without chat_id
        cursor.execute('''
            CREATE TABLE completion_requests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                success BOOLEAN NOT NULL,
                status_code INTEGER,
                response_time_ms INTEGER,
                
                -- Request details
                model TEXT,
                user TEXT,
                origin TEXT,
                is_streaming BOOLEAN,
                max_tokens INTEGER,
                temperature REAL,
                top_p REAL,
                message_count INTEGER,
                
                -- Response details  
                prompt_tokens INTEGER,
                completion_tokens INTEGER,
                total_tokens INTEGER,
                finish_reason TEXT,
                
                -- Performance metrics
                time_to_first_token_ms INTEGER,
                time_to_last_token_ms INTEGER,
                tokens_per_second REAL,
                
                -- Error details
                error_type TEXT,
                error_message TEXT
            )
        ''')
        
        # Copy data from old table (excluding chat_id)
        cursor.execute('''
            INSERT INTO completion_requests (
                id, timestamp, success, status_code, response_time_ms,
                model, user, origin, is_streaming, max_tokens, temperature, top_p, message_count,
                prompt_tokens, completion_tokens, total_tokens, finish_reason,
                time_to_first_token_ms, time_to_last_token_ms, tokens_per_second,
                error_type, error_message
            )
            SELECT 
                id, timestamp, success, status_code, response_time_ms,
                model, user, NULL, is_streaming, max_tokens, temperature, top_p, message_count,
                prompt_tokens, completion_tokens, total_tokens, finish_reason,
                time_to_first_token_ms, time_to_last_token_ms, tokens_per_second,
                error_type, error_message
            FROM completion_requests_old
        ''')
        
        # Drop old table
        cursor.execute("DROP TABLE completion_requests_old")
        logger.info("Database migration completed successfully")
    else:
        # Check if origin column exists
        if 'origin' not in columns:
            # Add origin column to existing table
            logger.info("Adding origin column to existing database schema")
            cursor.execute("ALTER TABLE completion_requests ADD COLUMN origin TEXT")
            logger.info("Origin column added successfully")
        else:
            # Create new table if it doesn't exist
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS completion_requests (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    success BOOLEAN NOT NULL,
                    status_code INTEGER,
                    response_time_ms INTEGER,
                    
                    -- Request details
                    model TEXT,
                    user TEXT,
                    origin TEXT,
                    is_streaming BOOLEAN,
                    max_tokens INTEGER,
                    temperature REAL,
                    top_p REAL,
                    message_count INTEGER,
                    
                    -- Response details  
                    prompt_tokens INTEGER,
                    completion_tokens INTEGER,
                    total_tokens INTEGER,
                    finish_reason TEXT,
                    
                    -- Performance metrics
                    time_to_first_token_ms INTEGER,
                    time_to_last_token_ms INTEGER,
                    tokens_per_second REAL,
                    
                    -- Error details
                    error_type TEXT,
                    error_message TEXT
                )
            ''')
    
    logger.info("Database initialized successfully")
    conn.commit()
    conn.close()

def record_request(success: bool, status_code: int, response_time_ms: int, 
                  model: str = None, user: str = None,
                  is_streaming: bool = False, max_tokens: int = None,
                  temperature: float = None, top_p: float = None,
                  message_count: int = None, prompt_tokens: int = None,
                  completion_tokens: int = None, total_tokens: int = None,
                  finish_reason: str = None, time_to_first_token_ms: int = None,
                  time_to_last_token_ms: int = None, tokens_per_second: float = None,
                  error_type: str = None, error_message: str = None, origin: str = None):
    """Record a completion request with enhanced metrics in the database."""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO completion_requests (
                success, status_code, response_time_ms, model, user,
                origin, is_streaming, max_tokens, temperature, top_p, message_count,
                prompt_tokens, completion_tokens, total_tokens, finish_reason,
                time_to_first_token_ms, time_to_last_token_ms, tokens_per_second,
                error_type, error_message
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (success, status_code, response_time_ms, model, user,
              origin, is_streaming, max_tokens, temperature, top_p, message_count,
              prompt_tokens, completion_tokens, total_tokens, finish_reason,
              time_to_first_token_ms, time_to_last_token_ms, tokens_per_second,
              error_type, error_message))
        
        conn.commit()
        conn.close()
        logger.info(f"Request recorded successfully - Success: {success}, Status: {status_code}, Time: {response_time_ms}ms")
    except Exception as e:
        logger.error(f"Failed to record request to database: {e}")

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup."""
    init_database()
    logger.info(f"OpenAI LLM Metrics Proxy started")
    logger.info(f"Proxying to: {BACKEND_BASE_URL}")
    logger.info(f"Listening on port: {PROXY_PORT}")
    logger.info(f"Metrics dashboard available on separate port")
    print(f"OpenAI LLM Metrics Proxy started")
    print(f"Proxying to: {BACKEND_BASE_URL}")
    print(f"Listening on port: {PROXY_PORT}")
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
    model = None
    user = None
    origin = None
    is_streaming = False
    max_tokens = None
    temperature = None
    top_p = None
    message_count = None
    
    # Extract Origin header
    origin = headers.get("origin")
    
    try:
        import json
        body_dict = json.loads(body)
        model = body_dict.get("model")
        user = body_dict.get("user")
        is_streaming = body_dict.get("stream", False)
        max_tokens = body_dict.get("max_tokens")
        temperature = body_dict.get("temperature")
        top_p = body_dict.get("top_p")
        
        # Count messages in conversation
        messages = body_dict.get("messages", [])
        message_count = len(messages) if messages else None
        
        logger.info(f"[{request_id}] Request details - Model: {model}, User: {user}, Origin: {origin}, Streaming: {is_streaming}, Messages: {message_count}")
        
    except Exception as e:
        logger.error(f"[{request_id}] Error parsing request body: {e}")
    
    try:
        # Forward request to backend
        logger.info(f"[{request_id}] Forwarding request to backend: {BACKEND_BASE_URL}/v1/chat/completions")
        
        async with httpx.AsyncClient() as client:
            if is_streaming:
                # Handle streaming responses
                logger.info(f"[{request_id}] Handling streaming response")
                return await handle_streaming_response(client, body, headers, start_time, 
                                                   model, user, origin, is_streaming, 
                                                   max_tokens, temperature, top_p, message_count, request_id)
            else:
                # Handle non-streaming responses
                logger.info(f"[{request_id}] Handling non-streaming response")
                return await handle_non_streaming_response(client, body, headers, start_time,
                                                        model, user, origin, is_streaming,
                                                        max_tokens, temperature, top_p, message_count, request_id)
            
    except httpx.RequestError as e:
        # Record failed request
        response_time_ms = int((time.time() - start_time) * 1000)
        logger.error(f"[{request_id}] Request failed with error: {e}")
        
        record_request(
            success=False,
            status_code=500,
            response_time_ms=response_time_ms,
            model=model, user=user, origin=origin, is_streaming=is_streaming,
            max_tokens=max_tokens, temperature=temperature, top_p=top_p,
            message_count=message_count, error_type="connection_error",
            error_message=str(e)
        )
        
        raise HTTPException(
            status_code=500,
            detail=f"Failed to connect to backend: {str(e)}"
        )

async def handle_streaming_response(client, body, headers, start_time, 
                                 model, user, origin, is_streaming, 
                                 max_tokens, temperature, top_p, message_count, request_id):
    """Handle streaming responses with real-time token forwarding."""
    from fastapi.responses import StreamingResponse
    
    async def stream_generator():
        first_token_received = False
        first_token_time = None
        last_token_time = None
        chunk_count = 0
        
        try:
            logger.info(f"[{request_id}] Creating streaming client connection")
            # Create a new client for streaming to avoid context manager issues
            async with httpx.AsyncClient() as stream_client:
                logger.info(f"[{request_id}] Streaming request to backend")
                async with stream_client.stream("POST", f"{BACKEND_BASE_URL}/v1/chat/completions", 
                                       content=body, headers=headers, timeout=300.0) as response:
                    
                    logger.info(f"[{request_id}] Backend response status: {response.status_code}")
                    
                    if response.status_code != 200:
                        # Handle error response
                        error_content = await response.aread()
                        logger.error(f"[{request_id}] Backend returned error status: {response.status_code}")
                        record_request(
                            success=False,
                            status_code=response.status_code,
                            response_time_ms=int((time.time() - start_time) * 1000),
                            model=model, user=user, origin=origin, is_streaming=is_streaming,
                            max_tokens=max_tokens, temperature=temperature, top_p=top_p,
                            message_count=message_count, error_type="http_error",
                            error_message=f"Backend returned {response.status_code}"
                        )
                        yield error_content
                        return
                    
                    logger.info(f"[{request_id}] Starting to stream response chunks")
                    
                    # Variables to capture usage from stream
                    final_usage = None
                    finish_reason = "stream_complete"
                    
                    # Stream tokens as they arrive
                    async for chunk in response.aiter_bytes():
                        chunk_text = chunk.decode('utf-8', errors='ignore')
                        
                        # Check if this is the final usage chunk (before data: [DONE])
                        if chunk_text.strip() == "data: [DONE]":
                            logger.info(f"[{request_id}] Stream ended with [DONE] marker")
                            continue
                        
                        # Try to parse chunk for usage information
                        if chunk_text.startswith("data: "):
                            try:
                                import json
                                # Extract the JSON part after "data: "
                                json_str = chunk_text[6:]  # Remove "data: " prefix
                                if json_str.strip() and json_str.strip() != "[DONE]":
                                    chunk_data = json.loads(json_str)
                                    
                                    # Check if this chunk contains usage info
                                    if 'usage' in chunk_data and chunk_data['usage']:
                                        usage = chunk_data['usage']
                                        if usage.get('prompt_tokens') or usage.get('completion_tokens') or usage.get('total_tokens'):
                                            final_usage = usage
                                            logger.info(f"[{request_id}] Captured usage from stream: {usage}")
                                    
                                    # Check for finish reason
                                    if 'choices' in chunk_data and chunk_data['choices']:
                                        choice = chunk_data['choices'][0]
                                        if 'finish_reason' in choice and choice['finish_reason']:
                                            finish_reason = choice['finish_reason']
                                            logger.info(f"[{request_id}] Captured finish reason: {finish_reason}")
                            except (json.JSONDecodeError, KeyError) as e:
                                # Not a JSON chunk or missing expected fields, continue
                                pass
                        
                        if not first_token_received:
                            first_token_received = True
                            first_token_time = time.time()
                            logger.info(f"[{request_id}] First token received after {int((first_token_time - start_time) * 1000)}ms")
                        
                        chunk_count += 1
                        last_token_time = time.time()
                        yield chunk
                    
                    logger.info(f"[{request_id}] Streaming completed. Total chunks: {chunk_count}")
                    
                    # Record metrics after streaming completes
                    if first_token_received and last_token_time:
                        total_time_ms = int((last_token_time - start_time) * 1000)
                        time_to_first_token_ms = int((first_token_time - start_time) * 1000)
                        time_to_last_token_ms = total_time_ms
                        
                        # Extract token usage if available
                        prompt_tokens = final_usage.get('prompt_tokens') if final_usage else None
                        completion_tokens = final_usage.get('completion_tokens') if final_usage else None
                        total_tokens = final_usage.get('total_tokens') if final_usage else None
                        
                        # Calculate tokens per second if we have the data
                        tokens_per_second = None
                        if completion_tokens and time_to_last_token_ms:
                            tokens_per_second = (completion_tokens / (time_to_last_token_ms / 1000))
                        
                        logger.info(f"[{request_id}] Recording streaming metrics - Total time: {total_time_ms}ms, First token: {time_to_first_token_ms}ms, Tokens: {total_tokens}")
                        
                        record_request(
                            success=True,
                            status_code=200,
                            response_time_ms=total_time_ms,
                            model=model, user=user, origin=origin, is_streaming=is_streaming,
                            max_tokens=max_tokens, temperature=temperature, top_p=top_p,
                            message_count=message_count, prompt_tokens=prompt_tokens, completion_tokens=completion_tokens,
                            total_tokens=total_tokens, finish_reason=finish_reason,
                            time_to_first_token_ms=time_to_first_token_ms,
                            time_to_last_token_ms=time_to_last_token_ms,
                            tokens_per_second=tokens_per_second
                        )
                    else:
                        # Record failed streaming attempt
                        response_time_ms = int((time.time() - start_time) * 1000)
                        logger.error(f"[{request_id}] Streaming did not complete successfully")
                        record_request(
                            success=False,
                            status_code=500,
                            response_time_ms=response_time_ms,
                            model=model, user=user, is_streaming=is_streaming,
                            max_tokens=max_tokens, temperature=temperature, top_p=top_p,
                            message_count=message_count, error_type="streaming_incomplete",
                            error_message="Streaming did not complete successfully"
                        )
                    
        except Exception as e:
            # Record streaming error
            response_time_ms = int((time.time() - start_time) * 1000)
            logger.error(f"[{request_id}] Streaming error: {e}")
            record_request(
                success=False,
                status_code=500,
                response_time_ms=response_time_ms,
                model=model, user=user, is_streaming=is_streaming,
                max_tokens=max_tokens, temperature=temperature, top_p=top_p,
                message_count=message_count, error_type="streaming_error",
                error_message=str(e)
            )
            raise
    
    logger.info(f"[{request_id}] Returning streaming response")
    # Return streaming response with proper headers
    # Don't override Content-Type as it should come from the backend
    return StreamingResponse(
        stream_generator(),
        media_type="text/event-stream"
    )

async def handle_non_streaming_response(client, body, headers, start_time,
                                     model, user, is_streaming,
                                     max_tokens, temperature, top_p, message_count, request_id):
    """Handle non-streaming responses."""
    logger.info(f"[{request_id}] Sending non-streaming request to backend")
    
    response = await client.post(
        f"{BACKEND_BASE_URL}/v1/chat/completions",
        content=body,
        headers=headers,
        timeout=300.0
    )
    
    # Calculate response time
    response_time_ms = int((time.time() - start_time) * 1000)
    logger.info(f"[{request_id}] Backend response received - Status: {response.status_code}, Time: {response_time_ms}ms")
    
    # Extract response metrics
    prompt_tokens = None
    completion_tokens = None
    total_tokens = None
    finish_reason = None
    time_to_first_token_ms = None
    time_to_last_token_ms = None
    tokens_per_second = None
    
    if response.status_code == 200:
        try:
            response_data = response.json()
            
            # Extract token usage
            usage = response_data.get("usage", {})
            prompt_tokens = usage.get("prompt_tokens")
            completion_tokens = usage.get("completion_tokens")
            total_tokens = usage.get("total_tokens")
            
            # Extract finish reason
            choices = response_data.get("choices", [])
            if choices:
                finish_reason = choices[0].get("finish_reason")
            
            logger.info(f"[{request_id}] Response parsed - Tokens: {total_tokens}, Finish reason: {finish_reason}")
            
            # For non-streaming, timing is simpler
            time_to_first_token_ms = response_time_ms
            time_to_last_token_ms = response_time_ms
            
            if completion_tokens and time_to_last_token_ms:
                tokens_per_second = (completion_tokens / time_to_last_token_ms) * 1000
                
        except Exception as e:
            logger.error(f"[{request_id}] Error parsing response: {e}")
    
    # Record the request with enhanced metrics
    logger.info(f"[{request_id}] Recording non-streaming metrics")
    record_request(
        success=response.status_code == 200,
        status_code=response.status_code,
        response_time_ms=response_time_ms,
        model=model, user=user, is_streaming=is_streaming,
        max_tokens=max_tokens, temperature=temperature, top_p=top_p,
        message_count=message_count, prompt_tokens=prompt_tokens,
        completion_tokens=completion_tokens, total_tokens=total_tokens,
        finish_reason=finish_reason, time_to_first_token_ms=time_to_first_token_ms,
        time_to_last_token_ms=time_to_last_token_ms, tokens_per_second=tokens_per_second
    )
    
    logger.info(f"[{request_id}] Returning non-streaming response")
    # Return the response from backend
    return Response(
        content=response.content,
        status_code=response.status_code,
        headers=dict(response.headers)
        )

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}



@app.get("/test-stream")
async def test_stream():
    """Test streaming endpoint to verify streaming functionality."""
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
    uvicorn.run(app, host="0.0.0.0", port=PROXY_PORT)
