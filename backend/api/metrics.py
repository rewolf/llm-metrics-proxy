"""
Metrics API endpoints for the OpenAI LLM Metrics Proxy.
"""

from datetime import datetime, timedelta
from typing import List, Optional, Dict
from fastapi import APIRouter, Query
from fastapi.middleware.cors import CORSMiddleware
from backend.database.dao import completion_requests_dao
from shared.types import CompletionRequestData

router = APIRouter(tags=["metrics"])


def get_metrics(start_date: Optional[str] = None, end_date: Optional[str] = None):
    """Get enhanced metrics from the database with optional date filtering."""
    # Use the DAO to get metrics - this ensures consistent data access patterns
    return completion_requests_dao.get_metrics(start_date, end_date)


def get_completion_requests(start_date: Optional[str] = None, end_date: Optional[str] = None) -> List[CompletionRequestData]:
    """Get completion requests from the database with optional date filtering."""
    # Use the DAO to get completion requests - this ensures consistent data access patterns
    return completion_requests_dao.get_completion_requests(start_date, end_date)


@router.get("/metrics")
async def metrics_endpoint(
    start: Optional[str] = Query(None, description="Start date in ISO format (e.g., 2024-01-01T00:00:00)"),
    end: Optional[str] = Query(None, description="End date in ISO format (e.g., 2024-01-02T00:00:00)")
):
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
