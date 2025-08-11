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
    """Get current metrics from the database."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Total requests
    cursor.execute("SELECT COUNT(*) FROM completion_requests")
    total_requests = cursor.fetchone()[0]
    
    # Successful requests
    cursor.execute("SELECT COUNT(*) FROM completion_requests WHERE success = 1")
    successful_requests = cursor.fetchone()[0]
    
    # Failed requests
    cursor.execute("SELECT COUNT(*) FROM completion_requests WHERE success = 0")
    failed_requests = cursor.fetchone()[0]
    
    # Success rate
    success_rate = (successful_requests / total_requests * 100) if total_requests > 0 else 0
    
    # Recent requests (last 24 hours)
    cursor.execute("""
        SELECT COUNT(*) FROM completion_requests 
        WHERE timestamp >= datetime('now', '-1 day')
    """)
    recent_requests = cursor.fetchone()[0]
    
    conn.close()
    
    return {
        "total_requests": total_requests,
        "successful_requests": successful_requests,
        "failed_requests": failed_requests,
        "success_rate": round(success_rate, 2),
        "recent_requests_24h": recent_requests,
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
