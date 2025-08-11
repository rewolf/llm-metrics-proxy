#!/usr/bin/env python3
"""
Metrics API Server

Separate server that exposes metrics data for the frontend.
This runs on a different port than the main proxy for security.
"""

import os
import sqlite3
from datetime import datetime
from typing import Dict, Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Configuration
METRICS_PORT = int(os.getenv("METRICS_PORT", "8002"))
DB_PATH = os.getenv("DB_PATH", "./data/metrics.db")

app = FastAPI(title="Metrics API", version="1.0.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_metrics() -> Dict[str, Any]:
    """Get enhanced metrics from the database."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Basic request counts
    cursor.execute("SELECT COUNT(*) FROM completion_requests")
    total_requests = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM completion_requests WHERE success = 1")
    successful_requests = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM completion_requests WHERE success = 0")
    failed_requests = cursor.fetchone()[0]
    
    success_rate = (successful_requests / total_requests * 100) if total_requests > 0 else 0
    
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
    top_models = [{"model": row[0], "count": row[1]} for row in cursor.fetchall()]
    
    # Finish reasons
    cursor.execute("""
        SELECT finish_reason, COUNT(*) as count 
        FROM completion_requests 
        WHERE finish_reason IS NOT NULL 
        GROUP BY finish_reason
    """)
    finish_reasons = [{"reason": row[0], "count": row[1]} for row in cursor.fetchall()]
    
    # Error analysis
    cursor.execute("""
        SELECT error_type, COUNT(*) as count 
        FROM completion_requests 
        WHERE error_type IS NOT NULL 
        GROUP BY error_type
    """)
    error_types = [{"type": row[0], "count": row[1]} for row in cursor.fetchall()]
    
    conn.close()
    
    return {
        "total_requests": total_requests,
        "successful_requests": successful_requests,
        "failed_requests": failed_requests,
        "success_rate": round(success_rate, 2),
        "recent_requests_24h": recent_requests,
        
        # Streaming stats
        "streaming_requests": streaming_requests,
        "non_streaming_requests": non_streaming_requests,
        "streaming_percentage": round((streaming_requests / total_requests * 100) if total_requests > 0 else 0, 2),
        
        # Token usage
        "total_tokens_used": total_tokens_used,
        "avg_tokens_per_request": round(avg_tokens_per_request, 2),
        
        # Performance
        "avg_response_time_ms": round(avg_response_time_ms, 2),
        "avg_tokens_per_second": round(avg_tokens_per_second, 2),
        
        # Model usage
        "top_models": top_models,
        
        # Completion analysis
        "finish_reasons": finish_reasons,
        "error_types": error_types,
        
        "timestamp": datetime.now().isoformat()
    }

@app.get("/")
async def root():
    """Root endpoint with API info."""
    return {
        "service": "Metrics API",
        "version": "1.0.0",
        "endpoints": {
            "/metrics": "Get current metrics",
            "/health": "Health check"
        }
    }

@app.get("/metrics")
async def metrics_endpoint():
    """Return current metrics as JSON."""
    return get_metrics()

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    print(f"Metrics API Server starting on port {METRICS_PORT}")
    print(f"Database path: {DB_PATH}")
    uvicorn.run(app, host="0.0.0.0", port=METRICS_PORT)
