"""
Database Backup Service

This module handles database backups before destructive operations like migrations.
"""

import os
import shutil
import sqlite3
from datetime import datetime
from typing import Optional, Tuple
from backend.database.connection import get_db_path
from backend.utils.config import Config

def create_backup_table(table_name: str, backup_suffix: str = "_backup", db_path: Optional[str] = None) -> str:
    """Create a backup table by copying the original table structure and data."""
    backup_table_name = f"{table_name}{backup_suffix}"
    
    # Use provided db_path or fall back to get_db_path()
    if db_path is None:
        db_path = get_db_path()
    
    try:
        with sqlite3.connect(db_path) as conn:
            cursor = conn.cursor()
            
            # Create backup table with same structure
            cursor.execute(f"CREATE TABLE {backup_table_name} AS SELECT * FROM {table_name}")
            
            # Get row count for verification
            cursor.execute(f"SELECT COUNT(*) FROM {backup_table_name}")
            backup_count = cursor.fetchone()[0]
            
            conn.commit()
            
            print(f"Created backup table '{backup_table_name}' with {backup_count} rows")
            return backup_table_name
            
    except Exception as e:
        print(f"Error creating backup table: {e}")
        raise

def create_file_backup(backup_dir: Optional[str] = None, db_name: Optional[str] = None, db_path: Optional[str] = None) -> str:
    """Create a file-based backup of the entire database."""
    # Safety check: prevent writing to production during testing
    if os.getenv('TESTING') == 'true' and backup_dir is None:
        raise Exception("TESTING MODE: Must specify backup_dir to prevent writing to production")
    
    # Check if database file exists
    if db_path is None:
        db_path = get_db_path()
    if not os.path.exists(db_path):
        print(f"Database file does not exist yet: {db_path}")
        print("Skipping backup creation for fresh database")
        return ""
    
    if backup_dir is None:
        # Try to create backup in the same directory as the database
        db_dir = os.path.dirname(db_path)
        backup_dir = os.path.join(db_dir, "backups")
        
        # Check if we can write to the database directory
        if not os.access(db_dir, os.W_OK):
            # Try to create the backups subdirectory first
            try:
                os.makedirs(backup_dir, exist_ok=True)
                # Test if we can actually write to it
                test_file = os.path.join(backup_dir, ".test_write")
                with open(test_file, 'w') as f:
                    f.write("test")
                os.remove(test_file)
                print(f"Created and verified backup directory: {backup_dir}")
            except (PermissionError, OSError):
                # If we still can't write, try user's home directory
                home_dir = os.path.expanduser("~")
                backup_dir = os.path.join(home_dir, ".openai_llm_metrics_proxy", "backups")
                print(f"Using home directory for backups: {backup_dir}")
    
    # Create backup directory if it doesn't exist
    try:
        os.makedirs(backup_dir, exist_ok=True)
    except PermissionError as e:
        raise Exception(f"Cannot create backup directory {backup_dir}: {e}. Please ensure the directory is writable or specify a different backup location.")
    
    # Generate backup filename with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")[:-3]  # Include milliseconds for uniqueness
    # Use provided db_name or extract from db_path
    if db_name is None:
        db_name = os.path.basename(db_path)
    backup_filename = f"{db_name}.{timestamp}.backup"
    backup_path = os.path.join(backup_dir, backup_filename)
    
    try:
        # Copy the database file
        shutil.copy2(db_path, backup_path)
        
        # Verify the backup
        if os.path.exists(backup_path):
            original_size = os.path.getsize(db_path)
            backup_size = os.path.getsize(backup_path)
            
            if original_size == backup_size:
                print(f"Database backup created successfully: {backup_path}")
                print(f"Backup size: {backup_size} bytes")
                return backup_path
            else:
                raise Exception(f"Backup size mismatch: original={original_size}, backup={backup_size}")
        else:
            raise Exception("Backup file was not created")
            
    except Exception as e:
        print(f"Error creating file backup: {e}")
        # Clean up failed backup
        if os.path.exists(backup_path):
            os.remove(backup_path)
        raise

def restore_from_backup_table(table_name: str, backup_table_name: str, db_path: Optional[str] = None) -> bool:
    """Restore a table from its backup table."""
    # Use provided db_path or fall back to get_db_path()
    if db_path is None:
        db_path = get_db_path()
    
    try:
        with sqlite3.connect(db_path) as conn:
            cursor = conn.cursor()
            
            # Drop the current table
            cursor.execute(f"DROP TABLE IF EXISTS {table_name}")
            
            # Restore from backup
            cursor.execute(f"CREATE TABLE {table_name} AS SELECT * FROM {backup_table_name}")
            
            # Get row count for verification
            cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
            restored_count = cursor.fetchone()[0]
            
            conn.commit()
            
            print(f"Restored table '{table_name}' from backup with {restored_count} rows")
            return True
            
    except Exception as e:
        print(f"Error restoring from backup table: {e}")
        return False

def restore_from_file_backup(backup_path: str, backup_dir: Optional[str] = None, db_path: Optional[str] = None) -> bool:
    """Restore the entire database from a file backup."""
    # Use provided db_path or fall back to get_db_path()
    if db_path is None:
        db_path = get_db_path()
    
    try:
        # Verify backup file exists and is readable
        if not os.path.exists(backup_path):
            raise Exception(f"Backup file not found: {backup_path}")
        
        # Create a backup of current database before restore
        current_backup = create_file_backup(backup_dir=backup_dir, db_name=os.path.basename(db_path), db_path=db_path)
        print(f"Created backup of current database before restore: {current_backup}")
        
        # Stop any active connections (this is important for SQLite)
        # In a real application, you'd want to ensure no active connections
        
        # Restore from backup
        shutil.copy2(backup_path, db_path)
        
        # Verify restore
        if os.path.exists(db_path):
            restored_size = os.path.getsize(db_path)
            backup_size = os.path.getsize(backup_path)
            
            if restored_size == backup_size:
                print(f"Database restored successfully from: {backup_path}")
                return True
            else:
                raise Exception(f"Restore size mismatch: backup={backup_size}, restored={restored_size}")
        else:
            raise Exception("Database file was not restored")
            
    except Exception as e:
        print(f"Error restoring from file backup: {e}")
        return False

def cleanup_backup_table(backup_table_name: str, db_path: Optional[str] = None) -> bool:
    """Clean up a backup table after successful migration."""
    # Use provided db_path or fall back to get_db_path()
    if db_path is None:
        db_path = get_db_path()
    
    try:
        with sqlite3.connect(db_path) as conn:
            cursor = conn.cursor()
            cursor.execute(f"DROP TABLE IF EXISTS {backup_table_name}")
            conn.commit()
            
            print(f"Cleaned up backup table: {backup_table_name}")
            return True
            
    except Exception as e:
        print(f"Error cleaning up backup table: {e}")
        return False

def list_backups(backup_dir: Optional[str] = None) -> list:
    """List available database backups."""
    if backup_dir is None:
        backup_dir = os.path.join(os.path.dirname(get_db_path()), "backups")
    
    if not os.path.exists(backup_dir):
        return []
    
    backups = []
    for filename in os.listdir(backup_dir):
        if filename.endswith('.backup'):
            backup_path = os.path.join(backup_dir, filename)
            stat = os.stat(backup_path)
            
            # Extract timestamp from filename (format: dbname.YYYYMMDD_HHMMSS_mmm.backup)
            import re
            timestamp_match = re.search(r'\.(\d{8}_\d{6}_\d{3})\.backup$', filename)
            if timestamp_match:
                timestamp_str = timestamp_match.group(1)
                try:
                    created_time = datetime.strptime(timestamp_str, "%Y%m%d_%H%M%S_%f")
                except ValueError:
                    # Fallback to file modification time if parsing fails
                    created_time = datetime.fromtimestamp(stat.st_mtime)
            else:
                # Fallback to file modification time if no timestamp in filename
                created_time = datetime.fromtimestamp(stat.st_mtime)
            
            backups.append({
                'filename': filename,
                'path': backup_path,
                'size': stat.st_size,
                'created': created_time
            })
    
    # Sort by creation time (newest first)
    backups.sort(key=lambda x: x['created'], reverse=True)
    return backups
