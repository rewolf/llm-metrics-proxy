# App Versioning Strategy

This document outlines the versioning strategy for the LLM Metrics Proxy application, including how versions are managed, when to increment them, and how data migrations are handled.

## Overview

The application uses **semantic versioning** (SemVer) to track both application releases and data compatibility. This ensures that data migrations can be applied intelligently when calculation logic or data structures change.

## Version Format

**Format**: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes that require data migrations
- **MINOR**: New features that don't break existing data
- **PATCH**: Bug fixes and minor improvements

## Current Version

**Current App Version**: `2.0.0`

## Version History

### Version 1.0.0 (Initial Release)
- **Features**: Basic LLM metrics proxy with completion tracking
- **Data Structure**: Basic completion_requests table
- **Calculation Logic**: Used `completion_duration` for TPS calculation
- **Known Issues**: Inflated TPS values due to incomplete timing data

### Version 2.0.0 (Current)
- **Features**: Improved metrics calculation and schema versioning
- **Data Structure**: Added `app_version` field for tracking
- **Calculation Logic**: Uses `response_time` for accurate TPS calculation
- **Data Migration**: Automatically recalculates old TPS values from v1.0.0

## Versioning Discipline

### When to Increment MAJOR Version

**Increment MAJOR version when:**
- Calculation logic changes that affect stored metrics
- Data structure changes that require data migration
- Breaking changes to API endpoints
- Changes that affect data accuracy or interpretation

**Examples:**
- Changing TPS calculation from `completion_duration` to `response_time`
- Adding new required fields that need default values for old records
- Changing how errors are categorized or stored

### When to Increment MINOR Version

**Increment MINOR version when:**
- Adding new features that don't affect existing data
- Adding new optional fields
- Performance improvements
- New API endpoints

**Examples:**
- Adding new metrics fields
- Adding new filtering options
- UI/UX improvements

### When to Increment PATCH Version

**Increment PATCH version when:**
- Bug fixes
- Documentation updates
- Minor improvements
- Security patches

## Data Migration Strategy

### Automatic Migration

The migration system automatically detects when data migrations are needed based on app version differences:

```python
def migrate_data_for_app_version():
    """Migrate data based on app version changes."""
    
    # Find records created with old app versions that need recalculation
    cursor.execute("""
        UPDATE completion_requests 
        SET 
            tokens_per_second = (total_tokens * 1000.0) / response_time_ms,
            app_version = '2.0.0'  -- Current app version
        WHERE app_version < '2.0.0'  -- Old versions need fixing
    """)
```

### Migration Rules

1. **Version Detection**: System checks `app_version` field in each record
2. **Migration Logic**: Migration functions know what transformations are needed for each version
3. **Data Integrity**: Migrations run with full backup and rollback safety
4. **Version Update**: Records are updated to current app version after migration

## Implementation Guidelines

### Adding New Versions

1. **Update App Version**: Change version in `metrics_service.py`
2. **Add Migration**: Create new migration function in `safe_migrations.py`
3. **Update Tests**: Ensure all test schemas include new fields
4. **Document Changes**: Update this document with version details

### Example Migration Function

```python
def migrate_to_version_3_0_0():
    """Migrate data for app version 3.0.0."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Find records that need migration
        cursor.execute("""
            UPDATE completion_requests 
            SET 
                new_field = 'default_value',
                app_version = '3.0.0'
            WHERE app_version < '3.0.0'
        """)
        
        conn.commit()
```

### Testing New Versions

1. **Schema Tests**: Ensure new fields are properly added
2. **Migration Tests**: Test that old data is properly migrated
3. **Data Integrity**: Verify that migrated data is accurate
4. **Rollback Tests**: Ensure migrations can be safely rolled back

## Best Practices

### Version Management

- **Always increment version** when making changes
- **Document what changed** in each version
- **Test migrations thoroughly** before deployment
- **Keep migration functions simple** and focused

### Data Safety

- **Always backup** before running migrations
- **Test migrations** on sample data first
- **Validate results** after migration
- **Provide rollback** capabilities

### Documentation

- **Update this document** for each version change
- **Include migration notes** for breaking changes
- **Document known issues** and their fixes
- **Keep examples current** and relevant

## Future Considerations

### Planned Versions

- **Version 3.0.0**: Enhanced error tracking and categorization
- **Version 4.0.0**: Advanced analytics and reporting features

### Migration Planning

- **Backward Compatibility**: Maintain compatibility when possible
- **Gradual Rollout**: Consider staged migrations for large datasets
- **Performance Impact**: Monitor migration performance on large datasets
- **User Communication**: Notify users of breaking changes

## Conclusion

This versioning strategy ensures that the LLM Metrics Proxy can evolve while maintaining data integrity and providing clear migration paths. By following these guidelines, we can confidently make improvements while ensuring that existing data remains accurate and accessible.
