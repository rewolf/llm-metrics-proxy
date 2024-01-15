"""
Tests for the backup and restore functionality.

This demonstrates testing backup operations with real file operations
and isolated test environments.
"""

import unittest
import tempfile
import os
import shutil
import sqlite3
from unittest.mock import patch, MagicMock
from datetime import datetime
import re

from backend.database.backup import (
    create_file_backup, create_backup_table, restore_from_backup_table,
    restore_from_file_backup, cleanup_backup_table, list_backups
)
from backend.database.connection import get_db_path

class TestBackupService(unittest.TestCase):
    """Test cases for backup and restore operations."""
    
    def setUp(self):
        """Set up test environment."""
        # Create temporary directory
        self.temp_dir = tempfile.mkdtemp()
        self.test_db_path = os.path.join(self.temp_dir, "test.db")
        
        # Mock the database path FIRST, before creating the database
        self.patcher = patch('backend.database.connection.get_db_path')
        mock_get_db_path = self.patcher.start()
        mock_get_db_path.return_value = self.test_db_path
        
        # Create test database AFTER setting up the mock
        with sqlite3.connect(self.test_db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE test_table (
                    id INTEGER PRIMARY KEY,
                    name TEXT,
                    value INTEGER
                )
            """)
            cursor.execute("INSERT INTO test_table (name, value) VALUES (?, ?)", ("test1", 100))
            cursor.execute("INSERT INTO test_table (name, value) VALUES (?, ?)", ("test2", 200))
            conn.commit()
    
    def tearDown(self):
        """Clean up test environment."""
        self.patcher.stop()
        shutil.rmtree(self.temp_dir, ignore_errors=True)
    
    def test_create_file_backup(self):
        """Test creating a file backup."""
        # Create backup
        db_name = os.path.basename(self.test_db_path)
        backup_path = create_file_backup(backup_dir=self.temp_dir, db_name=db_name, db_path=self.test_db_path)
        
        # Verify backup was created
        self.assertTrue(os.path.exists(backup_path))
        # The backup filename should contain the database name from the mocked path
        self.assertIn(f"{db_name}.", backup_path)
        self.assertTrue(backup_path.endswith(".backup"))
        
        # Verify backup size is reasonable (allowing for SQLite optimizations)
        original_size = os.path.getsize(self.test_db_path)
        backup_size = os.path.getsize(backup_path)
        # Allow for small size differences due to SQLite internal optimizations
        size_diff = abs(original_size - backup_size)
        self.assertLessEqual(size_diff, 5000, f"Size difference too large: {size_diff} bytes")
        
        # Verify backup contains the same data
        with sqlite3.connect(backup_path) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM test_table")
            count = cursor.fetchone()[0]
            self.assertEqual(count, 2)
    
    def test_create_file_backup_custom_directory(self):
        """Test creating backup in custom directory."""
        custom_backup_dir = os.path.join(self.temp_dir, "custom_backups")
        db_name = os.path.basename(self.test_db_path)
        
        backup_path = create_file_backup(backup_dir=custom_backup_dir, db_name=db_name, db_path=self.test_db_path)
        
        # Verify custom directory was created
        self.assertTrue(os.path.exists(custom_backup_dir))
        self.assertTrue(backup_path.startswith(custom_backup_dir))
    
    def test_create_file_backup_failure_cleanup(self):
        """Test backup failure cleanup."""
        # Create a read-only directory to cause backup failure
        read_only_dir = os.path.join(self.temp_dir, "readonly")
        os.makedirs(read_only_dir)
        os.chmod(read_only_dir, 0o444)  # Read-only
        
        with self.assertRaises(Exception):
            create_file_backup(backup_dir=read_only_dir, db_path=self.test_db_path)
        
        # Verify no partial backup files were left
        backup_files = [f for f in os.listdir(read_only_dir) if f.endswith('.backup')]
        self.assertEqual(len(backup_files), 0)
    
    def test_create_backup_table(self):
        """Test creating a backup table."""
        backup_table_name = create_backup_table("test_table", db_path=self.test_db_path)
        
        # Verify backup table was created
        with sqlite3.connect(self.test_db_path) as conn:
            cursor = conn.cursor()
            cursor.execute(f"SELECT COUNT(*) FROM {backup_table_name}")
            count = cursor.fetchone()[0]
            self.assertEqual(count, 2)
            
            # Verify table structure
            cursor.execute(f"PRAGMA table_info({backup_table_name})")
            columns = [col[1] for col in cursor.fetchall()]
            expected_columns = ['id', 'name', 'value']
            self.assertEqual(columns, expected_columns)
    
    def test_create_backup_table_nonexistent_table(self):
        """Test creating backup of nonexistent table."""
        with self.assertRaises(Exception):
            create_backup_table("nonexistent_table", db_path=self.test_db_path)
    
    def test_restore_from_backup_table(self):
        """Test restoring from backup table."""
        # Create backup table
        backup_table_name = create_backup_table("test_table", db_path=self.test_db_path)
        
        # Modify original table
        with sqlite3.connect(self.test_db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM test_table WHERE id = 1")
            conn.commit()
        
        # Verify modification
        with sqlite3.connect(self.test_db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM test_table")
            count = cursor.fetchone()[0]
            self.assertEqual(count, 1)
        
        # Restore from backup
        success = restore_from_backup_table("test_table", backup_table_name, db_path=self.test_db_path)
        self.assertTrue(success)
        
        # Verify restoration
        with sqlite3.connect(self.test_db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM test_table")
            count = cursor.fetchone()[0]
            self.assertEqual(count, 2)
    
    def test_restore_from_file_backup(self):
        """Test restoring from file backup."""
        # Create backup
        db_name = os.path.basename(self.test_db_path)
        backup_path = create_file_backup(backup_dir=self.temp_dir, db_name=db_name, db_path=self.test_db_path)
        
        # Modify original database
        with sqlite3.connect(self.test_db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM test_table WHERE id = 1")
            conn.commit()
        
        # Verify modification
        with sqlite3.connect(self.test_db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM test_table")
            count = cursor.fetchone()[0]
            self.assertEqual(count, 1)
        
        # Restore from backup
        success = restore_from_file_backup(backup_path, backup_dir=self.temp_dir, db_path=self.test_db_path)
        self.assertTrue(success)
        
        # Verify restoration
        with sqlite3.connect(self.test_db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM test_table")
            count = cursor.fetchone()[0]
            self.assertEqual(count, 2)
    
    def test_restore_from_file_backup_nonexistent(self):
        """Test restoring from nonexistent backup file."""
        nonexistent_backup = "/nonexistent/backup.db"
        success = restore_from_file_backup(nonexistent_backup)
        self.assertFalse(success)
    
    def test_cleanup_backup_table(self):
        """Test cleaning up backup tables."""
        # Create backup table
        backup_table_name = create_backup_table("test_table", db_path=self.test_db_path)
        
        # Verify it exists
        with sqlite3.connect(self.test_db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=?", (backup_table_name,))
            result = cursor.fetchone()
            self.assertIsNotNone(result)
        
        # Clean up
        success = cleanup_backup_table(backup_table_name, db_path=self.test_db_path)
        self.assertTrue(success)
        
        # Verify it's gone
        with sqlite3.connect(self.test_db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=?", (backup_table_name,))
            result = cursor.fetchone()
            self.assertIsNone(result)
    
    def test_list_backups(self):
        """Test listing available backups."""
        # Create multiple backups with a small delay to ensure different timestamps
        import time
        db_name = os.path.basename(self.test_db_path)
        backup1 = create_file_backup(backup_dir=self.temp_dir, db_name=db_name, db_path=self.test_db_path)
        time.sleep(0.1)  # Small delay to ensure different timestamps
        backup2 = create_file_backup(backup_dir=self.temp_dir, db_name=db_name, db_path=self.test_db_path)
        
        # List backups
        backups = list_backups(backup_dir=self.temp_dir)
        
        # Verify backups are listed
        self.assertEqual(len(backups), 2)
        
        # Verify backup information
        for backup in backups:
            self.assertIn('filename', backup)
            self.assertIn('path', backup)
            self.assertIn('size', backup)
            self.assertIn('created', backup)
            self.assertTrue(backup['filename'].endswith('.backup'))
            self.assertTrue(os.path.exists(backup['path']))
            self.assertGreater(backup['size'], 0)
            self.assertIsInstance(backup['created'], datetime)
        
        # Verify backups are sorted by creation time (newest first)
        self.assertGreater(backups[0]['created'], backups[1]['created'])
    
    def test_list_backups_empty_directory(self):
        """Test listing backups from empty directory."""
        empty_dir = os.path.join(self.temp_dir, "empty")
        os.makedirs(empty_dir)
        
        backups = list_backups(backup_dir=empty_dir)
        self.assertEqual(len(backups), 0)
    
    def test_backup_timestamp_formatting(self):
        """Test backup timestamp formatting."""
        db_name = os.path.basename(self.test_db_path)
        backup_path = create_file_backup(backup_dir=self.temp_dir, db_name=db_name, db_path=self.test_db_path)
        
        # Extract timestamp from filename
        filename = os.path.basename(backup_path)
        # Format should be: {db_name}.YYYYMMDD_HHMMSS_mmm.backup
        
        # Split by the timestamp pattern (YYYYMMDD_HHMMSS_mmm)
        parts = re.split(r'\.\d{8}_\d{6}_\d{3}\.', filename)
        self.assertEqual(len(parts), 2)
        self.assertEqual(parts[0], db_name)
        self.assertEqual(parts[1], "backup")
        
        # Extract and parse timestamp
        timestamp_match = re.search(r'\.(\d{8}_\d{6}_\d{3})\.', filename)
        self.assertIsNotNone(timestamp_match)
        timestamp_str = timestamp_match.group(1)
        
        try:
            timestamp = datetime.strptime(timestamp_str, "%Y%m%d_%H%M%S_%f")
            # Should be recent (within last minute)
            now = datetime.now()
            time_diff = abs((now - timestamp).total_seconds())
            self.assertLess(time_diff, 60)
        except ValueError:
            self.fail(f"Invalid timestamp format: {timestamp_str}")
    
    def test_backup_verification(self):
        """Test backup verification logic."""
        backup_path = create_file_backup(backup_dir=self.temp_dir, db_path=self.test_db_path)
        
        # Verify backup file exists and is readable
        self.assertTrue(os.path.exists(backup_path))
        self.assertTrue(os.access(backup_path, os.R_OK))
        
        # Verify backup size is reasonable (allowing for SQLite optimizations)
        original_size = os.path.getsize(self.test_db_path)
        backup_size = os.path.getsize(backup_path)
        # Allow for small size differences due to SQLite internal optimizations
        size_diff = abs(original_size - backup_size)
        self.assertLessEqual(size_diff, 5000, f"Size difference too large: {size_diff} bytes")
        
        # Verify backup contains valid SQLite database
        with sqlite3.connect(backup_path) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT sqlite_version()")
            version = cursor.fetchone()[0]
            self.assertIsNotNone(version)

if __name__ == '__main__':
    unittest.main()
