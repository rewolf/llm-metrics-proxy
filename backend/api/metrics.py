"""
Metrics API endpoints for the OpenAI LLM Metrics Proxy.
"""

import sqlite3
from datetime import datetime
from typing import Dict, Any
from fastapi import APIRouter
from fastapi.middleware.cors import CORSMiddleware
from backend.database.connection import get_db_connection
from shared.types import Metrics, ModelUsage, FinishReason, ErrorType, OriginUsage

router = APIRouter(tags=["metrics"])


def get_metrics() -> Metrics:
    """Get enhanced metrics from the database."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Basic request counts
        cursor.execute("SELECT COUNT(*) FROM completion_requests")
        total_requests = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM completion_requests WHERE success = 1")
        successful_requests = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM completion_requests WHERE success = 0")
        failed_requests = cursor.fetchone()[0]
        
        # Recent requests (last 24 hours)
        cursor.execute("""
            SELECT COUNT(*) FROM completion_requests 
            WHERE timestamp >= datetime('now', '-1 day')
        """)
        recent_requests = cursor.fetchone()[0]
        
        # Streaming stats
        cursor.execute("SELECT COUNT(*) FROM completion_requests WHERE is_streaming = 1")
        streaming_requests = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM completion_requests WHERE is_streaming = 0")
        non_streaming_requests = cursor.fetchone()[0]
        
        # Token usage
        cursor.execute("SELECT SUM(total_tokens) FROM completion_requests WHERE total_tokens IS NOT NULL")
        total_tokens_used = cursor.fetchone()[0] or 0
        
        cursor.execute("SELECT AVG(total_tokens) FROM completion_requests WHERE total_tokens IS NOT NULL")
        avg_tokens_per_request = cursor.fetchone()[0] or 0
        
        # Performance metrics
        cursor.execute("SELECT AVG(response_time_ms) FROM completion_requests WHERE success = 1")
        avg_response_time_ms = cursor.fetchone()[0] or 0
        
        cursor.execute("SELECT AVG(tokens_per_second) FROM completion_requests WHERE tokens_per_second IS NOT NULL")
        avg_tokens_per_second = cursor.fetchone()[0] or 0
        
        # Model usage
        cursor.execute("""
            SELECT model, COUNT(*) as count 
            FROM completion_requests 
            WHERE model IS NOT NULL 
            GROUP BY model 
            ORDER BY count DESC 
            LIMIT 5
        """)
        top_models = [ModelUsage(model=row[0], count=row[1]) for row in cursor.fetchall()]
        
        # Origin usage
        cursor.execute("""
            SELECT origin, COUNT(*) as count 
            FROM completion_requests 
            WHERE origin IS NOT NULL 
            GROUP BY origin 
            ORDER BY count DESC 
            LIMIT 5
        """)
        top_origins = [OriginUsage(origin=row[0], count=row[1]) for row in cursor.fetchall()]
        
        # Finish reasons
        cursor.execute("""
            SELECT finish_reason, COUNT(*) as count 
            FROM completion_requests 
            WHERE finish_reason IS NOT NULL 
            GROUP BY finish_reason
        """)
        finish_reasons = [FinishReason(reason=row[0], count=row[1]) for row in cursor.fetchall()]
        
        # Error analysis
        cursor.execute("""
            SELECT error_type, COUNT(*) as count 
            FROM completion_requests 
            WHERE error_type IS NOT NULL 
            GROUP BY error_type
        """)
        error_types = [ErrorType(type=row[0], count=row[1]) for row in cursor.fetchall()]
        
        return Metrics(
            total_requests=total_requests,
            successful_requests=successful_requests,
            failed_requests=failed_requests,
            recent_requests_24h=recent_requests,
            streaming_requests=streaming_requests,
            non_streaming_requests=non_streaming_requests,
            total_tokens_used=total_tokens_used,
            avg_tokens_per_request=round(avg_tokens_per_request, 2) if avg_tokens_per_request else None,
            avg_response_time_ms=round(avg_response_time_ms, 2),
            avg_tokens_per_second=round(avg_tokens_per_second, 2) if avg_tokens_per_second else None,
            top_models=top_models,
            top_origins=top_origins,
            finish_reasons=finish_reasons,
            error_types=error_types,
            timestamp=datetime.now().isoformat()
        )


@router.get("/metrics")
async def metrics_endpoint() -> Metrics:
    """Return current metrics as JSON."""
    return get_metrics()


@router.get("/health")
async def health_check() -> Dict[str, str]:
    """Health check endpoint."""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}
