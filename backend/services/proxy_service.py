"""
Proxy service for handling OpenAI API requests and responses.
"""

import time
import json
import logging
from typing import Dict, Any, Optional
import httpx
from fastapi import Request, Response, HTTPException
from fastapi.responses import StreamingResponse
from ..database.models import CompletionRequest
from .metrics_service import record_request_from_model

logger = logging.getLogger(__name__)


class ProxyService:
    """Service for proxying OpenAI API requests to backend."""
    
    def __init__(self, backend_base_url: str):
        self.backend_base_url = backend_base_url
    
    def extract_request_metrics(self, request: Request, body: bytes) -> Dict[str, Any]:
        """Extract metrics from the incoming request."""
        metrics = {
            "model": None,
            "user": None,
            "origin": None,
            "is_streaming": False,
            "max_tokens": None,
            "temperature": None,
            "top_p": None,
            "message_count": None
        }
        
        # Extract Origin header
        headers = dict(request.headers)
        metrics["origin"] = headers.get("origin")
        
        try:
            body_dict = json.loads(body)
            metrics["model"] = body_dict.get("model")
            metrics["user"] = body_dict.get("user")
            metrics["is_streaming"] = body_dict.get("stream", False)
            metrics["max_tokens"] = body_dict.get("max_tokens")
            metrics["temperature"] = body_dict.get("temperature")
            metrics["top_p"] = body_dict.get("top_p")
            
            # Count messages in conversation
            messages = body_dict.get("messages", [])
            metrics["message_count"] = len(messages) if messages else None
            
        except Exception as e:
            logger.error(f"Error parsing request body: {e}")
        
        return metrics
    
    async def handle_streaming_response(
        self,
        body: bytes,
        headers: Dict[str, str],
        start_time: float,
        request_metrics: Dict[str, Any],
        request_id: str
    ) -> StreamingResponse:
        """Handle streaming responses with real-time token forwarding."""
        
        async def stream_generator():
            first_token_received = False
            first_token_time = None
            last_token_time = None
            chunk_count = 0
            
            try:
                logger.info(f"[{request_id}] Creating streaming client connection")
                async with httpx.AsyncClient() as stream_client:
                    logger.info(f"[{request_id}] Streaming request to backend")
                    async with stream_client.stream(
                        "POST", 
                        f"{self.backend_base_url}/v1/chat/completions", 
                        content=body, 
                        headers=headers, 
                        timeout=300.0
                    ) as response:
                        
                        logger.info(f"[{request_id}] Backend response status: {response.status_code}")
                        
                        if response.status_code != 200:
                            # Handle error response
                            error_content = await response.aread()
                            logger.error(f"[{request_id}] Backend returned error status: {response.status_code}")
                            
                            # Record failed request
                            self._record_failed_request(
                                start_time, request_metrics, response.status_code,
                                "http_error", f"Backend returned {response.status_code}"
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
                            self._record_successful_request(
                                start_time, request_metrics, first_token_time, last_token_time,
                                final_usage, finish_reason
                            )
                        else:
                            # Record failed streaming attempt
                            self._record_failed_request(
                                start_time, request_metrics, 500,
                                "streaming_incomplete", "Streaming did not complete successfully"
                            )
                    
            except Exception as e:
                # Record streaming error
                logger.error(f"[{request_id}] Streaming error: {e}")
                self._record_failed_request(
                    start_time, request_metrics, 500,
                    "streaming_error", str(e)
                )
                raise
        
        logger.info(f"[{request_id}] Returning streaming response")
        return StreamingResponse(
            stream_generator(),
            media_type="text/event-stream"
        )
    
    async def handle_non_streaming_response(
        self,
        body: bytes,
        headers: Dict[str, str],
        start_time: float,
        request_metrics: Dict[str, Any],
        request_id: str
    ) -> Response:
        """Handle non-streaming responses."""
        logger.info(f"[{request_id}] Sending non-streaming request to backend")
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.backend_base_url}/v1/chat/completions",
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
                    
                    # Record successful request
                    self._record_successful_non_streaming_request(
                        start_time, request_metrics, response.status_code,
                        prompt_tokens, completion_tokens, total_tokens, finish_reason
                    )
                    
                except Exception as e:
                    logger.error(f"[{request_id}] Error parsing response: {e}")
                    self._record_failed_request(
                        start_time, request_metrics, response.status_code,
                        "response_parse_error", str(e)
                    )
            else:
                # Record failed request
                self._record_failed_request(
                    start_time, request_metrics, response.status_code,
                    "http_error", f"Backend returned {response.status_code}"
                )
            
            logger.info(f"[{request_id}] Returning non-streaming response")
            return Response(
                content=response.content,
                status_code=response.status_code,
                headers=dict(response.headers)
            )
    
    def _record_successful_request(
        self,
        start_time: float,
        request_metrics: Dict[str, Any],
        first_token_time: float,
        last_token_time: float,
        usage: Optional[Dict[str, Any]],
        finish_reason: str
    ) -> None:
        """Record a successful streaming request."""
        total_time_ms = int((last_token_time - start_time) * 1000)
        time_to_first_token_ms = int((first_token_time - start_time) * 1000)
        time_to_last_token_ms = total_time_ms
        
        # Extract token usage if available
        prompt_tokens = usage.get('prompt_tokens') if usage else None
        completion_tokens = usage.get('completion_tokens') if usage else None
        total_tokens = usage.get('total_tokens') if usage else None
        
        # Calculate tokens per second if we have the data
        tokens_per_second = None
        if completion_tokens and time_to_last_token_ms:
            tokens_per_second = (completion_tokens / (time_to_last_token_ms / 1000))
        
        request = CompletionRequest(
            success=True,
            status_code=200,
            response_time_ms=total_time_ms,
            model=request_metrics["model"],
            user=request_metrics["user"],
            origin=request_metrics["origin"],
            is_streaming=request_metrics["is_streaming"],
            max_tokens=request_metrics["max_tokens"],
            temperature=request_metrics["temperature"],
            top_p=request_metrics["top_p"],
            message_count=request_metrics["message_count"],
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
            total_tokens=total_tokens,
            finish_reason=finish_reason,
            time_to_first_token_ms=time_to_first_token_ms,
            time_to_last_token_ms=time_to_last_token_ms,
            tokens_per_second=tokens_per_second
        )
        
        record_request_from_model(request)
    
    def _record_successful_non_streaming_request(
        self,
        start_time: float,
        request_metrics: Dict[str, Any],
        status_code: int,
        prompt_tokens: Optional[int],
        completion_tokens: Optional[int],
        total_tokens: Optional[int],
        finish_reason: Optional[str]
    ) -> None:
        """Record a successful non-streaming request."""
        response_time_ms = int((time.time() - start_time) * 1000)
        
        # For non-streaming, timing is simpler
        time_to_first_token_ms = response_time_ms
        time_to_last_token_ms = response_time_ms
        
        tokens_per_second = None
        if completion_tokens and time_to_last_token_ms:
            tokens_per_second = (completion_tokens / time_to_last_token_ms) * 1000
        
        request = CompletionRequest(
            success=True,
            status_code=status_code,
            response_time_ms=response_time_ms,
            model=request_metrics["model"],
            user=request_metrics["user"],
            origin=request_metrics["origin"],
            is_streaming=request_metrics["is_streaming"],
            max_tokens=request_metrics["max_tokens"],
            temperature=request_metrics["temperature"],
            top_p=request_metrics["top_p"],
            message_count=request_metrics["message_count"],
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
            total_tokens=total_tokens,
            finish_reason=finish_reason,
            time_to_first_token_ms=time_to_first_token_ms,
            time_to_last_token_ms=time_to_last_token_ms,
            tokens_per_second=tokens_per_second
        )
        
        record_request_from_model(request)
    
    def _record_failed_request(
        self,
        start_time: float,
        request_metrics: Dict[str, Any],
        status_code: int,
        error_type: str,
        error_message: str
    ) -> None:
        """Record a failed request."""
        response_time_ms = int((time.time() - start_time) * 1000)
        
        request = CompletionRequest(
            success=False,
            status_code=status_code,
            response_time_ms=response_time_ms,
            model=request_metrics["model"],
            user=request_metrics["user"],
            origin=request_metrics["origin"],
            is_streaming=request_metrics["is_streaming"],
            max_tokens=request_metrics["max_tokens"],
            temperature=request_metrics["temperature"],
            top_p=request_metrics["top_p"],
            message_count=request_metrics["message_count"],
            error_type=error_type,
            error_message=error_message
        )
        
        record_request_from_model(request)
