"""
Data Access Object for completion requests.

This module provides a centralized interface for all database operations
related to completion requests, ensuring type safety and consistency.
"""

import sqlite3
from typing import List, Optional, Tuple, Dict, Any
from datetime import datetime
from contextlib import contextmanager

from backend.database.connection import get_db_connection
from backend.database.schema import validate_schema
from shared.types import CompletionRequestData, Metrics, ModelUsage, FinishReason, ErrorType

class CompletionRequestsDAO:
    """Data Access Object for completion_requests table."""
    
    def __init__(self):
        self.table_name = "completion_requests"
    
    @contextmanager
    def get_cursor(self):
        """Context manager for database cursor."""
        with get_db_connection() as conn:
            try:
                cursor = conn.cursor()
                yield cursor
                conn.commit()
            except Exception:
                conn.rollback()
                raise
    
    def insert_completion_request(self, data: Dict[str, Any]) -> int:
        """Insert a new completion request record."""
        required_fields = [
            'timestamp', 'success', 'status_code', 'response_time_ms',
            'model', 'origin', 'is_streaming', 'max_tokens', 'temperature',
            'top_p', 'message_count', 'prompt_tokens', 'completion_tokens',
            'total_tokens', 'finish_reason', 'time_to_first_token_ms',
            'time_to_last_token_ms', 'tokens_per_second', 'error_type',
            'error_message'
        ]
        
        # Build the INSERT statement dynamically
        fields = [field for field in required_fields if field in data]
        placeholders = ', '.join(['?' for _ in fields])
        field_names = ', '.join(fields)
        
        sql = f"INSERT INTO {self.table_name} ({field_names}) VALUES ({placeholders})"
        values = [data.get(field) for field in fields]
        
        with self.get_cursor() as cursor:
            cursor.execute(sql, values)
            return cursor.lastrowid
    
    def get_completion_requests(self, start_date: Optional[str] = None, 
                               end_date: Optional[str] = None,
                               limit: Optional[int] = None) -> List[CompletionRequestData]:
        """Get completion requests with optional date filtering."""
        sql = f"""
            SELECT id, timestamp, success, status_code, response_time_ms, model, origin, 
                   is_streaming, max_tokens, temperature, top_p, message_count, 
                   prompt_tokens, completion_tokens, total_tokens, finish_reason,
                   time_to_first_token_ms, time_to_last_token_ms, tokens_per_second, 
                   error_type, error_message
            FROM {self.table_name} WHERE 1=1
        """
        params = []
        
        if start_date:
            sql += " AND datetime(timestamp) >= datetime(?)"
            params.append(start_date)
        
        if end_date:
            sql += " AND datetime(timestamp) <= datetime(?)"
            params.append(end_date)
        
        sql += " ORDER BY timestamp DESC"
        
        if limit:
            sql += " LIMIT ?"
            params.append(limit)
        
        with self.get_cursor() as cursor:
            cursor.execute(sql, params)
            rows = cursor.fetchall()
            
            # Convert rows to CompletionRequestData objects
            results = []
            for row in rows:
                # Map row data to CompletionRequestData fields using explicit column order
                completion_request = CompletionRequestData(
                    timestamp=row[1],  # timestamp
                    is_streaming=bool(row[7]),       # is_streaming
                    success=bool(row[2]),            # success
                    error_type=row[19],              # error_type
                    message_count=row[11],           # message_count
                    timing={
                        "time_to_first_token_ms": row[16],  # time_to_first_token_ms
                        "time_to_last_token_ms": row[17],   # time_to_last_token_ms
                        "response_time_ms": row[4]          # response_time_ms
                    },
                    tokens={
                        "total": row[14],            # total_tokens (index 14)
                        "prompt": row[12],           # prompt_tokens (index 12)
                        "completion": row[13]        # completion_tokens (index 13)
                    },
                    model=row[5],  # model
                    origin=row[6]  # origin
                )
                results.append(completion_request)
            
            return results
    
    def get_metrics(self, start_date: Optional[str] = None, 
                    end_date: Optional[str] = None) -> Metrics:
        """Get aggregated metrics from the completion_requests table."""
        with self.get_cursor() as cursor:
            # Build date filter
            date_filter = ""
            params = []
            if start_date and end_date:
                date_filter = "WHERE timestamp BETWEEN ? AND ?"
                params = [start_date, end_date]
            elif start_date:
                date_filter = "WHERE timestamp >= ?"
                params = [start_date]
            elif end_date:
                date_filter = "WHERE timestamp <= ?"
                params = [end_date]
            
            # Overall request counts
            if date_filter:
                cursor.execute(f"""
                    SELECT 
                        COUNT(*) as total_requests,
                        SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successful_requests,
                        SUM(CASE WHEN success = 0 THEN 1 ELSE 0 END) as failed_requests,
                        AVG(response_time_ms) as avg_response_time
                    FROM {self.table_name} 
                    {date_filter}
                """, params)
            else:
                cursor.execute(f"""
                    SELECT 
                        COUNT(*) as total_requests,
                        SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successful_requests,
                        SUM(CASE WHEN success = 0 THEN 1 ELSE 0 END) as failed_requests,
                        AVG(response_time_ms) as avg_response_time
                    FROM {self.table_name}
                """)
            
            overall_stats = cursor.fetchone()
            total_requests = overall_stats[0] or 0
            successful_requests = overall_stats[1] or 0
            failed_requests = overall_stats[2] or 0
            avg_response_time = overall_stats[3] or 0
            
            # Streaming requests metrics
            if date_filter:
                cursor.execute(f"""
                    SELECT 
                        COUNT(*) as total,
                        SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successful,
                        SUM(CASE WHEN success = 0 THEN 1 ELSE 0 END) as failed,
                        AVG(response_time_ms) as avg_response_time
                    FROM {self.table_name} 
                    {date_filter} AND is_streaming = 1
                """, params)
            else:
                cursor.execute(f"""
                    SELECT 
                        COUNT(*) as total,
                        SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successful,
                        SUM(CASE WHEN success = 0 THEN 1 ELSE 0 END) as failed,
                        AVG(response_time_ms) as avg_response_time
                    FROM {self.table_name} 
                    WHERE is_streaming = 1
                """)
            
            streaming_stats = cursor.fetchone()
            streaming_total = streaming_stats[0] or 0
            streaming_successful = streaming_stats[1] or 0
            streaming_failed = streaming_stats[2] or 0
            streaming_avg_response_time = streaming_stats[3] or 0
            
            # Streaming token metrics
            if date_filter:
                cursor.execute(f"""
                    SELECT 
                        COUNT(*) as reported_count,
                        SUM(total_tokens) as total,
                        SUM(prompt_tokens) as prompt_total,
                        SUM(completion_tokens) as completion_total
                    FROM {self.table_name} 
                    {date_filter} AND is_streaming = 1 AND total_tokens IS NOT NULL
                """, params)
            else:
                cursor.execute(f"""
                    SELECT 
                        COUNT(*) as reported_count,
                        SUM(total_tokens) as total,
                        SUM(prompt_tokens) as prompt_total,
                        SUM(completion_tokens) as completion_total
                    FROM {self.table_name} 
                    WHERE is_streaming = 1 AND total_tokens IS NOT NULL
                """)
            
            streaming_token_stats = cursor.fetchone()
            streaming_reported_count = streaming_token_stats[0] or 0
            streaming_total_tokens = streaming_token_stats[1] or 0
            streaming_prompt_tokens = streaming_token_stats[2] or 0
            streaming_completion_tokens = streaming_token_stats[3] or 0
            
            # Streaming timing metrics
            if date_filter:
                cursor.execute(f"""
                    SELECT 
                        AVG(time_to_first_token_ms) as avg_time_to_first_token,
                        AVG(time_to_last_token_ms) as avg_time_to_last_token,
                        AVG(time_to_last_token_ms - time_to_first_token_ms) as avg_completion_duration
                    FROM {self.table_name} 
                    {date_filter} AND is_streaming = 1 
                    AND time_to_first_token_ms IS NOT NULL 
                    AND time_to_last_token_ms IS NOT NULL
                """, params)
            else:
                cursor.execute(f"""
                    SELECT 
                        AVG(time_to_first_token_ms) as avg_time_to_first_token,
                        AVG(time_to_last_token_ms) as avg_time_to_last_token,
                        AVG(time_to_last_token_ms - time_to_first_token_ms) as avg_completion_duration
                    FROM {self.table_name} 
                    WHERE is_streaming = 1 
                    AND time_to_first_token_ms IS NOT NULL 
                    AND time_to_last_token_ms IS NOT NULL
                """)
            
            streaming_timing_stats = cursor.fetchone()
            streaming_avg_time_to_first_token = streaming_timing_stats[0]
            streaming_avg_time_to_last_token = streaming_timing_stats[1]
            streaming_avg_completion_duration = streaming_timing_stats[2]
            
            # Streaming error types
            if date_filter:
                cursor.execute(f"""
                    SELECT error_type, COUNT(*) as count FROM {self.table_name} 
                    {date_filter} AND is_streaming = 1 AND success = 0 AND error_type IS NOT NULL AND error_type != '' 
                    GROUP BY error_type ORDER BY count DESC
                """, params)
            else:
                cursor.execute(f"""
                    SELECT error_type, COUNT(*) as count FROM {self.table_name} 
                    WHERE is_streaming = 1 AND success = 0 AND error_type IS NOT NULL AND error_type != '' 
                    GROUP BY error_type ORDER BY count DESC
                """)
            streaming_error_types = dict(cursor.fetchall())
            
            # Non-streaming requests metrics
            if date_filter:
                cursor.execute(f"""
                    SELECT 
                        COUNT(*) as total,
                        SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successful,
                        SUM(CASE WHEN success = 0 THEN 1 ELSE 0 END) as failed,
                        AVG(response_time_ms) as avg_response_time
                    FROM {self.table_name} 
                    {date_filter} AND is_streaming = 0
                """, params)
            else:
                cursor.execute(f"""
                    SELECT 
                        COUNT(*) as total,
                        SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successful,
                        SUM(CASE WHEN success = 0 THEN 1 ELSE 0 END) as failed,
                        AVG(response_time_ms) as avg_response_time
                    FROM {self.table_name} 
                    WHERE is_streaming = 0
                """)
            
            non_streaming_stats = cursor.fetchone()
            non_streaming_total = non_streaming_stats[0] or 0
            non_streaming_successful = non_streaming_stats[1] or 0
            non_streaming_failed = non_streaming_stats[2] or 0
            non_streaming_avg_response_time = non_streaming_stats[3] or 0
            
            # Non-streaming token metrics
            if date_filter:
                cursor.execute(f"""
                    SELECT 
                        COUNT(*) as reported_count,
                        SUM(total_tokens) as total,
                        SUM(prompt_tokens) as prompt_total,
                        SUM(completion_tokens) as completion_total
                    FROM {self.table_name} 
                    {date_filter} AND is_streaming = 0 AND total_tokens IS NOT NULL
                """, params)
            else:
                cursor.execute(f"""
                    SELECT 
                        COUNT(*) as reported_count,
                        SUM(total_tokens) as total,
                        SUM(prompt_tokens) as prompt_total,
                        SUM(completion_tokens) as completion_total
                    FROM {self.table_name} 
                    WHERE is_streaming = 0 AND total_tokens IS NOT NULL
                """)
            
            non_streaming_token_stats = cursor.fetchone()
            non_streaming_reported_count = non_streaming_token_stats[0] or 0
            non_streaming_total_tokens = non_streaming_token_stats[1] or 0
            non_streaming_prompt_tokens = non_streaming_token_stats[2] or 0
            non_streaming_completion_tokens = non_streaming_token_stats[3] or 0
            
            # Non-streaming timing metrics
            if date_filter:
                cursor.execute(f"""
                    SELECT 
                        AVG(time_to_first_token_ms) as avg_time_to_first_token,
                        AVG(time_to_last_token_ms) as avg_time_to_last_token,
                        AVG(time_to_last_token_ms - time_to_first_token_ms) as avg_completion_duration
                    FROM {self.table_name} 
                    {date_filter} AND is_streaming = 0 
                    AND time_to_first_token_ms IS NOT NULL 
                    AND time_to_last_token_ms IS NOT NULL
                """, params)
            else:
                cursor.execute(f"""
                    SELECT 
                        AVG(time_to_first_token_ms) as avg_time_to_first_token,
                        AVG(time_to_last_token_ms) as avg_time_to_last_token,
                        AVG(time_to_last_token_ms - time_to_first_token_ms) as avg_completion_duration
                    FROM {self.table_name} 
                    WHERE is_streaming = 0 
                    AND time_to_first_token_ms IS NOT NULL 
                    AND time_to_last_token_ms IS NOT NULL
                """)
            
            non_streaming_timing_stats = cursor.fetchone()
            non_streaming_avg_time_to_first_token = non_streaming_timing_stats[0]
            non_streaming_avg_time_to_last_token = non_streaming_timing_stats[1]
            non_streaming_avg_completion_duration = non_streaming_timing_stats[2]
            
            # Non-streaming error types
            if date_filter:
                cursor.execute(f"""
                    SELECT error_type, COUNT(*) as count FROM {self.table_name} 
                    {date_filter} AND is_streaming = 0 AND success = 0 AND error_type IS NOT NULL AND error_type != '' 
                    GROUP BY error_type ORDER BY count DESC
                """, params)
            else:
                cursor.execute(f"""
                    SELECT error_type, COUNT(*) as count FROM {self.table_name} 
                    WHERE is_streaming = 0 AND success = 0 AND error_type IS NOT NULL AND error_type != '' 
                    GROUP BY error_type ORDER BY count DESC
                """)
            non_streaming_error_types = dict(cursor.fetchall())
            
            # Model distribution
            if date_filter:
                cursor.execute(f"""
                    SELECT model, COUNT(*) as count FROM {self.table_name} 
                    {date_filter} AND model IS NOT NULL AND model != '' 
                    GROUP BY model ORDER BY count DESC
                """, params)
            else:
                cursor.execute(f"""
                    SELECT model, COUNT(*) as count FROM {self.table_name} 
                    WHERE model IS NOT NULL AND model != '' 
                    GROUP BY model ORDER BY count DESC
                """)
            model_distribution = dict(cursor.fetchall())
            
            # Origin distribution
            if date_filter:
                cursor.execute(f"""
                    SELECT origin, COUNT(*) as count FROM {self.table_name} 
                    {date_filter} AND origin IS NOT NULL AND origin != '' 
                    GROUP BY origin ORDER BY count DESC
                """, params)
            else:
                cursor.execute(f"""
                    SELECT origin, COUNT(*) as count FROM {self.table_name} 
                    WHERE origin IS NOT NULL AND origin != '' 
                    GROUP BY origin ORDER BY count DESC
                """)
            origin_distribution = dict(cursor.fetchall())
            
            # Calculate non-streaming tokens per second - use average of individual TPS values
            non_streaming_avg_tokens_per_second = None
            if non_streaming_total > 0:
                if date_filter:
                    cursor.execute(f"""
                        SELECT AVG(tokens_per_second) FROM {self.table_name} 
                        {date_filter} AND is_streaming = 0 AND tokens_per_second IS NOT NULL
                    """, params)
                else:
                    cursor.execute(f"""
                        SELECT AVG(tokens_per_second) FROM {self.table_name} 
                        WHERE is_streaming = 0 AND tokens_per_second IS NOT NULL
                    """)
                result = cursor.fetchone()
                non_streaming_avg_tokens_per_second = result[0] if result and result[0] is not None else None
            
            # Calculate streaming tokens per second - use average of individual TPS values
            streaming_avg_tokens_per_second = None
            if streaming_total > 0:
                if date_filter:
                    cursor.execute(f"""
                        SELECT AVG(tokens_per_second) FROM {self.table_name} 
                        {date_filter} AND is_streaming = 1 AND tokens_per_second IS NOT NULL
                    """, params)
                else:
                    cursor.execute(f"""
                        SELECT AVG(tokens_per_second) FROM {self.table_name} 
                        WHERE is_streaming = 1 AND tokens_per_second IS NOT NULL
                    """)
                result = cursor.fetchone()
                streaming_avg_tokens_per_second = result[0] if result and result[0] is not None else None
            
            # Build the new metrics structure
            from shared.types import TokenMetrics, StreamedRequests, NonStreamedRequests, RequestsSummary, Requests, Metrics
            
            requests_summary = RequestsSummary(
                total=total_requests,
                successful=successful_requests,
                failed=failed_requests,
                avg_response_time_ms=avg_response_time
            )
            
            streamed_requests = StreamedRequests(
                total=streaming_total,
                successful=streaming_successful,
                failed=streaming_failed,
                tokens=TokenMetrics(
                    reported_count=streaming_reported_count,
                    total=streaming_total_tokens,
                    prompt_total=streaming_prompt_tokens,
                    completion_total=streaming_completion_tokens,
                    avg_tokens_per_second=streaming_avg_tokens_per_second
                ),
                error_types=streaming_error_types,
                avg_response_time_ms=streaming_avg_response_time,
                avg_time_to_first_token_ms=streaming_avg_time_to_first_token,
                avg_time_to_last_token_ms=streaming_avg_time_to_last_token,
                avg_completion_duration_ms=streaming_avg_completion_duration
            )
            
            non_streamed_requests = NonStreamedRequests(
                total=non_streaming_total,
                successful=non_streaming_successful,
                failed=non_streaming_failed,
                tokens=TokenMetrics(
                    reported_count=non_streaming_reported_count,
                    total=non_streaming_total_tokens,
                    prompt_total=non_streaming_prompt_tokens,
                    completion_total=non_streaming_completion_tokens,
                    avg_tokens_per_second=non_streaming_avg_tokens_per_second
                ),
                error_types=non_streaming_error_types,
                avg_time_to_first_token_ms=non_streaming_avg_time_to_first_token,
                avg_time_to_last_token_ms=non_streaming_avg_time_to_last_token,
                avg_completion_duration_ms=non_streaming_avg_completion_duration
            )
            
            requests = Requests(
                total=requests_summary,
                streamed=streamed_requests,
                non_streamed=non_streamed_requests
            )
            
            return Metrics(
                timestamp=datetime.now().isoformat(),
                requests=requests,
                model_distribution=model_distribution,
                origin_distribution=origin_distribution
            )
    
    def get_table_info(self) -> List[Tuple[str, str, int, int, int, int]]:
        """Get table schema information."""
        with self.get_cursor() as cursor:
            cursor.execute(f"PRAGMA table_info({self.table_name})")
            return cursor.fetchall()
    
    def get_row_count(self) -> int:
        """Get total number of rows in the table."""
        with self.get_cursor() as cursor:
            cursor.execute(f"SELECT COUNT(*) FROM {self.table_name}")
            return cursor.fetchone()[0]
    
    def validate_data_integrity(self) -> Tuple[bool, List[str]]:
        """Validate data integrity in the table."""
        errors = []
        
        with self.get_cursor() as cursor:
            # Check for NULL values in required fields
            cursor.execute(f"""
                SELECT COUNT(*) FROM {self.table_name} 
                WHERE success IS NULL
            """)
            null_success_count = cursor.fetchone()[0]
            if null_success_count > 0:
                errors.append(f"Found {null_success_count} records with NULL success field")
            
            # Check for invalid response times
            cursor.execute(f"""
                SELECT COUNT(*) FROM {self.table_name} 
                WHERE response_time_ms < 0
            """)
            invalid_response_time_count = cursor.fetchone()[0]
            if invalid_response_time_count > 0:
                errors.append(f"Found {invalid_response_time_count} records with negative response time")
            
            # Check for invalid token counts
            cursor.execute(f"""
                SELECT COUNT(*) FROM {self.table_name} 
                WHERE total_tokens IS NOT NULL AND total_tokens < 0
            """)
            invalid_token_count = cursor.fetchone()[0]
            if invalid_token_count > 0:
                errors.append(f"Found {invalid_token_count} records with negative token count")
        
        return len(errors) == 0, errors

# Global DAO instance
completion_requests_dao = CompletionRequestsDAO()
