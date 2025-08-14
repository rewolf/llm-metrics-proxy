"""
Configuration management for the LLM Metrics Proxy.
"""

import os
from typing import Optional


class Config:
    """Configuration class for the application."""
    
    # Backend configuration
    BACKEND_HOST: str = os.getenv("BACKEND_HOST", "ollama")
    BACKEND_PORT: int = int(os.getenv("BACKEND_PORT", "11434"))
    
    # Proxy configuration
    PROXY_PORT: int = int(os.getenv("PROXY_PORT", "8000"))
    
    # Database configuration
    DB_PATH: str = os.getenv("DB_PATH", "./data/metrics.db")
    
    # Metrics API configuration
    METRICS_PORT: int = int(os.getenv("METRICS_PORT", "8002"))
    
    @classmethod
    def get_backend_url(cls) -> str:
        """Get the backend base URL."""
        return f"http://{cls.BACKEND_HOST}:{cls.BACKEND_PORT}"
    
    @classmethod
    def get_db_path(cls) -> str:
        """Get the database file path."""
        return cls.DB_PATH
    
    @classmethod
    def get_proxy_port(cls) -> int:
        """Get the proxy server port."""
        return cls.PROXY_PORT
    
    @classmethod
    def get_metrics_port(cls) -> int:
        """Get the metrics API server port."""
        return cls.METRICS_PORT
