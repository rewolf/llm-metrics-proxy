"""
Database models and schema definitions for the OpenAI LLM Metrics Proxy.
"""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class CompletionRequest:
    """Data model for completion request metrics."""
    id: Optional[int] = None
    timestamp: Optional[datetime] = None
    success: bool = False
    status_code: Optional[int] = None
    response_time_ms: Optional[int] = None
    
    # Request details
    model: Optional[str] = None
    user: Optional[str] = None
    origin: Optional[str] = None
    is_streaming: bool = False
    max_tokens: Optional[int] = None
    temperature: Optional[float] = None
    top_p: Optional[float] = None
    message_count: Optional[int] = None
    
    # Response details
    prompt_tokens: Optional[int] = None
    completion_tokens: Optional[int] = None
    total_tokens: Optional[int] = None
    finish_reason: Optional[str] = None
    
    # Performance metrics
    time_to_first_token_ms: Optional[int] = None
    time_to_last_token_ms: Optional[int] = None
    tokens_per_second: Optional[float] = None
    
    # Error details
    error_type: Optional[str] = None
    error_message: Optional[str] = None


# Database schema definition
COMPLETION_REQUESTS_SCHEMA = """
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
"""
