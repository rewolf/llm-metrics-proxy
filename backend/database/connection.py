"""
Database connection management for the OpenAI LLM Metrics Proxy.
"""

import os
import sqlite3
import logging
from contextlib import contextmanager
from typing import Generator

logger = logging.getLogger(__name__)

# Configuration - read from environment variable
def get_db_path() -> str:
    """Get the database file path from environment variable."""
    return os.getenv("DB_PATH", "./data/metrics.db")


def ensure_data_directory():
    """Ensure the data directory exists."""
    data_dir = os.path.dirname(get_db_path())
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
    db_path = get_db_path()
    logger.debug(f"Connecting to database: {db_path}")
    conn = sqlite3.connect(db_path)
    try:
        yield conn
    finally:
        conn.close()
