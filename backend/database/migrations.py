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


def remove_user_column():
    """Remove the user column from the completion_requests table if it exists."""
    if not table_exists("completion_requests"):
        logger.info("completion_requests table does not exist, skipping user column removal")
        return
    
    columns = get_table_columns("completion_requests")
    if 'user' not in columns:
        logger.info("user column does not exist in completion_requests table")
        return
    
    logger.info("Removing user column from completion_requests table")
    with get_db_connection() as conn:
        cursor = conn.cursor()
        # SQLite doesn't support DROP COLUMN directly, so we need to recreate the table
        # First, get the current data
        cursor.execute("SELECT * FROM completion_requests")
        data = cursor.fetchall()
        
        # Get column info to recreate the table without the user column
        cursor.execute("PRAGMA table_info(completion_requests)")
        columns_info = cursor.fetchall()
        
        # Create new table without user column
        new_schema = """
        CREATE TABLE completion_requests_new (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            success BOOLEAN NOT NULL,
            status_code INTEGER,
            response_time_ms INTEGER,
            model TEXT,
            origin TEXT,
            is_streaming BOOLEAN,
            max_tokens INTEGER,
            temperature REAL,
            top_p REAL,
            message_count INTEGER,
            prompt_tokens INTEGER,
            completion_tokens INTEGER,
            total_tokens INTEGER,
            finish_reason TEXT,
            time_to_first_token_ms INTEGER,
            time_to_last_token_ms INTEGER,
            tokens_per_second REAL,
            error_type TEXT,
            error_message TEXT
        )
        """
        
        cursor.execute(new_schema)
        
        # Copy data to new table (excluding user column)
        if data:
            placeholders = ','.join(['?' for _ in range(len(data[0]) - 1)])  # -1 to exclude user column
            insert_sql = f"INSERT INTO completion_requests_new VALUES ({placeholders})"
            
            for row in data:
                # Remove the user column (index 7 based on the old schema)
                new_row = row[:7] + row[8:]  # Skip the user column
                cursor.execute(insert_sql, new_row)
        
        # Drop old table and rename new one
        cursor.execute("DROP TABLE completion_requests")
        cursor.execute("ALTER TABLE completion_requests_new RENAME TO completion_requests")
        
        conn.commit()
        logger.info("User column removed successfully")


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
    
    # Remove user column if it exists
    remove_user_column()
    
    logger.info("Database migrations completed successfully")
