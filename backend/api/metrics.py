"""
Metrics API endpoints for the OpenAI LLM Metrics Proxy.
"""

import sqlite3
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Query
from fastapi.middleware.cors import CORSMiddleware
from backend.database.connection import get_db_connection
from shared.types import Metrics, ModelUsage, FinishReason, ErrorType, OriginUsage, CompletionRequestData

router = APIRouter(tags=["metrics"])


def get_metrics(start_date: Optional[str] = None, end_date: Optional[str] = None) -> Metrics:
    """Get enhanced metrics from the database with optional date filtering."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Log the date filtering parameters for debugging
        if start_date or end_date:
            print(f"Date filtering - Start: {start_date}, End: {end_date}")
        
        # Build date filter conditions
        date_filter = ""
        date_params = []
        if start_date:
            # Use SQLite datetime function to compare properly
            date_filter += " AND datetime(timestamp) >= datetime(?)"
            date_params.append(start_date)
            print(f"Added start filter: datetime(timestamp) >= datetime('{start_date}')")
        if end_date:
            # Use SQLite datetime function to compare properly
            date_filter += " AND datetime(timestamp) <= datetime(?)"
            date_params.append(end_date)
            print(f"Added end filter: datetime(timestamp) <= datetime('{end_date}')")
        
        # Basic request counts
        cursor.execute(f"SELECT COUNT(*) FROM completion_requests WHERE 1=1{date_filter}", date_params)
        total_requests = cursor.fetchone()[0]
        print(f"Total requests with filter: {total_requests}")
        
        cursor.execute(f"SELECT COUNT(*) FROM completion_requests WHERE success = 1{date_filter}", date_params)
        successful_requests = cursor.fetchone()[0]
        
        cursor.execute(f"SELECT COUNT(*) FROM completion_requests WHERE success = 0{date_filter}", date_params)
        failed_requests = cursor.fetchone()[0]
        
        # Recent requests (last 24 hours) - only if no date filter is applied
        if not start_date and not end_date:
            cursor.execute("""
                SELECT COUNT(*) FROM completion_requests 
                WHERE timestamp >= datetime('now', '-1 day')
            """)
            recent_requests = cursor.fetchone()[0]
        else:
            # When date filtering is applied, recent requests should be the filtered count
            # since we're already looking at a specific time period
            recent_requests = total_requests
        
        # Streaming stats
        cursor.execute(f"SELECT COUNT(*) FROM completion_requests WHERE is_streaming = 1{date_filter}", date_params)
        streaming_requests = cursor.fetchone()[0]
        
        cursor.execute(f"SELECT COUNT(*) FROM completion_requests WHERE is_streaming = 0{date_filter}", date_params)
        non_streaming_requests = cursor.fetchone()[0]
        
        # Token usage
        cursor.execute(f"SELECT SUM(total_tokens) FROM completion_requests WHERE total_tokens IS NOT NULL{date_filter}", date_params)
        total_tokens_used = cursor.fetchone()[0] or 0
        
        cursor.execute(f"SELECT AVG(total_tokens) FROM completion_requests WHERE total_tokens IS NOT NULL{date_filter}", date_params)
        avg_tokens_per_request = cursor.fetchone()[0] or 0
        
        # Performance metrics
        cursor.execute(f"SELECT AVG(response_time_ms) FROM completion_requests WHERE success = 1{date_filter}", date_params)
        avg_response_time_ms = cursor.fetchone()[0] or 0
        
        cursor.execute(f"SELECT AVG(tokens_per_second) FROM completion_requests WHERE tokens_per_second IS NOT NULL{date_filter}", date_params)
        avg_tokens_per_second = cursor.fetchone()[0] or 0
        
        # Model usage
        cursor.execute(f"""
            SELECT model, COUNT(*) as count 
            FROM completion_requests 
            WHERE model IS NOT NULL {date_filter}
            GROUP BY model 
            ORDER BY count DESC 
            LIMIT 5
        """, date_params)
        top_models = [ModelUsage(model=row[0], count=row[1]) for row in cursor.fetchall()]
        
        # Origin usage
        cursor.execute(f"""
            SELECT origin, COUNT(*) as count 
            FROM completion_requests 
            WHERE origin IS NOT NULL {date_filter}
            GROUP BY origin 
            ORDER BY count DESC 
            LIMIT 5
        """, date_params)
        top_origins = [OriginUsage(origin=row[0], count=row[1]) for row in cursor.fetchall()]
        
        # Finish reasons
        cursor.execute(f"""
            SELECT finish_reason, COUNT(*) as count 
            FROM completion_requests 
            WHERE finish_reason IS NOT NULL {date_filter}
            GROUP BY finish_reason
        """, date_params)
        finish_reasons = [FinishReason(reason=row[0], count=row[1]) for row in cursor.fetchall()]
        
        # Error analysis
        cursor.execute(f"""
            SELECT error_type, COUNT(*) as count 
            FROM completion_requests 
            WHERE error_type IS NOT NULL {date_filter}
            GROUP BY error_type
        """, date_params)
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


def get_completion_requests(start_date: Optional[str] = None, end_date: Optional[str] = None) -> List[CompletionRequestData]:
    """Get completion requests from the database with optional date filtering."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Log the date filtering parameters for debugging
        if start_date or end_date:
            print(f"Completion requests date filtering - Start: {start_date}, End: {end_date}")
        
        # Build date filter conditions
        date_filter = ""
        date_params = []
        if start_date:
            # Use SQLite datetime function to compare properly
            date_filter += " AND datetime(timestamp) >= datetime(?)"
            date_params.append(start_date)
            print(f"Added start filter: datetime(timestamp) >= datetime('{start_date}')")
        if end_date:
            # Use SQLite datetime function to compare properly
            date_filter += " AND datetime(timestamp) <= datetime(?)"
            date_params.append(end_date)
            print(f"Added end filter: datetime(timestamp) <= datetime('{end_date}')")
        
        # Query completion requests
        cursor.execute(f"""
            SELECT 
                timestamp,
                time_to_first_token_ms,
                time_to_last_token_ms,
                is_streaming,
                success,
                message_count,
                prompt_tokens,
                total_tokens,
                completion_tokens
            FROM completion_requests 
            WHERE 1=1{date_filter}
            ORDER BY timestamp DESC
        """, date_params)
        
        results = []
        for row in cursor.fetchall():
            timestamp, time_to_first_token_ms, time_to_last_token_ms, is_streaming, success, message_count, prompt_tokens, total_tokens, completion_tokens = row
            
            # Convert timestamp to ISO format if it's a string
            if isinstance(timestamp, str):
                formatted_timestamp = timestamp
            else:
                formatted_timestamp = timestamp.isoformat() if timestamp else datetime.now().isoformat()
            
            completion_request = CompletionRequestData(
                timestamp=formatted_timestamp,
                time_to_first_token_ms=time_to_first_token_ms,
                time_to_last_token_ms=time_to_last_token_ms,
                is_streaming=bool(is_streaming),
                success=bool(success),
                message_count=message_count,
                prompt_tokens=prompt_tokens,
                tokens={
                    "total": total_tokens,
                    "prompt": prompt_tokens,
                    "completion": completion_tokens
                }
            )
            results.append(completion_request)
        
        print(f"Returning {len(results)} completion requests")
        return results


@router.get("/metrics")
async def metrics_endpoint(
    start: Optional[str] = Query(None, description="Start date in ISO format (e.g., 2024-01-01T00:00:00)"),
    end: Optional[str] = Query(None, description="End date in ISO format (e.g., 2024-01-02T00:00:00)")
) -> Metrics:
    """Return current metrics as JSON with optional date filtering."""
    return get_metrics(start, end)


@router.get("/completion_requests")
async def completion_requests_endpoint(
    start: Optional[str] = Query(None, description="Start date in ISO format (e.g., 2024-01-01T00:00:00)"),
    end: Optional[str] = Query(None, description="End date in ISO format (e.g., 2024-01-02T00:00:00)")
) -> List[CompletionRequestData]:
    """Return completion requests with optional date filtering."""
    return get_completion_requests(start, end)


@router.get("/health")
async def health_check() -> Dict[str, str]:
    """Health check endpoint."""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}
