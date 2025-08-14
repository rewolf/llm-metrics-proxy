# Changelog

All notable changes to the LLM Metrics Proxy project will be documented in this file.

## [Unreleased] - 2024-01-15

### Added
- **Timeframe Selector**: New UI component allowing users to filter metrics by predefined time periods
  - Options: 1h, 6h, 12h, 1d, 1w, 1mo, All
  - Integrated with metrics API for date filtering
  - Multi-language support for all timeframe labels
- **Date Filtering API**: Enhanced metrics endpoints with optional start/end date parameters
  - `/metrics` endpoint now accepts `start` and `end` query parameters
  - Date format: ISO 8601 (e.g., `2024-01-01T00:00:00`)
  - Backward compatible - no parameters returns all-time data
- **Completion Requests Endpoint**: New `/completion_requests` API endpoint
  - Returns individual completion request data with detailed metrics
  - Includes timestamp, performance metrics, token usage, and success status
  - Supports date filtering via start/end parameters
  - Returns data in descending timestamp order
- **Enhanced Metrics**: Improved metrics calculation with date filtering support
  - All metrics now respect date range parameters
  - Recent requests calculation adapts based on date filters
  - Model usage, origin usage, and error analysis support time-based filtering

### Changed
- **Database Schema**: Removed unused "user" field from completion_requests table
  - Updated database models and schema definitions
  - Added migration to safely remove the column from existing databases
  - No impact on existing functionality
- **Frontend State Management**: Enhanced React state management for timeframe selection
  - Added timeframe state to main App component
  - Integrated timeframe changes with metrics fetching
  - Auto-refresh maintains selected timeframe
- **API Documentation**: Comprehensive API reference documentation
  - New API reference document with examples
  - Updated endpoint descriptions with date filtering details
  - Added completion requests endpoint documentation

### Technical Improvements
- **Backend Migrations**: Enhanced migration system for database schema changes
  - Safe column removal with data preservation
  - Automatic migration execution on server startup
  - Better error handling and logging
- **Type Safety**: Enhanced TypeScript interfaces and types
  - New `CompletionRequestData` interface for detailed request data
  - `Timeframe` interface for timeframe selection
  - Updated translation interfaces with new keys
- **Internationalization**: Extended multi-language support
  - Added timeframe selector translations for all supported languages
  - Consistent terminology across language files
  - New translation keys for enhanced functionality

### Documentation
- **API Reference**: Complete API documentation with examples
- **Updated README**: Enhanced project description with new features
- **AI Context Updates**: Updated AI assistant documentation
- **Technical Guides**: Enhanced technical documentation

### Files Modified
- `backend/api/metrics.py` - Added date filtering and completion requests endpoint
- `backend/database/models.py` - Removed user field from schema
- `backend/database/migrations.py` - Added migration for user field removal
- `backend/metrics_server.py` - Added startup migrations
- `shared/types.py` - Added CompletionRequestData type
- `frontend/src/App.tsx` - Integrated timeframe selector and date filtering
- `frontend/src/components/TimeframeSelector.tsx` - New timeframe selection component
- `frontend/src/types.ts` - Added new interfaces and types
- `frontend/src/styles/_timeframe-selector.scss` - New component styles
- `frontend/src/core/i18n/*.ts` - Added timeframe translations for all languages
- `docs/technical/api.md` - New API reference documentation
- `README.md` - Updated feature descriptions
- `docs/ai-context/README.md` - Updated AI context documentation

## [Previous Versions]

### [1.0.0] - Initial Release
- Basic OpenAI API proxy functionality
- Metrics collection and storage
- React frontend dashboard
- Docker deployment support
- Multi-language support
- Theme system
- Tabbed interface for metrics organization
