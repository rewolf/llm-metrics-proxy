# Technical Documentation

This directory contains technical documentation for the LLM Metrics Proxy project.

## Contents

- [API Documentation](api-spec.md) - API endpoints and usage
- [API Specification](api-spec.md) - Comprehensive API schemas and specifications
- [Architecture Overview](architecture.md) - System architecture and design
- [Frontend Architecture](frontend-architecture.md) - Frontend design and implementation
- [Frontend Folder Structure](folder-structure.md) - Frontend code organization and architecture
- [Database Architecture](database-architecture.md) - Database design, migrations, and safety features

## Development Setup

### Prerequisites

- Python 3.8+
- SQLite3
- Node.js 16+ (for frontend development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd llm-metrics-proxy
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

### Running the Application

1. **Start the backend proxy service**
   ```bash
   python -m backend.metrics_proxy
   ```

2. **Start the metrics server** (in another terminal)
   ```bash
   python -m backend.metrics_server
   ```

3. **Start the frontend** (in another terminal)
   ```bash
   cd frontend
   npm start
   ```

## Testing

### Running Tests

The project includes a comprehensive test suite covering all major components.

#### Quick Start

```bash
# Run all tests
python run_tests.py

# List available tests
python run_tests.py --list

# Run specific test file
python run_tests.py test_dao.py

# Run specific test class
python run_tests.py TestCompletionRequestsDAO
```

#### Test Categories

1. **DAO Tests** (`test_dao.py`)
   - Database operations and data access
   - CRUD operations with mock databases
   - Data validation and integrity checks

2. **Migration Tests** (`test_migrations.py`)
   - Database schema migrations
   - Backup and rollback mechanisms
   - Migration safety features

3. **Backup Tests** (`test_backup.py`)
   - File and table backup operations
   - Restore functionality
   - Error handling and cleanup

#### Running Individual Tests

```bash
# Run specific test method
python -m backend.tests.test_dao TestCompletionRequestsDAO.test_insert_completion_request

# Run with unittest directly
python -m unittest backend.tests.test_dao

# Run with verbose output
python -m unittest -v backend.tests.test_dao
```

#### Test Environment

- **Isolated Databases**: Each test uses temporary SQLite databases
- **Mock Connections**: Database paths are mocked for isolation
- **Clean Setup**: Fresh test environment for each test
- **Real Operations**: Actual SQL operations on real database files

#### Test Coverage

The test suite covers:
- ✅ All DAO operations (CRUD)
- ✅ Migration system with safety features
- ✅ Backup and restore operations
- ✅ Error handling and edge cases
- ✅ Data validation and integrity
- ✅ Schema management and versioning

### Writing Tests

#### Test Structure

```python
class TestExample(unittest.TestCase):
    def setUp(self):
        """Set up test environment."""
        # Create temporary test database
        self.temp_db = tempfile.NamedTemporaryFile(delete=False, suffix='.db')
        
        # Mock database connection
        self.patcher = patch('backend.database.connection.get_db_path')
        mock_get_db_path = self.patcher.start()
        mock_get_db_path.return_value = self.temp_db.name
    
    def tearDown(self):
        """Clean up test environment."""
        self.patcher.stop()
        if os.path.exists(self.temp_db.name):
            os.unlink(self.temp_db.name)
    
    def test_example_operation(self):
        """Test example operation."""
        # Test implementation
        pass
```

#### Test Naming Conventions

- **Test files**: `test_<module_name>.py`
- **Test classes**: `Test<ClassName>`
- **Test methods**: `test_<description>`

#### Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Always clean up resources in `tearDown`
3. **Mocking**: Use mocks for external dependencies
4. **Assertions**: Use specific assertions for better error messages
5. **Documentation**: Clear test method names and docstrings

### Continuous Integration

#### Running Tests in CI

```bash
# Install dependencies
pip install -r requirements.txt

# Run test suite
python run_tests.py

# Check exit code
if [ $? -eq 0 ]; then
    echo "All tests passed"
else
    echo "Tests failed"
    exit 1
fi
```

#### Test Output

Tests provide detailed output including:
- Test discovery and execution
- Pass/fail status for each test
- Error details for failed tests
- Test execution time
- Summary statistics

## Database Management

### Schema Migrations

The project uses a safe migration system with automatic backups.

```bash
# Migrations run automatically on startup
python -m backend.metrics_proxy

# Check migration status
python -c "from backend.database.schema import get_schema_version; print(get_schema_version())"
```

### Backup and Recovery

- **Automatic Backups**: Created before any destructive operations
- **File Backups**: Complete database backups
- **Table Backups**: Individual table backups during migrations
- **Recovery**: Full restore capabilities from backups

### Database Safety Features

1. **Schema Versioning**: Track database schema changes
2. **Automatic Backups**: Always backup before migrations
3. **Rollback Capabilities**: Undo failed migrations
4. **Schema Validation**: Verify database structure after changes
5. **Data Integrity**: Check data consistency

## Troubleshooting

### Common Issues

1. **Permission Denied for Backups**
   - The system automatically falls back to temporary directories
   - Check file permissions in the data directory

2. **Database Locked**
   - Ensure no other processes are using the database
   - Check for zombie processes

3. **Migration Failures**
   - Check logs for detailed error messages
   - Verify database file permissions
   - Check available disk space

### Debug Mode

Enable debug logging for troubleshooting:

```bash
export LOG_LEVEL=DEBUG
python -m backend.metrics_proxy
```

### Log Files

- **Application Logs**: Console output with timestamps
- **Migration Logs**: Database migration progress and errors
- **Backup Logs**: Backup creation and verification details

## Contributing

### Code Quality

- **Type Hints**: Use Python type hints throughout
- **Documentation**: Document all public functions and classes
- **Testing**: Write tests for new functionality
- **Style**: Follow PEP 8 coding standards

### Pull Request Process

1. **Create Feature Branch**: `git checkout -b feature/new-feature`
2. **Write Tests**: Add tests for new functionality
3. **Run Tests**: Ensure all tests pass
4. **Submit PR**: Include description and test results

### Testing Checklist

Before submitting a PR, ensure:
- [ ] All existing tests pass
- [ ] New tests cover new functionality
- [ ] Test coverage is maintained or improved
- [ ] Tests run in isolation
- [ ] Error scenarios are tested
