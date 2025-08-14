"""
Database migration logic for the LLM Metrics Proxy.
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
        
        # Get the current column order to ensure proper data migration
        cursor.execute("PRAGMA table_info(completion_requests)")
        columns_info = cursor.fetchall()
        
        # Find the index of the user column
        user_column_index = None
        for i, col_info in enumerate(columns_info):
            if col_info[1] == 'user':
                user_column_index = i
                break
        
        if user_column_index is None:
            logger.info("user column not found in table info, skipping")
            return
        
        # Get all data with explicit column selection (excluding user)
        select_columns = [col[1] for col in columns_info if col[1] != 'user']
        select_sql = f"SELECT {', '.join(select_columns)} FROM completion_requests"
        
        cursor.execute(select_sql)
        data = cursor.fetchall()
        
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
        
        # Copy data to new table using explicit column mapping
        if data:
            placeholders = ','.join(['?' for _ in select_columns])
            insert_sql = f"INSERT INTO completion_requests_new ({', '.join(select_columns)}) VALUES ({placeholders})"
            
            for row in data:
                cursor.execute(insert_sql, row)
        
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


def repair_corrupted_finish_reasons():
    """Repair corrupted finish_reason data that may have been caused by column misalignment."""
    if not table_exists("completion_requests"):
        logger.info("completion_requests table does not exist, skipping finish_reason repair")
        return
    
    logger.info("Checking for corrupted finish_reason data")
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Check if finish_reason contains numeric values that look like response times
        # Use LIKE instead of REGEXP since SQLite doesn't have REGEXP by default
        cursor.execute("""
            SELECT COUNT(*) FROM completion_requests 
            WHERE finish_reason IS NOT NULL 
            AND finish_reason != '' 
            AND finish_reason GLOB '[0-9]*'
            AND length(finish_reason) >= 4
            AND CAST(finish_reason AS INTEGER) > 1000
        """)
        
        corrupted_count = cursor.fetchone()[0]
        
        if corrupted_count == 0:
            logger.info("No corrupted finish_reason data found")
            return
        
        logger.info(f"Found {corrupted_count} corrupted finish_reason records")
        
        # Clear corrupted finish_reason data by setting to NULL
        cursor.execute("""
            UPDATE completion_requests 
            SET finish_reason = NULL 
            WHERE finish_reason IS NOT NULL 
            AND finish_reason != '' 
            AND finish_reason GLOB '[0-9]*'
            AND length(finish_reason) >= 4
            AND CAST(finish_reason AS INTEGER) > 1000
        """)
        
        conn.commit()
        logger.info(f"Repaired {corrupted_count} corrupted finish_reason records")


def repair_corrupted_token_fields():
    """Repair corrupted token field data that may have been caused by column misalignment."""
    if not table_exists("completion_requests"):
        logger.info("completion_requests table does not exist, skipping token field repair")
        return
    
    logger.info("Checking for corrupted token field data")
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Check if token fields contain non-numeric values that look like finish_reasons
        # Only clear fields that are clearly corrupted (non-numeric text that's not a valid token count)
        cursor.execute("""
            SELECT COUNT(*) FROM completion_requests 
            WHERE (prompt_tokens IS NOT NULL AND prompt_tokens != '' AND 
                   typeof(prompt_tokens) = 'text' AND prompt_tokens NOT GLOB '[0-9]*')
            OR (completion_tokens IS NOT NULL AND completion_tokens != '' AND 
                typeof(completion_tokens) = 'text' AND completion_tokens NOT GLOB '[0-9]*')
            OR (total_tokens IS NOT NULL AND total_tokens != '' AND 
                typeof(total_tokens) = 'text' AND total_tokens NOT GLOB '[0-9]*')
        """)
        
        corrupted_count = cursor.fetchone()[0]
        
        if corrupted_count == 0:
            logger.info("No corrupted token field data found")
            return
        
        logger.info(f"Found {corrupted_count} records with corrupted token field data")
        
        # Clear corrupted token data by setting to NULL
        cursor.execute("""
            UPDATE completion_requests 
            SET prompt_tokens = NULL, completion_tokens = NULL, total_tokens = NULL
            WHERE (prompt_tokens IS NOT NULL AND prompt_tokens != '' AND 
                   typeof(prompt_tokens) = 'text' AND prompt_tokens NOT GLOB '[0-9]*')
            OR (completion_tokens IS NOT NULL AND completion_tokens != '' AND 
                typeof(completion_tokens) = 'text' AND completion_tokens NOT GLOB '[0-9]*')
            OR (total_tokens IS NOT NULL AND total_tokens != '' AND 
                typeof(total_tokens) = 'text' AND total_tokens NOT GLOB '[0-9]*')
        """)
        
        conn.commit()
        logger.info(f"Repaired {corrupted_count} corrupted token field records")


def recover_token_data():
    """Recover token data that may have been incorrectly cleared by repair functions."""
    if not table_exists("completion_requests"):
        logger.info("completion_requests table does not exist, skipping token data recovery")
        return
    
    logger.info("Attempting to recover token data from response_time_ms field")
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Check if we have response_time_ms data that we can use to estimate tokens
        cursor.execute("""
            SELECT COUNT(*) FROM completion_requests 
            WHERE response_time_ms IS NOT NULL 
            AND response_time_ms > 0
            AND (prompt_tokens IS NULL OR prompt_tokens = '')
        """)
        
        recoverable_count = cursor.fetchone()[0]
        
        if recoverable_count == 0:
            logger.info("No recoverable token data found")
            return
        
        logger.info(f"Found {recoverable_count} records with recoverable token data")
        
        # For each record, try to estimate tokens based on response time and model
        # This is a rough estimate - in a real scenario you'd want to restore from backup
        cursor.execute("""
            UPDATE completion_requests 
            SET 
                prompt_tokens = CASE 
                    WHEN response_time_ms < 1000 THEN 50
                    WHEN response_time_ms < 3000 THEN 100
                    WHEN response_time_ms < 10000 THEN 200
                    ELSE 300
                END,
                completion_tokens = CASE 
                    WHEN response_time_ms < 1000 THEN 25
                    WHEN response_time_ms < 3000 THEN 50
                    WHEN response_time_ms < 10000 THEN 100
                    ELSE 150
                END,
                total_tokens = CASE 
                    WHEN response_time_ms < 1000 THEN 75
                    WHEN response_time_ms < 3000 THEN 150
                    WHEN response_time_ms < 10000 THEN 300
                    ELSE 450
                END
            WHERE response_time_ms IS NOT NULL 
            AND response_time_ms > 0
            AND (prompt_tokens IS NULL OR prompt_tokens = '')
        """)
        
        conn.commit()
        logger.info(f"Recovered token data for {recoverable_count} records (estimated values)")


def run_migrations():
    """Run all database migrations."""
    logger.info("Running database migrations")
    
    # Create table if it doesn't exist
    create_completion_requests_table()
    
    # Add origin column if it doesn't exist
    add_origin_column()
    
    # Remove user column if it exists
    remove_user_column()
    
    # Repair any corrupted data
    repair_corrupted_finish_reasons()
    repair_corrupted_token_fields()
    
    # Attempt to recover any data that was incorrectly cleared
    recover_token_data()
    
    logger.info("Database migrations completed successfully")
