"""
Database migration logic for the OpenAI LLM Metrics Proxy.
"""

import logging
import sqlite3
from backend.database.connection import get_db_connection
from backend.database.models import COMPLETION_REQUESTS_SCHEMA

logger = logging.getLogger(__name__)


def get_table_columns(table_name: str) -> list[str]:
    """Get the list of columns in a table."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(f"PRAGMA table_info({table_name})")
        return [column[1] for column in cursor.fetchall()]


def table_exists(table_name: str) -> bool:
    """Check if a table exists."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name=?
        """, (table_name,))
        return cursor.fetchone() is not None


def add_origin_column():
    """Add the origin column to the completion_requests table if it doesn't exist."""
    if not table_exists("completion_requests"):
        logger.info("completion_requests table does not exist, skipping origin column addition")
        return
    
    columns = get_table_columns("completion_requests")
    if 'origin' in columns:
        logger.info("origin column already exists in completion_requests table")
        return
    
    logger.info("Adding origin column to completion_requests table")
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("ALTER TABLE completion_requests ADD COLUMN origin TEXT")
        conn.commit()
        logger.info("Origin column added successfully")


def create_completion_requests_table():
    """Create the completion_requests table if it doesn't exist."""
    if table_exists("completion_requests"):
        logger.info("completion_requests table already exists")
        return
    
    logger.info("Creating completion_requests table")
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(COMPLETION_REQUESTS_SCHEMA)
        conn.commit()
        logger.info("completion_requests table created successfully")


def run_migrations():
    """Run all database migrations."""
    logger.info("Running database migrations")
    
    # Create table if it doesn't exist
    create_completion_requests_table()
    
    # Add origin column if it doesn't exist
    add_origin_column()
    
    logger.info("Database migrations completed successfully")
