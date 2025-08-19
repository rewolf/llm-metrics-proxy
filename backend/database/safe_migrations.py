"""
Safe Database Migration System

This module provides a safe migration system that always creates backups
before any destructive operations and validates the results.
"""

import logging
from typing import List, Tuple, Optional, Callable
import os
from backend.database.schema import (
    get_schema_version, set_schema_version, 
    schema_needs_migration, validate_schema,
    CURRENT_SCHEMA_VERSION
)
from backend.database.backup import (
    create_file_backup, create_backup_table,
    restore_from_file_backup, restore_from_backup_table,
    cleanup_backup_table
)
from backend.database.connection import get_db_connection, get_db_path

logger = logging.getLogger(__name__)

class MigrationStep:
    """Represents a single migration step."""
    
    def __init__(self, version: int, description: str, 
                 migration_func: Callable, rollback_func: Optional[Callable] = None):
        self.version = version
        self.description = description
        self.migration_func = migration_func
        self.rollback_func = rollback_func

class SafeMigrationManager:
    """Manages database migrations with automatic backups and rollback capabilities."""
    
    def __init__(self):
        self.migrations: List[MigrationStep] = []
        self.backup_path: Optional[str] = None
        self.backup_tables: List[str] = []
    
    def add_migration(self, migration: MigrationStep):
        """Add a migration step to the manager."""
        self.migrations.append(migration)
        # Sort by version
        self.migrations.sort(key=lambda x: x.version)
    
    def create_backup(self) -> bool:
        """Create a backup before running migrations."""
        try:
            # Check if database exists
            if not os.path.exists(get_db_path()):
                logger.info("Database does not exist yet - fresh start")
                logger.info("For initial schema creation, backup is not required")
                return True
            
            logger.info("Creating database backup before migration...")
            try:
                self.backup_path = create_file_backup()
                if self.backup_path:
                    logger.info(f"Database backup created: {self.backup_path}")
                return True
            except Exception as backup_error:
                logger.error(f"Backup creation failed: {backup_error}")
                logger.error("Migration cannot proceed without backup capability")
                logger.error("Please ensure backup directory is writable and try again")
                return False
                
        except Exception as e:
            logger.error(f"Failed to create database backup: {e}")
            return False
    
    def run_migration_step(self, migration: MigrationStep) -> bool:
        """Run a single migration step with backup table creation."""
        try:
            logger.info(f"Running migration {migration.version}: {migration.description}")
            
            # For the initial schema creation, we don't need backup tables
            # since there's no existing data to protect
            if migration.version == 1 and "Create initial schema" in migration.description:
                logger.info("Initial schema creation - no backup table needed")
                # Run the migration directly
                migration.migration_func()
            else:
                # Create backup table for the main table
                backup_table = create_backup_table("completion_requests")
                self.backup_tables.append(backup_table)
                
                # Run the migration
                migration.migration_func()
            
            # Validate the result
            is_valid, errors = validate_schema()
            if not is_valid:
                logger.error(f"Schema validation failed after migration {migration.version}: {errors}")
                return False
            
            # Update schema version
            if set_schema_version(migration.version, migration.description):
                logger.info(f"Migration {migration.version} completed successfully")
                return True
            else:
                logger.error(f"Failed to update schema version for migration {migration.version}")
                return False
                
        except Exception as e:
            logger.error(f"Migration {migration.version} failed: {e}")
            return False
    
    def rollback_migration(self, migration: MigrationStep) -> bool:
        """Rollback a migration step."""
        try:
            logger.info(f"Rolling back migration {migration.version}")
            
            if migration.rollback_func:
                migration.rollback_func()
            else:
                # Default rollback: restore from backup table
                if self.backup_tables:
                    backup_table = self.backup_tables.pop()
                    restore_from_backup_table("completion_requests", backup_table)
                    cleanup_backup_table(backup_table)
            
            # Revert schema version
            set_schema_version(migration.version - 1, f"Rolled back from version {migration.version}")
            logger.info(f"Migration {migration.version} rolled back successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to rollback migration {migration.version}: {e}")
            return False
    
    def run_migrations(self) -> bool:
        """Run all pending migrations with safety checks."""
        if not schema_needs_migration():
            logger.info("Database schema is up to date")
            return True
        
        current_version = get_schema_version()
        logger.info(f"Current schema version: {current_version}")
        logger.info(f"Target schema version: {CURRENT_SCHEMA_VERSION}")
        
        # Create backup before any migrations - this is mandatory for data safety
        if not self.create_backup():
            logger.error("CRITICAL: Cannot create database backup")
            logger.error("Migration system requires backup capability to ensure data safety")
            logger.error("System startup FAILED - please fix backup permissions and restart")
            return False
        
        try:
            # Run each pending migration
            for migration in self.migrations:
                if migration.version > current_version:
                    if not self.run_migration_step(migration):
                        logger.error(f"Migration {migration.version} failed, rolling back...")
                        self.rollback_all()
                        return False
            
            logger.info("All migrations completed successfully")
            return True
            
        except Exception as e:
            logger.error(f"Migration process failed: {e}")
            self.rollback_all()
            return False
    
    def rollback_all(self) -> bool:
        """Rollback all migrations and restore from backup."""
        try:
            logger.info("Rolling back all migrations...")
            
            # Rollback migrations in reverse order
            for migration in reversed(self.migrations):
                if migration.version > get_schema_version():
                    self.rollback_migration(migration)
            
            # Clean up backup tables
            for backup_table in self.backup_tables:
                cleanup_backup_table(backup_table)
            self.backup_tables.clear()
            
            # Restore from file backup
            if self.backup_path:
                logger.info("Restoring database from backup...")
                if restore_from_file_backup(self.backup_path):
                    logger.info("Database restored from backup successfully")
                    return True
                else:
                    logger.error("Failed to restore database from backup")
                    return False
            
            return False
            
        except Exception as e:
            logger.error(f"Rollback failed: {e}")
            return False
    
    def cleanup(self):
        """Clean up backup resources."""
        try:
            # Clean up backup tables
            for backup_table in self.backup_tables:
                cleanup_backup_table(backup_table)
            self.backup_tables.clear()
            
            logger.info("Migration cleanup completed")
            
        except Exception as e:
            logger.error(f"Cleanup failed: {e}")

# Create migration manager instance
migration_manager = SafeMigrationManager()

# Define migration steps
def create_initial_schema():
    """Create the initial database schema."""
    try:
        # Ensure the database directory exists
        db_path = get_db_path()
        db_dir = os.path.dirname(db_path)
        logger.info(f"Creating database directory: {db_dir}")
        os.makedirs(db_dir, exist_ok=True)
        
        logger.info(f"Attempting to connect to database: {db_path}")
        logger.info(f"Current working directory: {os.getcwd()}")
        logger.info(f"Database file exists: {os.path.exists(db_path)}")
        
        # Create the database file if it doesn't exist
        # SQLite will create the file when we first connect to it
        with get_db_connection() as conn:
            logger.info("Successfully connected to database")
            cursor = conn.cursor()
            
            # Create completion_requests table
            cursor.execute("""
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
            """)
            
            # Create schema_version table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS schema_version (
                    id INTEGER PRIMARY KEY,
                    version INTEGER NOT NULL,
                    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    description TEXT
                )
            """)
            
            conn.commit()
            logger.info("Initial database schema created successfully")
            
    except Exception as e:
        logger.error(f"Failed to create initial schema: {e}")
        logger.error(f"Exception type: {type(e)}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise

def add_origin_column():
    """Add origin column to completion_requests table."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Check if origin column already exists
        cursor.execute("PRAGMA table_info(completion_requests)")
        columns = [col[1] for col in cursor.fetchall()]
        
        if 'origin' not in columns:
            cursor.execute("ALTER TABLE completion_requests ADD COLUMN origin TEXT")
            conn.commit()
            logger.info("Added origin column to completion_requests table")
        else:
            logger.info("Origin column already exists")


def add_app_versioning():
    """Add app versioning and recalculate old tokens_per_second values."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Check if app_version column already exists
        cursor.execute("PRAGMA table_info(completion_requests)")
        columns = [col[1] for col in cursor.fetchall()]
        
        if 'app_version' not in columns:
            # Add app_version column
            cursor.execute("""
                ALTER TABLE completion_requests 
                ADD COLUMN app_version TEXT DEFAULT '1.0.0'
            """)
            logger.info("Added app_version column to completion_requests table")
        else:
            logger.info("app_version column already exists")
        
        # Set all existing records to version 1.0.0 (old calculation logic)
        cursor.execute("""
            UPDATE completion_requests 
            SET app_version = '1.0.0' 
            WHERE app_version IS NULL OR app_version = ''
        """)
        logger.info(f"Set existing records to app version 1.0.0")
        
        # Recalculate tokens_per_second for old records using new logic
        # New logic: total_tokens / (response_time_ms / 1000)
        cursor.execute("""
            UPDATE completion_requests 
            SET 
                tokens_per_second = CASE 
                    WHEN response_time_ms > 0 AND total_tokens > 0 
                    THEN (total_tokens * 1000.0) / response_time_ms
                    ELSE NULL
                END,
                app_version = '2.0.0'
            WHERE app_version = '1.0.0' 
                AND response_time_ms > 0 
                AND total_tokens > 0
        """)
        
        updated_count = cursor.rowcount
        logger.info(f"Recalculated tokens_per_second for {updated_count} records to app version 2.0.0")
        
        conn.commit()
        logger.info("App versioning migration completed successfully")


# Add migrations to the manager
migration_manager.add_migration(MigrationStep(1, "Create initial schema", create_initial_schema))
migration_manager.add_migration(MigrationStep(2, "Add origin column", add_origin_column))
migration_manager.add_migration(MigrationStep(3, "Add schema versioning and recalculate metrics", add_app_versioning))

def run_safe_migrations() -> bool:
    """Run migrations with full safety measures."""
    try:
        logger.info("Starting safe migration process...")
        
        # Check if migrations are needed
        if not schema_needs_migration():
            logger.info("No migrations needed")
            return True
        
        # Run migrations
        success = migration_manager.run_migrations()
        
        if success:
            logger.info("Safe migration process completed successfully")
        else:
            logger.error("CRITICAL: Safe migration process failed")
            logger.error("System cannot start without backup capability")
            logger.error("Please ensure backup directory is writable and restart")
        
        return success
        
    finally:
        # Always cleanup
        migration_manager.cleanup()
