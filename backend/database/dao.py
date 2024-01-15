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
                    time_to_first_token_ms=row[16],  # time_to_first_token_ms
                    time_to_last_token_ms=row[17],   # time_to_last_token_ms
                    is_streaming=bool(row[7]),       # is_streaming
                    success=bool(row[2]),            # success
                    message_count=row[11],           # message_count
                    prompt_tokens=row[12],           # prompt_tokens
                    tokens={
                        "total": row[14],            # total_tokens (index 14)
                        "prompt": row[12],           # prompt_tokens (index 12)
                        "completion": row[13]        # completion_tokens (index 13)
                    },
                    model=row[5]  # model
                )
                results.append(completion_request)
            
            return results
    
    def get_metrics(self, start_date: Optional[str] = None, 
                    end_date: Optional[str] = None) -> Metrics:
        """Get aggregated metrics for the specified time period."""
        date_filter = ""
        params = []
        
        if start_date or end_date:
            date_filter = "WHERE 1=1"
            if start_date:
                date_filter += " AND datetime(timestamp) >= datetime(?)"
                params.append(start_date)
            if end_date:
                date_filter += " AND datetime(timestamp) <= datetime(?)"
                params.append(end_date)
        
        with self.get_cursor() as cursor:
            # Total requests
            cursor.execute(f"SELECT COUNT(*) FROM {self.table_name} {date_filter}", params)
            total_requests = cursor.fetchone()[0]
            
            # Successful requests
            if date_filter:
                cursor.execute(f"SELECT COUNT(*) FROM {self.table_name} {date_filter} AND success = 1", params)
            else:
                cursor.execute(f"SELECT COUNT(*) FROM {self.table_name} WHERE success = 1")
            successful_requests = cursor.fetchone()[0]
            
            # Failed requests
            if date_filter:
                cursor.execute(f"SELECT COUNT(*) FROM {self.table_name} {date_filter} AND success = 0", params)
            else:
                cursor.execute(f"SELECT COUNT(*) FROM {self.table_name} WHERE success = 0")
            failed_requests = cursor.fetchone()[0]
            
            # Average response time
            if date_filter:
                cursor.execute(f"""
                    SELECT AVG(response_time_ms) FROM {self.table_name} 
                    {date_filter} AND response_time_ms IS NOT NULL
                """, params)
            else:
                cursor.execute(f"""
                    SELECT AVG(response_time_ms) FROM {self.table_name} 
                    WHERE response_time_ms IS NOT NULL
                """)
            avg_response_time = cursor.fetchone()[0] or 0
            
            # Streaming vs non-streaming
            if date_filter:
                cursor.execute(f"SELECT COUNT(*) FROM {self.table_name} {date_filter} AND is_streaming = 1", params)
            else:
                cursor.execute(f"SELECT COUNT(*) FROM {self.table_name} WHERE is_streaming = 1")
            streaming_requests = cursor.fetchone()[0]
            
            if date_filter:
                cursor.execute(f"SELECT COUNT(*) FROM {self.table_name} {date_filter} AND is_streaming = 0", params)
            else:
                cursor.execute(f"SELECT COUNT(*) FROM {self.table_name} WHERE is_streaming = 0")
            non_streaming_requests = cursor.fetchone()[0]
            
            # Model distribution
            if date_filter:
                cursor.execute(f"""
                    SELECT model, COUNT(*) as count FROM {self.table_name} 
                    {date_filter} AND model IS NOT NULL 
                    GROUP BY model ORDER BY count DESC
                """, params)
            else:
                cursor.execute(f"""
                    SELECT model, COUNT(*) as count FROM {self.table_name} 
                    WHERE model IS NOT NULL 
                    GROUP BY model ORDER BY count DESC
                """)
            model_distribution = dict(cursor.fetchall())
            
            # Finish reasons
            if date_filter:
                cursor.execute(f"""
                    SELECT finish_reason, COUNT(*) as count FROM {self.table_name} 
                    {date_filter} AND finish_reason IS NOT NULL AND finish_reason != '' 
                    GROUP BY finish_reason ORDER BY count DESC
                """, params)
            else:
                cursor.execute(f"""
                    SELECT finish_reason, COUNT(*) as count FROM {self.table_name} 
                    WHERE finish_reason IS NOT NULL AND finish_reason != '' 
                    GROUP BY finish_reason ORDER BY count DESC
                """)
            finish_reasons = dict(cursor.fetchall())
            
            # Error types
            if date_filter:
                cursor.execute(f"""
                    SELECT error_type, COUNT(*) as count FROM {self.table_name} 
                    {date_filter} AND error_type IS NOT NULL AND error_type != '' 
                    GROUP BY error_type ORDER BY count DESC
                """, params)
            else:
                cursor.execute(f"""
                    SELECT error_type, COUNT(*) as count FROM {self.table_name} 
                    WHERE error_type IS NOT NULL AND error_type != '' 
                    GROUP BY error_type ORDER BY count DESC
                """)
            error_types = dict(cursor.fetchall())
            
            # Token statistics
            if date_filter:
                cursor.execute(f"""
                    SELECT 
                        AVG(prompt_tokens) as avg_prompt_tokens,
                        AVG(completion_tokens) as avg_completion_tokens,
                        AVG(total_tokens) as avg_total_tokens
                    FROM {self.table_name} 
                    {date_filter} AND total_tokens IS NOT NULL
                """, params)
            else:
                cursor.execute(f"""
                    SELECT 
                        AVG(prompt_tokens) as avg_prompt_tokens,
                        AVG(completion_tokens) as avg_completion_tokens,
                        AVG(total_tokens) as avg_total_tokens
                    FROM {self.table_name} 
                    WHERE total_tokens IS NOT NULL
                """)
            token_stats = cursor.fetchone()
            
            avg_prompt_tokens = token_stats[0] or 0
            avg_completion_tokens = token_stats[1] or 0
            avg_total_tokens = token_stats[2] or 0
            
            # Streaming-specific metrics
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
            streaming_stats = cursor.fetchone()
            
            avg_time_to_first_token_ms = streaming_stats[0] or 0
            avg_time_to_last_token_ms = streaming_stats[1] or 0
            avg_completion_duration_ms = streaming_stats[2] or 0
            
            # Convert dictionaries to lists of objects
            top_origins = []  # TODO: Add origin tracking
            
            # Calculate token totals
            total_tokens_used = None
            avg_tokens_per_request = None
            if avg_total_tokens > 0:
                total_tokens_used = total_requests * avg_total_tokens
                avg_tokens_per_request = avg_total_tokens
            
            # Calculate tokens per second
            avg_tokens_per_second = None
            if avg_response_time > 0 and avg_total_tokens > 0:
                avg_tokens_per_second = (avg_total_tokens * 1000) / avg_response_time
            
            # Calculate success rate
            success_rate = successful_requests / total_requests if total_requests > 0 else 0.0
            
            return Metrics(
                total_requests=total_requests,
                successful_requests=successful_requests,
                failed_requests=failed_requests,
                recent_requests_24h=total_requests,  # TODO: Implement proper 24h filtering
                success_rate=success_rate,
                streaming_requests=streaming_requests,
                non_streaming_requests=non_streaming_requests,
                total_tokens_used=total_tokens_used,
                avg_tokens_per_request=avg_tokens_per_request,
                avg_response_time_ms=avg_response_time,
                avg_tokens_per_second=avg_tokens_per_second,
                avg_time_to_first_token_ms=avg_time_to_first_token_ms,
                avg_time_to_last_token_ms=avg_time_to_last_token_ms,
                avg_completion_duration_ms=avg_completion_duration_ms,
                model_distribution=model_distribution,
                top_origins=top_origins,
                finish_reasons=finish_reasons,
                error_types=error_types,
                avg_prompt_tokens=avg_prompt_tokens,
                avg_completion_tokens=avg_completion_tokens,
                avg_total_tokens=avg_total_tokens,
                timestamp=datetime.now().isoformat()
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
