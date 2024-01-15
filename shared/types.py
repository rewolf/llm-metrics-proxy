"""
Shared type definitions for the OpenAI LLM Metrics Proxy.
These types are used by both backend and frontend.
"""

from typing import List, Optional
from dataclasses import dataclass


@dataclass
class ModelUsage:
    """Model usage statistics."""
    model: str
    count: int


@dataclass
class FinishReason:
    """Completion finish reason statistics."""
    reason: str
    count: int


@dataclass
class ErrorType:
    """Error type statistics."""
    type: str
    count: int


@dataclass
class OriginUsage:
    """Origin usage statistics."""
    origin: str
    count: int


@dataclass
class CompletionRequestData:
    """Individual completion request data for the /completion_requests endpoint."""
    timestamp: str
    time_to_first_token_ms: Optional[int]
    time_to_last_token_ms: Optional[int]
    is_streaming: bool
    success: bool
    message_count: Optional[int]
    prompt_tokens: Optional[int]
    tokens: dict[str, Optional[int]]  # total, prompt, completion


@dataclass
class Metrics:
    """Complete metrics data structure."""
    total_requests: int
    successful_requests: int
    failed_requests: int
    recent_requests_24h: int
    
    # Streaming stats
    streaming_requests: int
    non_streaming_requests: int
    
    # Token usage
    total_tokens_used: Optional[int]
    avg_tokens_per_request: Optional[float]
    
    # Performance
    avg_response_time_ms: float
    avg_tokens_per_second: Optional[float]
    
    # Streaming-specific metrics
    avg_time_to_first_token_ms: Optional[float]
    avg_time_to_last_token_ms: Optional[float]
    avg_completion_duration_ms: Optional[float]
    
    # Model usage
    top_models: List[ModelUsage]
    
    # Origin usage
    top_origins: List[OriginUsage]
    
    # Completion analysis
    finish_reasons: List[FinishReason]
    error_types: List[ErrorType]
    
    timestamp: str
