# API Reference

This document describes the API endpoints available in the LLM Metrics Proxy system.

## Metrics API

The Metrics API runs on port 8002 and provides access to system metrics and completion request data.

### Base URL
```
http://localhost:8002
```

### Endpoints

#### GET /metrics
Returns aggregated metrics for the system with optional date filtering.

**Query Parameters:**
- `start` (optional): Start date in ISO format (e.g., `2024-01-01T00:00:00`)
- `end` (optional): End date in ISO format (e.g., `2024-01-02T00:00:00`)

**Response:**
```json
{
  "total_requests": 150,
  "successful_requests": 145,
  "failed_requests": 5,
  "recent_requests_24h": 25,
  "streaming_requests": 80,
  "non_streaming_requests": 70,
  "total_tokens_used": 15000,
  "avg_tokens_per_request": 100.0,
  "avg_response_time_ms": 1250.5,
  "avg_tokens_per_second": 2.5,
  "top_models": [
    {"model": "gpt-4", "count": 100},
    {"model": "gpt-3.5-turbo", "count": 50}
  ],
  "top_origins": [
    {"origin": "api.openai.com", "count": 120},
    {"origin": "custom-client", "count": 30}
  ],
  "finish_reasons": [
    {"reason": "stop", "count": 140},
    {"reason": "length", "count": 10}
  ],
  "error_types": [
    {"type": "rate_limit", "count": 3},
    {"type": "invalid_request", "count": 2}
  ],
  "timestamp": "2024-01-15T10:30:00"
}
```

#### GET /completion_requests
Returns individual completion request data with optional date filtering.

**Query Parameters:**
- `start` (optional): Start date in ISO format (e.g., `2024-01-01T00:00:00`)
- `end` (optional): End date in ISO format (e.g., `2024-01-02T00:00:00`)

**Response:**
```json
[
  {
    "timestamp": "2024-01-15T10:30:00",
    "time_to_first_token_ms": 150,
    "time_to_last_token_ms": 2500,
    "is_streaming": true,
    "success": true,
    "message_count": 5,
    "prompt_tokens": 100,
    "tokens": {
      "total": 150,
      "prompt": 100,
      "completion": 50
    }
  }
]
```

#### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00"
}
```

## Date Filtering

Both `/metrics` and `/completion_requests` endpoints support date filtering:

- **No parameters**: Returns data for all time
- **Start only**: Returns data from start date to now
- **End only**: Returns data from beginning to end date
- **Both**: Returns data between start and end dates

**Date Format:** ISO 8601 format (e.g., `2024-01-01T00:00:00`)
**Timezone:** All dates should be in UTC to avoid timezone issues between frontend and backend

**Examples:**
```
/metrics?start=2024-01-01T00:00:00                    # Last 24 hours
/metrics?start=2024-01-01T00:00:00&end=2024-01-02T00:00:00  # Specific 24-hour period
/completion_requests?start=2024-01-15T00:00:00         # Today's requests
```

## OpenAI Proxy API

The main proxy runs on port 8001 and forwards requests to backend LLM services.

### Base URL
```
http://localhost:8001
```

### Endpoints
All OpenAI API endpoints are supported and forwarded to the configured backend service.

**Example:**
```bash
curl -X POST http://localhost:8001/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

## CORS Support

The Metrics API includes CORS middleware to allow frontend applications to access the endpoints from different origins.

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `400`: Bad Request (invalid parameters)
- `500`: Internal Server Error

Error responses include a descriptive message in the response body.
