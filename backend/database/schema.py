"""
Database Schema Management

This module defines the current database schema version and provides
methods for schema validation and comparison.
"""

from typing import List, Tuple, Dict, Any
import sqlite3
from backend.database.connection import get_db_connection
from backend.utils.config import Config

# Current schema version - increment this when making schema changes
CURRENT_SCHEMA_VERSION = 3

# Schema definition for the completion_requests table
COMPLETION_REQUESTS_SCHEMA = """
CREATE TABLE IF NOT EXISTS completion_requests (
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
    app_version TEXT DEFAULT '1.0.0',
    error_type TEXT,
    error_message TEXT
)
"""

# Schema version table
SCHEMA_VERSION_TABLE = """
CREATE TABLE IF NOT EXISTS schema_version (
    id INTEGER PRIMARY KEY,
    version INTEGER NOT NULL,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    description TEXT
)
"""

def get_schema_version() -> int:
    """Get the current schema version from the database."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Check if schema_version table exists
            cursor.execute("""
                SELECT name FROM sqlite_master 
                WHERE type='table' AND name='schema_version'
            """)
            
            if not cursor.fetchone():
                return 0
            
            # Get the latest version
            cursor.execute("""
                SELECT version FROM schema_version 
                ORDER BY version DESC LIMIT 1
            """)
            
            result = cursor.fetchone()
            return result[0] if result else 0
            
    except Exception as e:
        # Database doesn't exist yet - this is normal for fresh starts
        # Don't print error messages for this expected case
        return 0

def set_schema_version(version: int, description: str = "") -> bool:
    """Set the schema version in the database."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Ensure schema_version table exists
            cursor.execute(SCHEMA_VERSION_TABLE)
            
            # Insert new version record
            cursor.execute("""
                INSERT INTO schema_version (version, description) 
                VALUES (?, ?)
            """, (version, description))
            
            conn.commit()
            return True
            
    except Exception as e:
        # Database doesn't exist yet - this is normal for fresh starts
        # Don't print error messages for this expected case
        return False

def schema_needs_migration() -> bool:
    """Check if the database schema needs migration."""
    current_version = get_schema_version()
    return current_version < CURRENT_SCHEMA_VERSION

def validate_schema() -> Tuple[bool, List[str]]:
    """Validate that the current database schema matches the expected schema."""
    errors = []
    
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Check if completion_requests table exists
            cursor.execute("""
                SELECT name FROM sqlite_master 
                WHERE type='table' AND name='completion_requests'
            """)
            
            if not cursor.fetchone():
                errors.append("completion_requests table does not exist")
                return False, errors
            
            # Get table info
            cursor.execute("PRAGMA table_info(completion_requests)")
            columns = cursor.fetchall()
            
            # Expected columns (name, type, notnull, default_value, pk)
            expected_columns = [
                ('id', 'INTEGER', 0, None, 1),  # PRIMARY KEY shows notnull=0 in SQLite
                ('timestamp', 'DATETIME', 0, 'CURRENT_TIMESTAMP', 0),
                ('success', 'BOOLEAN', 1, None, 0),
                ('status_code', 'INTEGER', 0, None, 0),
                ('response_time_ms', 'INTEGER', 0, None, 0),
                ('model', 'TEXT', 0, None, 0),
                ('origin', 'TEXT', 0, None, 0),
                ('is_streaming', 'BOOLEAN', 0, None, 0),
                ('max_tokens', 'INTEGER', 0, None, 0),
                ('temperature', 'REAL', 0, None, 0),
                ('top_p', 'REAL', 0, None, 0),
                ('message_count', 'INTEGER', 0, None, 0),
                ('prompt_tokens', 'INTEGER', 0, None, 0),
                ('completion_tokens', 'INTEGER', 0, None, 0),
                ('total_tokens', 'INTEGER', 0, None, 0),
                ('finish_reason', 'TEXT', 0, None, 0),
                ('time_to_first_token_ms', 'INTEGER', 0, None, 0),
                ('time_to_last_token_ms', 'INTEGER', 0, None, 0),
                ('tokens_per_second', 'REAL', 0, None, 0),
                ('error_type', 'TEXT', 0, None, 0),
                ('error_message', 'TEXT', 0, None, 0)
            ]
            
            # Check column count
            if len(columns) != len(expected_columns):
                errors.append(f"Expected {len(expected_columns)} columns, got {len(columns)}")
                return False, errors
            
            # Check each column
            for i, (expected_name, expected_type, expected_notnull, expected_default, expected_pk) in enumerate(expected_columns):
                if i >= len(columns):
                    errors.append(f"Missing column {expected_name}")
                    continue
                
                # PRAGMA table_info returns: (cid, name, type, notnull, default_value, pk)
                col_cid, col_name, col_type, col_notnull, col_default, col_pk = columns[i]
                
                if col_name != expected_name:
                    errors.append(f"Column {i}: expected name '{expected_name}', got '{col_name}'")
                
                if col_type.upper() != expected_type.upper():
                    errors.append(f"Column {expected_name}: expected type '{expected_type}', got '{col_type}'")
                
                if col_notnull != expected_notnull:
                    errors.append(f"Column {expected_name}: expected notnull {expected_notnull}, got {col_notnull}")
                
                if col_pk != expected_pk:
                    errors.append(f"Column {expected_name}: expected pk {expected_pk}, got {col_pk}")
            
            return len(errors) == 0, errors
            
    except Exception as e:
        errors.append(f"Schema validation error: {e}")
        return False, errors
