# API Specification

This document provides a comprehensive specification for both APIs in the LLM Metrics Proxy system.

## Table of Contents

- [Overview](#overview)
- [Metrics Server APIs](#metrics-server-apis)
  - [Authentication (none)](#authentication)
  - [Endpoints](#endpoints)
    - [GET /metrics](#get-metrics)
    - [GET /completion_requests](#get-completion_requests)
    - [GET /health](#get-health)
  - [Date Filtering](#date-filtering)
- [OpenAI Proxy API](#openai-proxy-api)
  - [Authentication](#authentication-1)
  - [Supported Endpoints](#supported-endpoints)
    - [POST /v1/chat/completions](#post-v1chatcompletions)
  - [Error Responses](#error-responses)
- [CORS Support](#cors-support)
- [Rate Limiting](#rate-limiting)
- [Error Handling](#error-handling)
- [Data Flow](#data-flow)
- [Monitoring and Observability](#monitoring-and-observability)

## Overview

The system has two components that serve APIs

1. **Metrics Server** (Default port 8002) - Analytics and monitoring endpoints
2. **OpenAI Proxy API** (Default port 8001) - OpenAI-compatible request forwarding (the main proxy API)

## Metrics Server APIs

**Base URL:** `http://localhost:8002`

The Metrics API provides comprehensive analytics and monitoring data for LLM requests processed through the proxy.

### Authentication
Currently, no authentication is required for the Metrics API endpoints.

### Endpoints

#### GET /metrics

Returns aggregated metrics for the system with optional date filtering.

**Query Parameters:**
- `start` (optional): Start date in ISO 8601 format (e.g., `2024-01-01T00:00:00`)
- `end` (optional): End date in ISO 8601 format (e.g., `2024-01-02T00:00:00`)

**Response Schema:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "requests": {
    "total": {
      "total": 150,
      "successful": 145,
      "failed": 5,
      "avg_response_time_ms": 1250.5
    },
    "streamed": {
      "total": 80,
      "successful": 78,
      "failed": 2,
      "tokens": {
        "reported_count": 75,
        "total": 8000,
        "prompt_total": 5000,
        "completion_total": 3000,
        "avg_tokens_per_second": 2.5
      },
      "error_types": {
        "rate_limit": 1,
        "invalid_request": 1
      },
      "avg_response_time_ms": 1500.0,
      "avg_time_to_first_token_ms": 200.0,
      "avg_time_to_last_token_ms": 1500.0,
      "avg_completion_duration_ms": 1300.0
    },
    "non_streamed": {
      "total": 70,
      "successful": 67,
      "failed": 3,
      "tokens": {
        "reported_count": 67,
        "total": 7000,
        "prompt_total": 4500,
        "completion_total": 2500,
        "avg_tokens_per_second": 3.2
      },
      "error_types": {
        "rate_limit": 2,
        "invalid_request": 1
      },
      "avg_time_to_first_token_ms": 150.0,
      "avg_time_to_last_token_ms": 1000.0,
      "avg_completion_duration_ms": 850.0
    }
  },
  "model_distribution": {
    "llama3.1:8b": 100,
    "gpt-4": 30,
    "gpt-3.5-turbo": 20
  },
  "origin_distribution": {
    "api.openai.com": 120,
    "custom-client": 30
  }
}
```

**Response Fields:**
- `timestamp`: ISO 8601 timestamp of when metrics were generated
- `requests.total`: Overall request statistics
- `requests.streamed`: Streaming request statistics
- `requests.non_streamed`: Non-streaming request statistics
- `model_distribution`: Count of requests per model
- `origin_distribution`: Count of requests per origin

#### GET /completion_requests

Returns individual completion request data with optional date filtering.

**Query Parameters:**
- `start` (optional): Start date in ISO 8601 format
- `end` (optional): End date in ISO 8601 format

**Response Schema:**
```json
[
  {
    "timestamp": "2024-01-15T10:30:00Z",
    "is_streaming": true,
    "success": true,
    "error_type": null,
    "message_count": 5,
    "timing": {
      "time_to_first_token_ms": 150,
      "time_to_last_token_ms": 2500,
      "response_time_ms": 2500
    },
    "tokens": {
      "total": 150,
      "prompt": 100,
      "completion": 50
    },
    "model": "llama3.1:8b",
    "origin": "custom-client"
  }
]
```

**Response Fields:**
- `timestamp`: ISO 8601 timestamp of the request
- `is_streaming`: Whether the request was streaming
- `success`: Whether the request succeeded
- `error_type`: Type of error if request failed
- `message_count`: Number of messages in the conversation
- `timing`: Performance timing metrics
- `tokens`: Token usage statistics
- `model`: Model used for the request
- `origin`: Origin/source of the request

#### GET /health

Health check endpoint for monitoring system status.

**Response Schema:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Date Filtering

All endpoints support optional date filtering using ISO 8601 format:

- **No parameters**: Returns data for all time
- **Start only**: Returns data from start date to now
- **End only**: Returns data from beginning to end date
- **Both**: Returns data between start and end dates

**Examples:**
```
/metrics?start=2024-01-01T00:00:00Z
/metrics?start=2024-01-01T00:00:00Z&end=2024-01-02T00:00:00Z
/completion_requests?start=2024-01-15T00:00:00Z
```

**Note:** All dates should be in UTC to avoid timezone issues.

## OpenAI Proxy API

**Base URL:** `http://localhost:8001`

The OpenAI Proxy API forwards requests to backend LLM services while recording metrics. It implements the [OpenAI API specification](https://platform.openai.com/docs/api-reference/chat).

### Authentication
Uses the same authentication mechanism as your backend LLM service (typically Bearer tokens). Only if enabled.

### Supported Endpoints

#### POST /v1/chat/completions

Creates a chat completion with the specified model.

**Request Schema:**
```json
{
  "model": "llama3.1:8b",
  "messages": [
    {
      "role": "user",
      "content": "Hello, how are you?"
    }
  ],
  "stream": false,
  "max_tokens": 1000,
  "temperature": 0.7,
  "top_p": 1.0,
  "n": 1,
  "stop": null,
  "presence_penalty": 0.0,
  "frequency_penalty": 0.0,
  "logit_bias": {},
  "user": "user123"
}
```

**Request Fields:**
- `model` (required): The model to use for completion
- `messages` (required): Array of message objects
- `stream` (optional): Whether to stream the response
- `max_tokens` (optional): Maximum tokens to generate
- `temperature` (optional): Sampling temperature (0-2)
- `top_p` (optional): Nucleus sampling parameter
- `n` (optional): Number of completions to generate
- `stop` (optional): Stop sequences
- `presence_penalty` (optional): Presence penalty (-2.0 to 2.0)
- `frequency_penalty` (optional): Frequency penalty (-2.0 to 2.0)
- `logit_bias` (optional): Logit bias for specific tokens
- `user` (optional): User identifier

**Non-Streaming Response Schema:**
```json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "llama3.1:8b",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! I'm doing well, thank you for asking. How are you?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 17,
    "completion_tokens": 10,
    "total_tokens": 27
  }
}
```

**Streaming Response Schema:**
When `stream: true`, responses are sent as Server-Sent Events (SSE):

```
data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1677652288,"model":"llama3.1:8b","choices":[{"index":0,"delta":{"role":"assistant","content":"Hello"},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1677652288,"model":"llama3.1:8b","choices":[{"index":0,"delta":{"content":"! I'm doing well"},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1677652288,"model":"llama3.1:8b","choices":[{"index":0,"delta":{"content":"."},"finish_reason":"stop"}]}

data: [DONE]
```

**Streaming with Usage:**
To capture token usage in streaming responses, include `stream_options`:

```json
{
  "model": "llama3.1:8b",
  "messages": [{"role": "user", "content": "Hello"}],
  "stream": true,
  "stream_options": {
    "include_usage": true
  }
}
```

The final chunk before `data: [DONE]` will contain usage statistics:

```json
{
  "choices": [],
  "usage": {
    "prompt_tokens": 17,
    "completion_tokens": 10,
    "total_tokens": 27
  }
}
```

### Error Responses

**Rate Limit Error:**
```json
{
  "error": {
    "message": "Rate limit exceeded",
    "type": "rate_limit",
    "code": "rate_limit_exceeded"
  }
}
```

**Invalid Request Error:**
```json
{
  "error": {
    "message": "Invalid request",
    "type": "invalid_request_error",
    "code": "invalid_request"
  }
}
```

**Model Not Found Error:**
```json
{
  "error": {
    "message": "Model not found",
    "type": "invalid_request_error",
    "code": "model_not_found"
  }
}
```

## CORS Support

The Metrics API includes CORS middleware to allow frontend applications to access endpoints from different origins.

## Rate Limiting

Currently, no rate limiting is implemented on the proxy endpoints. Rate limiting should be handled by your backend LLM service.

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `400`: Bad Request (invalid parameters)
- `401`: Unauthorized (authentication required)
- `404`: Not Found
- `429`: Too Many Requests (rate limited)
- `500`: Internal Server Error
- `502`: Bad Gateway (backend service error)
- `503`: Service Unavailable (backend service unavailable)

Error responses include descriptive messages and error codes in the response body.

## Data Flow

1. **Request Received**: Client sends request to proxy
2. **Metrics Extraction**: Proxy extracts request metadata
3. **Backend Forwarding**: Request forwarded to LLM service
4. **Response Processing**: Response processed and metrics recorded
5. **Client Response**: Response sent back to client
6. **Metrics Storage**: Metrics stored in database for analytics

## Monitoring and Observability

The system provides comprehensive monitoring through:
- Request/response metrics
- Performance timing data
- Token usage statistics
- Error tracking and classification
- Model and origin distribution analysis
- Real-time health checks

All metrics are stored in SQLite and accessible through the Metrics API endpoints.
