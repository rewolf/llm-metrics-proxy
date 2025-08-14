"""
Shared type definitions for the LLM Metrics Proxy.
These types are used by both backend and frontend.
"""

from typing import List, Optional, Dict
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
    model: Optional[str] = None


@dataclass
class Metrics:
    """Complete metrics data structure."""
    total_requests: int
    successful_requests: int
    failed_requests: int
    
    # Success rate
    success_rate: float
    
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
    
    # Model usage (as dictionary for backward compatibility)
    model_distribution: Dict[str, int]
    
    # Origin usage
    origin_distribution: Dict[str, int]
    
    # Completion analysis (as dictionaries for backward compatibility)
    finish_reasons: Dict[str, int]
    error_types: Dict[str, int]
    
    # Token averages
    avg_prompt_tokens: Optional[float]
    avg_completion_tokens: Optional[float]
    avg_total_tokens: Optional[float]
    
    timestamp: str
