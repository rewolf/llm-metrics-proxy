# Database Architecture & Migration System

## Overview

This document describes the robust database architecture implemented after the data loss incident. The new system provides multiple layers of protection against data corruption and ensures safe, testable database operations.

## Architecture Components

### 1. Schema Management (`backend/database/schema.py`)

- **Version Tracking**: Maintains schema version in `schema_version` table
- **Schema Validation**: Validates database structure against expected schema
- **Version Comparison**: Detects when migrations are needed

```python
# Current schema version - increment when making changes
CURRENT_SCHEMA_VERSION = 3

# Check if migration is needed
if schema_needs_migration():
    # Run migrations
```

### 2. Backup Service (`backend/database/backup.py`)

- **File Backups**: Complete database file backups before destructive operations
- **Table Backups**: Individual table backups during migrations
- **Restore Capabilities**: Full restore from backups if needed
- **Verification**: Size and integrity checks on backups

```python
# Create backup before migration
backup_path = create_file_backup()

# Create backup table during migration
backup_table = create_backup_table("completion_requests")

# Restore if needed
restore_from_file_backup(backup_path)
```

### 3. Safe Migration System (`backend/database/safe_migrations.py`)

- **Automatic Backups**: Always creates backups before migrations
- **Step-by-Step Execution**: Runs migrations individually with validation
- **Rollback Capabilities**: Automatic rollback on failure
- **Schema Validation**: Validates schema after each migration step

```python
# Migration manager with safety features
migration_manager = SafeMigrationManager()

# Add migration steps
migration_manager.add_migration(
    MigrationStep(1, "Create initial schema", create_initial_schema)
)

# Run with full safety measures
success = migration_manager.run_migrations()
```

### 4. DAO Pattern (`backend/database/dao.py`)

- **Centralized Data Access**: All database operations go through DAO
- **Type Safety**: Strong typing for all database operations
- **Transaction Management**: Proper connection and transaction handling
- **Data Validation**: Integrity checks on data operations

```python
# Use DAO for all database operations
dao = CompletionRequestsDAO()

# Insert data
request_id = dao.insert_completion_request(data)

# Query data
requests = dao.get_completion_requests(start_date, end_date)

# Get metrics
metrics = dao.get_metrics(start_date, end_date)
```

## Migration Safety Features

### Automatic Backup Creation

1. **File Backup**: Complete database backup before any migrations
2. **Table Backup**: Individual table backup before each migration step
3. **Verification**: Backup size and integrity verification

### Rollback Mechanisms

1. **Step Rollback**: Rollback individual failed migration steps
2. **Full Rollback**: Complete rollback to previous state
3. **Backup Restoration**: Restore from file backup if needed

### Validation & Verification

1. **Schema Validation**: Verify schema after each migration
2. **Data Integrity**: Check data integrity after operations
3. **Version Tracking**: Maintain migration history and versions

## Testing Strategy

### DAO Testing

- **Mock Databases**: Use temporary SQLite databases for testing
- **Isolated Tests**: Each test runs in isolation
- **Data Validation**: Test all CRUD operations with sample data
- **Edge Cases**: Test error conditions and edge cases

```python
class TestCompletionRequestsDAO(unittest.TestCase):
    def setUp(self):
        # Create temporary test database
        self.temp_db = tempfile.NamedTemporaryFile(delete=False, suffix='.db')
        
        # Mock database connection to use test database
        self.patcher = patch('backend.database.connection.get_db_path')
        mock_get_db_path = self.patcher.start()
        mock_get_db_path.return_value = self.temp_db.name
```

### Migration Testing

- **Schema Validation**: Test migration creates correct schema
- **Rollback Testing**: Test rollback mechanisms work correctly
- **Backup Testing**: Test backup and restore operations
- **Error Handling**: Test migration failure scenarios

```python
class TestSafeMigrationManager(unittest.TestCase):
    def test_run_migration_step_success(self):
        # Test successful migration execution
        success = self.migration_manager.run_migration_step(migration)
        self.assertTrue(success)
    
    def test_run_migration_step_failure(self):
        # Test migration failure and rollback
        success = self.migration_manager.run_migration_step(migration)
        self.assertFalse(success)
```

## Usage Examples

### Running Migrations

```python
# In metrics_proxy.py startup
if run_safe_migrations():
    logger.info("Database migrations completed successfully")
else:
    logger.error("Database migrations failed - check logs for details")
```

### Using DAO for Data Operations

```python
# In API endpoints
from backend.database.dao import completion_requests_dao

@router.get("/completion_requests")
async def get_completion_requests(start: str = None, end: str = None):
    return completion_requests_dao.get_completion_requests(start, end)

@router.get("/metrics")
async def get_metrics(start: str = None, end: str = None):
    return completion_requests_dao.get_metrics(start, end)
```

### Adding New Migrations

```python
# Define migration function
def add_new_column():
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("ALTER TABLE completion_requests ADD COLUMN new_field TEXT")
        conn.commit()

# Add to migration manager
migration_manager.add_migration(
    MigrationStep(4, "Add new column", add_new_column)
)
```

## Best Practices

### 1. Always Test Migrations

- Test on copy of production data
- Use isolated test environments
- Verify rollback mechanisms work

### 2. Increment Schema Version

- Increment `CURRENT_SCHEMA_VERSION` for each change
- Use descriptive migration descriptions
- Test version detection logic

### 3. Use DAO for All Database Access

- Never access database directly from API endpoints
- Use DAO methods for all CRUD operations
- Maintain transaction boundaries

### 4. Monitor Migration Logs

- Check migration success/failure logs
- Monitor backup creation and cleanup
- Verify schema validation results

## Recovery Procedures

### From Migration Failure

1. Check migration logs for failure details
2. Verify backup files were created
3. Use rollback mechanisms if available
4. Restore from file backup if needed

### From Data Corruption

1. Identify corruption source
2. Check backup availability
3. Restore from most recent clean backup
4. Re-run migrations from backup point

### From Complete Failure

1. Stop all services
2. Restore from file backup
3. Verify database integrity
4. Restart services with safe migrations

## Security Considerations

### Read-Only Metrics Server

- `metrics_server.py` has no database write access
- Only `metrics_proxy.py` can modify database
- Clear separation of concerns

### Backup Security

- Backup files stored in secure location
- Backup cleanup after successful migrations
- Access control on backup directories

### Migration Security

- Only run migrations from trusted code
- Validate all migration inputs
- Log all migration activities

## Monitoring & Alerting

### Migration Status

- Monitor migration success/failure
- Track schema version changes
- Alert on migration failures

### Backup Status

- Monitor backup creation success
- Track backup file sizes and counts
- Alert on backup failures

### Data Integrity

- Regular integrity checks
- Monitor for data corruption
- Alert on integrity violations

## Future Enhancements

### Planned Features

1. **Migration Testing Framework**: Automated testing of migrations
2. **Backup Encryption**: Encrypt backup files for security
3. **Migration Scheduling**: Schedule migrations during maintenance windows
4. **Performance Monitoring**: Track migration performance metrics

### Integration Points

1. **CI/CD Pipeline**: Automated migration testing
2. **Monitoring Systems**: Integration with monitoring tools
3. **Alerting Systems**: Integration with alerting platforms
4. **Backup Storage**: Integration with cloud backup services
