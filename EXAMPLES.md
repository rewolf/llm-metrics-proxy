# Deployment Examples

This document provides various examples of how to deploy the LLM Metrics Proxy system.

## Table of Contents

- [Quick Start with Docker Compose](#quick-start-with-docker-compose)
- [Standalone Metrics System with Ollama](#standalone-metrics-system-with-ollama)
- [Individual Service Deployment](#individual-service-deployment)
  - [Just the Proxy](#just-the-proxy)
  - [Just the Metrics API](#just-the-metrics-api)
  - [Just the Frontend](#just-the-frontend)
- [Running Without Docker](#running-without-docker)
  - [Setup Python Environment](#setup-python-environment)
  - [Running the Proxy Service](#running-the-proxy-service)
  - [Running the Metrics Server](#running-the-metrics-server)
  - [Running the Frontend](#running-the-frontend)
  - [Environment Variables](#environment-variables)
- [Integration with Existing Systems](#integration-with-existing-systems)
  - [With vLLM](#with-vllm)
  - [With LocalAI](#with-localai)
- [Production Considerations](#production-considerations)
  - [Security](#security)
  - [Scaling](#scaling)
  - [Monitoring](#monitoring)

## Quick Start with Docker Compose

The simplest way to get started is using the included `docker-compose.yml`:

```bash
docker-compose up -d
```

This will start all services:
- **LLM Metrics Proxy**: http://localhost:8000 (OpenAI API)
- **Metrics API**: http://localhost:8002 (internal)
- **Frontend**: http://localhost:3000 (dashboard)
- **Ollama**: http://localhost:11434 (example backend)

## Standalone Metrics System with Ollama

For a clean deployment with just the metrics system and Ollama, you can use the main `docker-compose.yml` file. The example below shows the same configuration with custom port mapping:

```yaml
version: '3.8'

services:
  # LLM Metrics Proxy - proxies OpenAI API requests and tracks metrics
  llm-metrics-proxy:
    build: .
    container_name: llm-metrics-proxy
    ports:
      - "8001:8000"  # OpenAI API proxy (custom port)
    environment:
      - BACKEND_HOST=ollama
      - BACKEND_PORT=11434
      - PROXY_PORT=8000
      - DB_PATH=./data/metrics.db
    volumes:
      - ./data:/app/data
    depends_on:
      - ollama
    restart: unless-stopped

  # Metrics API Server - exposes metrics data for frontend
  metrics-api:
    build: .
    container_name: metrics-api
    ports:
      - "8002:8002"  # Metrics API
    environment:
      - METRICS_PORT=8002
      - DB_PATH=./data/metrics.db
    volumes:
      - ./data:/app/data
    command: ["python", "-m", "backend.metrics_server"]
    depends_on:
      - llm-metrics-proxy
    restart: unless-stopped

  # React Frontend - displays metrics dashboard
  frontend:
    build: ./frontend
    container_name: metrics-frontend
    ports:
      - "3000:3000"  # Frontend dashboard
    depends_on:
      - metrics-api
    restart: unless-stopped

  # Ollama Server - serves GGUF models with OpenAI-compatible API
  ollama:
    image: ollama/ollama:latest
    container_name: test-ollama
    ports:
      - "11434:11434"  # Ollama API
    volumes:
      - ollama_data:/root/.ollama
    restart: unless-stopped

volumes:
  ollama_data:
```

### Explanation

This example shows a clean deployment with just the essential services:

1. **Ollama**: Serves your AI models with OpenAI-compatible API
2. **LLM Metrics Proxy**: Intercepts requests, tracks metrics, forwards to Ollama
3. **Metrics API**: Provides metrics data to the frontend
4. **Frontend**: Web dashboard displaying the metrics

**Ports**:
- `8001`: OpenAI API proxy (your clients connect here)
- `8002`: Metrics API (internal, for frontend)
- `3000`: Frontend dashboard (internal monitoring)
- `11434`: Ollama API (internal, for proxy)

**Data Flow**:
```
Client → Port 8001 (Proxy) → Ollama → Response
                ↓
            Port 8002 (Metrics API) → Port 3000 (Frontend)
                ↓
            SQLite Database
```

## Individual Service Deployment

### Just the Proxy

**Important**: Build the Docker image first before running individual services.

```bash
# First, build the Docker image
docker build -t llm-metrics-proxy .

# Then run the proxy service
docker run -d \
  --name llm-metrics-proxy \
  -p 8001:8000 \
  -e BACKEND_HOST=your-ollama-host \
  -e BACKEND_PORT=11434 \
  -v /path/to/data:/app/data \
  llm-metrics-proxy:latest
```

### Just the Metrics API

**Important**: Build the Docker image first before running individual services.

```bash
# First, build the Docker image
docker build -t llm-metrics-proxy .

# Then run the metrics API service
docker run -d \
  --name metrics-api \
  -p 8002:8002 \
  -e METRICS_PORT=8002 \
  -e DB_PATH=./data/metrics.db \
  -v /path/to/data:/app/data \
  llm-metrics-proxy:latest \
  python -m backend.metrics_server
```

### Just the Frontend

**Important**: Build the frontend Docker image first before running.

```bash
# First, build the frontend Docker image
docker build -t metrics-frontend ./frontend

# Then run the frontend service
docker run -d \
  --name metrics-frontend \
  -p 3000:3000 \
  -e REACT_APP_METRICS_API_URL=http://your-metrics-api:8002 \
  metrics-frontend:latest
```

## Running Without Docker

You can run the LLM Metrics Proxy system directly with Python without using Docker containers. This approach is useful for development, testing, or when you prefer to manage dependencies directly.

### Setup Python Environment

First, ensure you have Python 3.8+ installed, then set up a virtual environment:

```bash
# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Running the Proxy Service

The proxy service handles OpenAI API requests and forwards them to your backend LLM service:

```bash
# Activate virtual environment first
source venv/bin/activate

# Run the proxy service
python -m backend.metrics_proxy
```

**Default Configuration:**
- **Port**: 8000 (OpenAI API proxy)
- **Backend**: localhost:11434 (Ollama default)
- **Database**: `./data/metrics.db`

### Running the Metrics Server

The metrics server provides the HTTP API for accessing metrics data:

```bash
# Activate virtual environment first
source venv/bin/activate

# Run the metrics server
python -m backend.metrics_server
```

**Default Configuration:**
- **Port**: 8002 (Metrics API)
- **Database**: `./data/metrics.db`

### Running the Frontend

The React frontend provides a web dashboard for monitoring metrics:

```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start the development server
npm start
```

**Default Configuration:**
- **Port**: 3000 (Frontend dashboard)
- **Metrics API**: http://localhost:8002

### Environment Variables

You can customize the configuration using environment variables:

```bash
# Proxy Service Configuration
export BACKEND_HOST=localhost         # Backend LLM service host (eg. Ollama)
export BACKEND_PORT=11434             # Backend LLM service port
export PROXY_PORT=8001                # Port to have this OpenAI API proxy listen on
export DB_PATH=./data/metrics.db      # Database file path (where recordings should get stored)
export LOG_LEVEL=INFO                 # Logging level (DEBUG, INFO, WARNING, ERROR)

# Metrics Server Configuration
export METRICS_PORT=8002              # Port for metrics API
export DB_PATH=./data/metrics.db      # Database file path (from which metrics will be generated)
export LOG_LEVEL=INFO                 # Logging level

# Frontend Configuration
export REACT_APP_METRICS_API_URL=http://localhost:8002  # Metrics API URL
```

**Example with custom configuration:**
```bash
# Set environment variables
export BACKEND_HOST=192.168.1.100
export BACKEND_PORT=8000
export PROXY_PORT=8001
export DB_PATH=/var/lib/llm-metrics/metrics.db

# Run proxy service
python -m backend.metrics_proxy
```

**Complete startup script example:**
```bash
#!/bin/bash
# start-services.sh

# Activate virtual environment
source venv/bin/activate

# Set configuration
export BACKEND_HOST=localhost
export BACKEND_PORT=11434
export PROXY_PORT=8000
export METRICS_PORT=8002
export DB_PATH=./data/metrics.db

# Start proxy service in background
python -m backend.metrics_proxy &
PROXY_PID=$!

# Start metrics server in background
python -m backend.metrics_server &
METRICS_PID=$!

# Start frontend (in another terminal or background)
cd frontend && npm start &
FRONTEND_PID=$!

echo "Services started:"
echo "  Proxy: PID $PROXY_PID (Port $PROXY_PORT)"
echo "  Metrics: PID $METRICS_PID (Port $METRICS_PORT)"
echo "  Frontend: PID $FRONTEND_PID (Port 3000)"

# Wait for services
wait
```

## Integration with Existing Systems

### With vLLM

Replace the Ollama service with vLLM:

```yaml
vllm:
  image: vllm/vllm-openai:latest
  container_name: vllm
  ports:
    - "8000:8000"
  command: >
    --model /models/your-model
    --host 0.0.0.0
    --port 8000
```

Then update the proxy environment:
```yaml
llm-metrics-proxy:
  environment:
    - BACKEND_HOST=vllm
    - BACKEND_PORT=8000
```

### With LocalAI

```yaml
localai:
  image: localai/localai:latest
  container_name: localai
  ports:
    - "8080:8080"
  volumes:
    - ./models:/models
```

Update proxy environment:
```yaml
llm-metrics-proxy:
  environment:
    - BACKEND_HOST=localai
    - BACKEND_PORT=8080
```

## Production Considerations

### Security
- Only expose the proxy port (8001) publicly
- Keep metrics API (8002) and frontend (3000) internal
- Use reverse proxy (nginx/traefik) for SSL termination
- Consider authentication for the frontend


### Monitoring
- Add health checks to all services
- Use Prometheus + Grafana for advanced metrics
- Set up log aggregation
- Monitor database size and performance
