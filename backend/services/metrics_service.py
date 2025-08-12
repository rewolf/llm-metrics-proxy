"""
Metrics service for recording and managing completion request metrics.
"""

import logging
from typing import Optional
from ..database.connection import get_db_connection
from ..database.models import CompletionRequest

logger = logging.getLogger(__name__)


def record_request(
    success: bool,
    status_code: int,
    response_time_ms: int,
    model: Optional[str] = None,
    user: Optional[str] = None,
    origin: Optional[str] = None,
    is_streaming: bool = False,
    max_tokens: Optional[int] = None,
    temperature: Optional[float] = None,
    top_p: Optional[float] = None,
    message_count: Optional[int] = None,
    prompt_tokens: Optional[int] = None,
    completion_tokens: Optional[int] = None,
    total_tokens: Optional[int] = None,
    finish_reason: Optional[str] = None,
    time_to_first_token_ms: Optional[int] = None,
    time_to_last_token_ms: Optional[int] = None,
    tokens_per_second: Optional[float] = None,
    error_type: Optional[str] = None,
    error_message: Optional[str] = None
) -> None:
    """Record a completion request with enhanced metrics in the database."""
    try:
        with get_db_connection() as conn:
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
            ''', (
                success, status_code, response_time_ms, model, user,
                origin, is_streaming, max_tokens, temperature, top_p, message_count,
                prompt_tokens, completion_tokens, total_tokens, finish_reason,
                time_to_first_token_ms, time_to_last_token_ms, tokens_per_second,
                error_type, error_message
            ))
            
            conn.commit()
            logger.info(f"Request recorded successfully - Success: {success}, Status: {status_code}, Time: {response_time_ms}ms")
    except Exception as e:
        logger.error(f"Failed to record request to database: {e}")


def record_request_from_model(request: CompletionRequest) -> None:
    """Record a completion request using a CompletionRequest model."""
    record_request(
        success=request.success,
        status_code=request.status_code,
        response_time_ms=request.response_time_ms,
        model=request.model,
        user=request.user,
        origin=request.origin,
        is_streaming=request.is_streaming,
        max_tokens=request.max_tokens,
        temperature=request.temperature,
        top_p=request.top_p,
        message_count=request.message_count,
        prompt_tokens=request.prompt_tokens,
        completion_tokens=request.completion_tokens,
        total_tokens=request.total_tokens,
        finish_reason=request.finish_reason,
        time_to_first_token_ms=request.time_to_first_token_ms,
        time_to_last_token_ms=request.time_to_last_token_ms,
        tokens_per_second=request.tokens_per_second,
        error_type=request.error_type,
        error_message=request.error_message
    )
