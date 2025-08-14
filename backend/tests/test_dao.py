"""
Tests for the DAO (Data Access Object) service.

This demonstrates how to test database operations with mock databases
and isolated test environments.
"""

import unittest
import tempfile
import os
import sqlite3
from unittest.mock import patch, MagicMock
from datetime import datetime

from backend.database.dao import CompletionRequestsDAO
from backend.database.schema import COMPLETION_REQUESTS_SCHEMA, SCHEMA_VERSION_TABLE
from shared.types import CompletionRequestData, Metrics

class TestCompletionRequestsDAO(unittest.TestCase):
    """Test cases for CompletionRequestsDAO."""
    
    def setUp(self):
        """Set up test database and DAO."""
        # Create a temporary database file
        self.temp_db = tempfile.NamedTemporaryFile(delete=False, suffix='.db')
        self.temp_db.close()
        
        # Create test database with schema
        with sqlite3.connect(self.temp_db.name) as conn:
            cursor = conn.cursor()
            cursor.execute(COMPLETION_REQUESTS_SCHEMA)
            cursor.execute(SCHEMA_VERSION_TABLE)
            conn.commit()
        
        # Mock the database connection to use our test database
        self.dao = CompletionRequestsDAO()
        self.original_get_db_path = None
        
        # Patch the database connection to use our test database
        self.patcher = patch('backend.database.connection.get_db_path')
        mock_get_db_path = self.patcher.start()
        mock_get_db_path.return_value = self.temp_db.name
    
    def tearDown(self):
        """Clean up test database."""
        self.patcher.stop()
        if os.path.exists(self.temp_db.name):
            os.unlink(self.temp_db.name)
    
    def test_insert_completion_request(self):
        """Test inserting a completion request."""
        test_data = {
            'timestamp': '2024-01-15T10:00:00',
            'success': True,
            'status_code': 200,
            'response_time_ms': 1500,
            'model': 'gpt-3.5-turbo',
            'origin': 'test',
            'is_streaming': False,
            'max_tokens': 100,
            'temperature': 0.7,
            'top_p': 1.0,
            'message_count': 2,
            'prompt_tokens': 50,
            'completion_tokens': 30,
            'total_tokens': 80,
            'finish_reason': 'stop',
            'time_to_first_token_ms': 500,
            'time_to_last_token_ms': 1500,
            'tokens_per_second': 20.0,
            'error_type': None,
            'error_message': None
        }
        
        # Insert the request
        request_id = self.dao.insert_completion_request(test_data)
        
        # Verify it was inserted
        self.assertIsNotNone(request_id)
        self.assertGreater(request_id, 0)
        
        # Verify the data was stored correctly
        with sqlite3.connect(self.temp_db.name) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM completion_requests WHERE id = ?", (request_id,))
            row = cursor.fetchone()
            
            self.assertIsNotNone(row)
            self.assertEqual(row[1], test_data['timestamp'])  # timestamp
            self.assertEqual(row[2], test_data['success'])    # success
            self.assertEqual(row[3], test_data['status_code']) # status_code
            self.assertEqual(row[4], test_data['response_time_ms']) # response_time_ms
            self.assertEqual(row[5], test_data['model'])      # model
    
    def test_get_completion_requests(self):
        """Test retrieving completion requests."""
        # Insert test data
        test_data = {
            'timestamp': '2024-01-15T10:00:00',
            'success': True,
            'status_code': 200,
            'response_time_ms': 1500,
            'model': 'gpt-3.5-turbo',
            'origin': 'test',
            'is_streaming': False,
            'max_tokens': 100,
            'temperature': 0.7,
            'top_p': 1.0,
            'message_count': 2,
            'prompt_tokens': 50,
            'completion_tokens': 30,
            'total_tokens': 80,
            'finish_reason': 'stop',
            'time_to_first_token_ms': 500,
            'time_to_last_token_ms': 1500,
            'tokens_per_second': 20.0,
            'error_type': None,
            'error_message': None
        }
        
        self.dao.insert_completion_request(test_data)
        
        # Retrieve requests
        requests = self.dao.get_completion_requests()
        
        # Verify results
        self.assertEqual(len(requests), 1)
        request = requests[0]
        
        self.assertIsInstance(request, CompletionRequestData)
        self.assertEqual(request.timestamp, test_data['timestamp'])
        self.assertEqual(request.success, test_data['success'])
        self.assertEqual(request.model, test_data['model'])
        self.assertEqual(request.tokens['total'], test_data['total_tokens'])
    
    def test_get_metrics(self):
        """Test retrieving aggregated metrics."""
        # Insert multiple test records
        test_records = [
            {
                'timestamp': '2024-01-15T10:00:00',
                'success': True,
                'status_code': 200,
                'response_time_ms': 1000,
                'model': 'gpt-3.5-turbo',
                'origin': 'test1',
                'is_streaming': True,
                'max_tokens': 100,
                'temperature': 0.7,
                'top_p': 1.0,
                'message_count': 2,
                'prompt_tokens': 50,
                'completion_tokens': 30,
                'total_tokens': 80,
                'finish_reason': 'stop',
                'time_to_first_token_ms': 200,
                'time_to_last_token_ms': 1000,
                'tokens_per_second': 20.0,
                'error_type': None,
                'error_message': None
            },
            {
                'timestamp': '2024-01-15T11:00:00',
                'success': True,
                'status_code': 200,
                'response_time_ms': 2000,
                'model': 'gpt-4',
                'origin': 'test2',
                'is_streaming': False,
                'max_tokens': 200,
                'temperature': 0.8,
                'top_p': 0.9,
                'message_count': 3,
                'prompt_tokens': 100,
                'completion_tokens': 80,
                'total_tokens': 180,
                'finish_reason': 'length',
                'time_to_first_token_ms': None,
                'time_to_last_token_ms': None,
                'tokens_per_second': 15.0,
                'error_type': None,
                'error_message': None
            }
        ]
        
        for record in test_records:
            self.dao.insert_completion_request(record)
        
        # Get metrics
        metrics = self.dao.get_metrics()
        
        # Verify metrics
        self.assertIsInstance(metrics, Metrics)
        self.assertEqual(metrics.total_requests, 2)
        self.assertEqual(metrics.successful_requests, 2)
        self.assertEqual(metrics.failed_requests, 0)
        self.assertEqual(metrics.success_rate, 1.0)
        self.assertEqual(metrics.avg_response_time_ms, 1500)  # (1000 + 2000) / 2
        self.assertEqual(metrics.streaming_requests, 1)
        self.assertEqual(metrics.non_streaming_requests, 1)
        
        # Check model distribution
        self.assertEqual(metrics.model_distribution['gpt-3.5-turbo'], 1)
        self.assertEqual(metrics.model_distribution['gpt-4'], 1)
        
        # Check finish reasons
        self.assertEqual(metrics.finish_reasons['stop'], 1)
        self.assertEqual(metrics.finish_reasons['length'], 1)
    
    def test_get_completion_requests_with_date_filtering(self):
        """Test date filtering in completion requests."""
        # Insert test data with different timestamps
        test_records = [
            {
                'timestamp': '2024-01-15T10:00:00',
                'success': True,
                'status_code': 200,
                'response_time_ms': 1000,
                'model': 'gpt-3.5-turbo',
                'origin': 'test1',
                'is_streaming': False,
                'max_tokens': 100,
                'temperature': 0.7,
                'top_p': 1.0,
                'message_count': 2,
                'prompt_tokens': 50,
                'completion_tokens': 30,
                'total_tokens': 80,
                'finish_reason': 'stop',
                'time_to_first_token_ms': None,
                'time_to_last_token_ms': None,
                'tokens_per_second': 20.0,
                'error_type': None,
                'error_message': None
            },
            {
                'timestamp': '2024-01-16T10:00:00',
                'success': True,
                'status_code': 200,
                'response_time_ms': 2000,
                'model': 'gpt-4',
                'origin': 'test2',
                'is_streaming': False,
                'max_tokens': 200,
                'temperature': 0.8,
                'top_p': 0.9,
                'message_count': 3,
                'prompt_tokens': 100,
                'completion_tokens': 80,
                'total_tokens': 180,
                'finish_reason': 'length',
                'time_to_first_token_ms': None,
                'time_to_last_token_ms': None,
                'tokens_per_second': 15.0,
                'error_type': None,
                'error_message': None
            }
        ]
        
        for record in test_records:
            self.dao.insert_completion_request(record)
        
        # Test start date filtering
        requests = self.dao.get_completion_requests(start_date='2024-01-16T00:00:00')
        self.assertEqual(len(requests), 1)
        self.assertEqual(requests[0].model, 'gpt-4')
        
        # Test end date filtering
        requests = self.dao.get_completion_requests(end_date='2024-01-15T23:59:59')
        self.assertEqual(len(requests), 1)
        self.assertEqual(requests[0].model, 'gpt-3.5-turbo')
        
        # Test date range filtering
        requests = self.dao.get_completion_requests(
            start_date='2024-01-15T09:00:00',
            end_date='2024-01-15T11:00:00'
        )
        self.assertEqual(len(requests), 1)
        self.assertEqual(requests[0].model, 'gpt-3.5-turbo')
    
    def test_validate_data_integrity(self):
        """Test data integrity validation."""
        # Insert valid data
        test_data = {
            'timestamp': '2024-01-15T10:00:00',
            'success': True,
            'status_code': 200,
            'response_time_ms': 1000,
            'model': 'gpt-3.5-turbo',
            'origin': 'test',
            'is_streaming': False,
            'max_tokens': 100,
            'temperature': 0.7,
            'top_p': 1.0,
            'message_count': 2,
            'prompt_tokens': 50,
            'completion_tokens': 30,
            'total_tokens': 80,
            'finish_reason': 'stop',
            'time_to_first_token_ms': None,
            'time_to_last_token_ms': None,
            'tokens_per_second': 20.0,
            'error_type': None,
            'error_message': None
        }
        
        self.dao.insert_completion_request(test_data)
        
        # Validate integrity
        is_valid, errors = self.dao.validate_data_integrity()
        self.assertTrue(is_valid)
        self.assertEqual(len(errors), 0)
    
    def test_get_table_info(self):
        """Test getting table schema information."""
        table_info = self.dao.get_table_info()
        
        # Should have the expected columns
        column_names = [col[1] for col in table_info]
        expected_columns = [
            'id', 'timestamp', 'success', 'status_code', 'response_time_ms',
            'model', 'origin', 'is_streaming', 'max_tokens', 'temperature',
            'top_p', 'message_count', 'prompt_tokens', 'completion_tokens',
            'total_tokens', 'finish_reason', 'time_to_first_token_ms',
            'time_to_last_token_ms', 'tokens_per_second', 'error_type',
            'error_message'
        ]
        
        for expected_col in expected_columns:
            self.assertIn(expected_col, column_names)
    
    def test_get_row_count(self):
        """Test getting row count."""
        # Initially should be 0
        count = self.dao.get_row_count()
        self.assertEqual(count, 0)
        
        # Insert a record
        test_data = {
            'timestamp': '2024-01-15T10:00:00',
            'success': True,
            'status_code': 200,
            'response_time_ms': 1000,
            'model': 'gpt-3.5-turbo',
            'origin': 'test',
            'is_streaming': False,
            'max_tokens': 100,
            'temperature': 0.7,
            'top_p': 1.0,
            'message_count': 2,
            'prompt_tokens': 50,
            'completion_tokens': 30,
            'total_tokens': 80,
            'finish_reason': 'stop',
            'time_to_first_token_ms': None,
            'time_to_last_token_ms': None,
            'tokens_per_second': 20.0,
            'error_type': None,
            'error_message': None
        }
        
        self.dao.insert_completion_request(test_data)
        
        # Should now be 1
        count = self.dao.get_row_count()
        self.assertEqual(count, 1)
    
    def test_get_metrics_with_origin_distribution(self):
        """Test that origin distribution is properly populated in metrics."""
        # Insert test data with different origins
        test_records = [
            {
                'timestamp': '2024-01-15T10:00:00',
                'success': True,
                'status_code': 200,
                'response_time_ms': 1000,
                'model': 'gpt-4',
                'origin': 'https://example.com',
                'is_streaming': False,
                'max_tokens': 100,
                'temperature': 0.7,
                'top_p': 1.0,
                'message_count': 2,
                'prompt_tokens': 50,
                'completion_tokens': 30,
                'total_tokens': 80,
                'finish_reason': 'stop',
                'time_to_first_token_ms': None,
                'time_to_last_token_ms': None,
                'tokens_per_second': 20.0,
                'error_type': None,
                'error_message': None
            },
            {
                'timestamp': '2024-01-15T10:30:00',
                'success': True,
                'status_code': 200,
                'response_time_ms': 1200,
                'model': 'gpt-4',
                'origin': 'https://example.com',
                'is_streaming': False,
                'max_tokens': 100,
                'temperature': 0.7,
                'top_p': 1.0,
                'message_count': 2,
                'prompt_tokens': 50,
                'completion_tokens': 30,
                'total_tokens': 80,
                'finish_reason': 'stop',
                'time_to_first_token_ms': None,
                'time_to_last_token_ms': None,
                'tokens_per_second': 20.0,
                'error_type': None,
                'error_message': None
            },
            {
                'timestamp': '2024-01-15T11:00:00',
                'success': True,
                'status_code': 200,
                'response_time_ms': 800,
                'model': 'gpt-3.5-turbo',
                'origin': 'https://app.mycompany.com',
                'is_streaming': True,
                'max_tokens': 100,
                'temperature': 0.7,
                'top_p': 1.0,
                'message_count': 2,
                'prompt_tokens': 50,
                'completion_tokens': 30,
                'total_tokens': 80,
                'finish_reason': 'stop',
                'time_to_first_token_ms': 200,
                'time_to_last_token_ms': 800,
                'tokens_per_second': 20.0,
                'error_type': None,
                'error_message': None
            }
        ]
        
        # Insert all test records
        for record in test_records:
            self.dao.insert_completion_request(record)
        
        # Get metrics
        metrics = self.dao.get_metrics()
        
        # Verify origin distribution is populated
        self.assertIsNotNone(metrics.origin_distribution)
        self.assertIsInstance(metrics.origin_distribution, dict)
        
        # Should have 2 origins
        self.assertEqual(len(metrics.origin_distribution), 2)
        
        # https://example.com should have 2 requests
        self.assertEqual(metrics.origin_distribution['https://example.com'], 2)
        
        # https://app.mycompany.com should have 1 request
        self.assertEqual(metrics.origin_distribution['https://app.mycompany.com'], 1)
        
        # Origins should be ordered by count (descending)
        origin_items = list(metrics.origin_distribution.items())
        self.assertEqual(origin_items[0][0], 'https://example.com')  # 2 requests
        self.assertEqual(origin_items[1][0], 'https://app.mycompany.com')  # 1 request

if __name__ == '__main__':
    unittest.main()
