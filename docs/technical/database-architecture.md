# Database Architecture

This document describes the database architecture, migration system, and safety features of the LLM Metrics Proxy.

## Overview

The application uses SQLite as its database engine with a robust architecture designed for production safety, data integrity, and maintainability.

## Core Components

### 1. Safe Migration System

The migration system ensures database schema changes are safe and reversible:

#### Schema Versioning
- **Version Tracking**: `CURRENT_SCHEMA_VERSION` constant defines the target schema
- **Version Table**: `schema_version` table stores current database version
- **Migration Detection**: System automatically detects when migrations are needed

#### Migration Safety Features
- **Automatic Backups**: File and table backups created before any migration
- **Rollback Capability**: Failed migrations can be automatically rolled back
- **Schema Validation**: Post-migration validation ensures data integrity
- **Fail-Fast Startup**: System won't start if migrations cannot complete safely

#### Migration Process
1. Check current schema version
2. Create backup (file or table)
3. Run migration step
4. Validate new schema
5. Update schema version
6. Clean up backup if successful

### 2. DAO Pattern

Data access is centralized through the `CompletionRequestsDAO`:

#### Benefits
- **Centralized Operations**: All database queries go through the DAO
- **Consistent Patterns**: Standardized data access methods
- **Easy Testing**: Mock databases for isolated testing
- **No Custom SQL**: Eliminates scattered database queries throughout codebase

#### Key Methods
- `insert_completion_request()`: Insert new completion request
- `get_completion_requests()`: Retrieve completion requests with filtering
- `get_metrics()`: Get aggregated metrics for specified time period
- `get_table_info()`: Get table schema information
- `validate_data_integrity()`: Validate data integrity in the table

### 3. Backup Strategies

Multiple backup approaches ensure data safety:

#### File Backups
- **Complete Database Copies**: Full database file copies with timestamps
- **Naming Convention**: `metrics.db.YYYYMMDD_HHMMSS_mmm.backup`
- **Location Strategy**: 
  - Primary: `db_dir/backups/`
  - Fallback: `~/.llm_metrics_proxy/backups/`
  - Production: Fails to start if backups cannot be created

#### Table Backups
- **In-Database Backups**: Backup tables created within the same database
- **Quick Restoration**: Faster than file-based restoration
- **Automatic Cleanup**: Backup tables cleaned up after successful migration

#### Environment Awareness
- **Production**: Strict backup requirements, fails if backups cannot be created
- **Testing**: Uses temporary directories, prevents production interference
- **Environment Variable**: `TESTING=true` controls backup behavior

## Database Schema

### Completion Requests Table

```sql
CREATE TABLE completion_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    success BOOLEAN NOT NULL,
    status_code INTEGER NOT NULL,
    response_time_ms INTEGER NOT NULL,
    model TEXT,
    origin TEXT,
    is_streaming BOOLEAN NOT NULL,
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
);
```

### Schema Version Table

```sql
CREATE TABLE schema_version (
    version INTEGER PRIMARY KEY,
    applied_at TEXT NOT NULL
);
```

## Error Handling

### Database-Level Error Handling

The database layer includes built-in error handling:

- **Connection Failures**: Graceful handling of database connection issues
- **Transaction Rollback**: Automatic rollback on failed operations
- **Schema Validation**: Post-migration schema integrity checks
- **Backup Failures**: System fails to start if backups cannot be created

## Testing Strategy

### Test Suite Architecture

The project includes a comprehensive test suite designed for safety and reliability:

#### Isolation Features
- **Temporary Databases**: Each test uses isolated temporary databases
- **Mock Database Paths**: Tests mock `get_db_path()` to ensure isolation
- **Environment Variables**: `TESTING=true` prevents accidental production writes
- **Comprehensive Coverage**: Tests cover DAO, migrations, backup/restore, and error handling

#### Test Categories
1. **DAO Tests** (`test_dao.py`): Database operations and data access patterns
2. **Migration Tests** (`test_migrations.py`): Safe migration system and rollback capabilities
3. **Backup Tests** (`test_backup.py`): File and table backup/restore operations

### Test Execution

```bash
# Run all tests
python run_tests.py

# Run specific test categories
python run_tests.py test_dao.py
python run_tests.py test_migrations.py
python run_tests.py test_backup.py
```

## Production Considerations

### Backup Requirements
- **Automatic Creation**: Backups must be created before any database operation
- **Location Validation**: System validates backup locations are writable
- **Size Verification**: Backup integrity verified through size checks
- **Cleanup Strategy**: Automatic cleanup of old backups

### Migration Safety
- **Pre-flight Checks**: Validate backup creation before migration
- **Rollback Strategy**: Automatic rollback on migration failure
- **Schema Validation**: Post-migration schema integrity checks
- **Startup Requirements**: System won't start with incomplete migrations

### Performance Considerations
- **Connection Pooling**: Efficient database connection management
- **Query Optimization**: Optimized queries through DAO pattern
- **Index Strategy**: Proper indexing for time-series queries
- **Memory Management**: Efficient handling of large datasets
