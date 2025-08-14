"""
Shared type definitions for the LLM Metrics Proxy.
These types are used by both backend and frontend.
"""

from typing import List, Optional, Dict
from pydantic import BaseModel, Field


class ModelUsage(BaseModel):
    """Model usage statistics."""
    model: str
    count: int


class FinishReason(BaseModel):
    """Completion finish reason statistics."""
    reason: str
    count: int


class ErrorType(BaseModel):
    """Error type statistics."""
    type: str
    count: int


class OriginUsage(BaseModel):
    """Origin usage statistics."""
    origin: str
    count: int


class CompletionRequestData(BaseModel):
    """Individual completion request data for the /completion_requests endpoint."""
    timestamp: str
    time_to_first_token_ms: Optional[int] = None
    time_to_last_token_ms: Optional[int] = None
    is_streaming: bool
    success: bool
    message_count: Optional[int] = None
    prompt_tokens: Optional[int] = None
    tokens: Dict[str, Optional[int]] = Field(default_factory=dict)  # total, prompt, completion
    model: Optional[str] = None


class RequestsSummary(BaseModel):
    """Overall requests summary."""
    total: int
    successful: int
    failed: int
    avg_response_time_ms: float


class TokenMetrics(BaseModel):
    """Token usage statistics."""
    reported_count: int
    total: int
    prompt_total: int
    completion_total: int
    avg_tokens_per_second: Optional[float] = None
    
    class Config:
        json_encoders = {
            float: lambda v: round(v, 2) if v is not None else None
        }


class StreamedRequests(BaseModel):
    """Streaming requests statistics."""
    total: int
    successful: int
    failed: int
    tokens: TokenMetrics
    error_types: Dict[str, int]
    avg_response_time_ms: float
    avg_time_to_first_token_ms: Optional[float] = None
    avg_time_to_last_token_ms: Optional[float] = None
    avg_completion_duration_ms: Optional[float] = None


class NonStreamedRequests(BaseModel):
    """Non-streaming requests statistics."""
    total: int
    successful: int
    failed: int
    tokens: TokenMetrics
    error_types: Dict[str, int]
    avg_time_to_first_token_ms: Optional[float] = None
    avg_time_to_last_token_ms: Optional[float] = None
    avg_completion_duration_ms: Optional[float] = None


class Requests(BaseModel):
    """All requests data grouped together."""
    total: RequestsSummary
    streamed: StreamedRequests
    non_streamed: NonStreamedRequests


class Metrics(BaseModel):
    """Complete metrics data structure with new nested API design."""
    timestamp: str
    requests: Requests
    model_distribution: Dict[str, int]
    origin_distribution: Dict[str, int]
    
    class Config:
        json_encoders = {
            float: lambda v: round(v, 2) if v is not None else None
        }
