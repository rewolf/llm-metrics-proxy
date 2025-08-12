# OpenAI LLM Metrics Proxy

A secure, production-ready reverse proxy that monitors OpenAI-compatible API requests and provides comprehensive metrics and analytics. This system enables you to track usage, monitor performance, and gain insights into your LLM API deployments while maintaining security and separation of concerns.

## 🎯 Purpose

The OpenAI LLM Metrics Proxy solves a critical need for organizations deploying LLM services: **visibility and monitoring**. Whether you're running Ollama, vLLM, LocalAI, or any other OpenAI-compatible backend, this proxy gives you enterprise-grade monitoring capabilities without compromising security.

## ✨ Key Features

- **🔒 Secure by Design**: Proxy server can be safely exposed to the internet while keeping metrics internal
- **📊 Real-time Metrics**: Track request success rates, response times, and usage patterns
- **🌐 Universal Compatibility**: Works with any OpenAI-spec compliant service (Ollama, vLLM, LocalAI, etc.)
- **📱 Beautiful Dashboard**: Modern React frontend with theming system for visualizing metrics and trends
- **🐳 Docker Ready**: Simple deployment with Docker Compose
- **💾 Lightweight Storage**: SQLite-based metrics storage with minimal overhead
- **🔌 API-First**: RESTful metrics API for integration with existing monitoring systems
- **⚡ High Performance**: Minimal latency overhead for your LLM requests

## 📊 Metrics Coverage

### Non-Streaming Requests
- **Complete Metrics**: Token usage, response times, success rates
- **Token Analysis**: Prompt tokens, completion tokens, total tokens
- **Performance**: Tokens per second, response time analysis

### Streaming Requests  
- **Timing Metrics**: Time to first token, total response time
- **Success Tracking**: Request success/failure rates
- **Token Usage**: Automatically enabled via `include_usage` option when available
- **Smart Parsing**: Captures usage statistics from final streaming chunk

## 🚀 Quick Start

Get up and running in minutes:

```bash
# Clone and start all services
git clone <repository>
cd openai-llm-metrics-proxy
docker-compose up -d

# Access your services:
# OpenAI API: http://localhost:8001
# Dashboard: http://localhost:3000
# Metrics API: http://localhost:8002
```

## 📚 Documentation

- **[Technical Documentation](docs/technical/)** - Architecture, API reference, and deployment guides
- **[AI Context Documentation](docs/ai-context/)** - For AI assistants and developers
- **[Examples](EXAMPLES.md)** - Deployment examples and configurations

### For Developers
- **[Frontend Architecture](docs/technical/frontend-architecture.md)** - React, SCSS, and theming system details
- **[API Reference](docs/technical/api.md)** - Complete API documentation
- **[Development Guide](docs/technical/development.md)** - Local setup and development workflow

## 🔄 Streaming with Usage

The proxy can capture token usage from streaming responses when clients enable it:

### Client-Controlled Usage
- **Respects Client Choice**: Only captures usage when client sets `include_usage: true`
- **Smart Parsing**: Captures usage statistics from the final streaming chunk when available
- **Fallback Handling**: Gracefully handles cases where usage data isn't available
- **No Request Modification**: Never modifies client requests

## 📊 API Design Principles

### Raw Data Focus
- **No Calculated Fields**: API provides raw counts and measurements
- **Frontend Calculations**: Percentages and ratios calculated on the client side
- **Efficient Data Transfer**: Only essential data sent over the network
- **Flexible Display**: Frontend can format and calculate metrics as needed

### Example Request (with usage enabled)
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

### Example Request (without usage)
```json
{
  "model": "llama3.1:8b",
  "messages": [{"role": "user", "content": "Hello"}],
  "stream": true
}
```

### Usage Chunk Format
The final chunk before `data: [DONE]` contains:
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

## 🏗️ Architecture

The system is split into three separate services for security and separation of concerns:

```
Client → OpenAI LLM Metrics Proxy (port 8001) → Any OpenAI-Spec Backend
                ↓
            Metrics API (port 8002)
                ↓
            React Frontend (port 3000)
                ↓
            SQLite Database
```

### Components

1. **OpenAI LLM Metrics Proxy** (port 8001)
   - Proxies OpenAI API requests to backend
   - Tracks metrics in database
   - **Public-facing** - can be exposed to the internet safely
   - Only exposes OpenAI API endpoints

2. **Metrics API Server** (port 8002)
   - Exposes metrics data via REST API
   - Internal service - not meant for public exposure
   - Provides data for the frontend

3. **React Frontend** (port 3000)
   - Web dashboard displaying metrics
   - Internal service - not meant for public exposure
   - Simple text-based interface
   - Consumes the Metrics API above

## Features

- **Request Monitoring**: Tracks `/v1/chat/completions` POST requests following the [OpenAI API specification](https://platform.openai.com/docs/api-reference/chat)
- **Success Rate Tracking**: Monitors successful vs failed requests
- **Separated Concerns**: Proxy, metrics, and frontend run independently
- **Security**: Proxy server can be safely exposed publicly
- **SQLite Storage**: Lightweight metrics storage
- **Docker Support**: Easy deployment with Docker
- **Generic Backend Support**: Works with any OpenAI-spec compliant service (Ollama, vLLM, LocalAI, etc.)

## Configuration

### Proxy Server
- `BACKEND_HOST`: Hostname or IP of the LLM backend server (default: `ollama`)
- `BACKEND_PORT`: Port of the LLM backend server (default: `11434`)
- `PROXY_PORT`: Port for the proxy to listen on (default: `8000`)
- `DB_PATH`: Path to SQLite database file (default: `./data/metrics.db`)

### Metrics API Server
- `METRICS_PORT`: Port for metrics API (default: `8002`)
- `DB_PATH`: Path to SQLite database file (default: `./data/metrics.db`)

### Frontend
- Runs on port 3000
- Connects to metrics API on port 8002

## Running with Docker

### Complete Setup (Recommended)

```bash
docker-compose up -d
```

This will start all three services:
- **Proxy**: http://localhost:8001 (OpenAI API)
- **Metrics API**: http://localhost:8002 (internal)
- **Frontend**: http://localhost:3000 (dashboard)

For more deployment examples and configurations, see [EXAMPLES.md](EXAMPLES.md).
### Individual Services

**Note**: The examples below use `docker run` commands, which require manual building first. For automatic building, use Docker Compose instead.

```bash
# First, build the Docker image (only needed for docker run)
docker build -t openai-llm-metrics-proxy .

# Then run individual services
docker run -d \
  --name openai-llm-metrics-proxy \
  -p 8001:8000 \
  -e BACKEND_HOST=your-llm-backend-host \
  -e BACKEND_PORT=8000 \
  openai-llm-metrics-proxy:latest
```

## API Endpoints

### Proxy Server (port 8001)
- `POST /v1/chat/completions` - Proxies requests to backend and tracks metrics
- `GET /health` - Health check

### Metrics API (port 8002)
- `GET /metrics` - Returns current metrics as JSON
- `GET /health` - Health check

### Frontend (port 3000)
- `GET /` - Web dashboard showing metrics

## Security

- **Proxy Server**: Safe for public exposure, only OpenAI API endpoints
- **Metrics API**: Internal service, should not be exposed publicly
- **Frontend**: Internal service, should not be exposed publicly
- **Database**: Internal storage, not exposed via network

## Troubleshooting

### Docker Image Not Found

If you get an error like "Unable to find image" or "pull access denied":

**For Docker Compose users**: This shouldn't happen - Docker Compose builds automatically. Check your docker-compose.yml file.

**For docker run users**: You need to build the Docker image first:

```bash
# Build the main image
docker build -t openai-llm-metrics-proxy .

# Build the frontend image
docker build -t metrics-frontend ./frontend
```

### Common Issues

- **Port already in use**: Make sure ports 8000, 8002, and 3000 are available
- **Database permissions**: Ensure the `./data` directory is writable
- **Backend connection**: Verify your LLM backend is running and accessible

## Development

For detailed development guides, see the **[Technical Documentation](docs/technical/)**.

### Frontend Development

```bash
cd frontend
npm install
npm start
```

### Backend Development

```bash
# Run proxy server
python main.py

# Run metrics API server
python metrics_api.py
```

### Building Docker Images

```bash
# Build all services
docker-compose build

# Build individual services
docker build -t openai-llm-metrics-proxy .
docker build -t metrics-frontend ./frontend
```

## Integration

This proxy is designed to be used alongside any OpenAI-spec compliant LLM service in containerized environments. The proxy server can be safely exposed to the internet while keeping metrics and dashboard internal.


