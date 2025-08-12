#!/usr/bin/env python3
"""
Metrics API Server

Separate server that exposes metrics data for the frontend.
This runs on a different port than the main proxy for security.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from .api.metrics import router as metrics_router
from .utils.config import Config

app = FastAPI(title="Metrics API", version="1.0.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include metrics router
app.include_router(metrics_router)


@app.get("/")
async def root():
    """Root endpoint with API info."""
    return {
        "service": "Metrics API",
        "version": "1.0.0",
        "endpoints": {
            "/api/metrics": "Get current metrics",
            "/api/health": "Health check"
        }
    }


if __name__ == "__main__":
    print(f"Metrics API Server starting on port {Config.get_metrics_port()}")
    print(f"Database path: {Config.get_db_path()}")
    uvicorn.run(app, host="0.0.0.0", port=Config.get_metrics_port())
