# OpenAI LLM Metrics Proxy

A secure reverse proxy that monitors OpenAI-compatible API requests and provides metrics. This system consists of three separate components for security and separation of concerns.

## Architecture

The system is split into three separate services:

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

```bash
# Just the proxy (for production deployment)
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

## Development

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


