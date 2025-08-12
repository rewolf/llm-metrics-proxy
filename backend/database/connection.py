"""
Database connection management for the OpenAI LLM Metrics Proxy.
"""

import os
import sqlite3
import logging
from contextlib import contextmanager
from typing import Generator

logger = logging.getLogger(__name__)

# Configuration
DB_PATH = os.getenv("DB_PATH", "./data/metrics.db")


def ensure_data_directory():
    """Ensure the data directory exists."""
    data_dir = os.path.dirname(DB_PATH)
    if data_dir and not os.path.exists(data_dir):
        os.makedirs(data_dir)
        logger.info(f"Created data directory: {data_dir}")


@contextmanager
def get_db_connection() -> Generator[sqlite3.Connection, None, None]:
    """Get a database connection with proper cleanup.
    
    Usage:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM table")
    """
    ensure_data_directory()
    conn = sqlite3.connect(DB_PATH)
    try:
        yield conn
    finally:
        conn.close()


def get_db_path() -> str:
    """Get the database file path."""
    return DB_PATH
