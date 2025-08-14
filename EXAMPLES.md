# Deployment Examples

This document provides various examples of how to deploy the LLM Metrics Proxy system.

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

For a clean deployment with just the metrics system and Ollama, use the example below:

```yaml
version: '3.8'

services:
  # LLM Metrics Proxy - proxies OpenAI API requests and tracks metrics
  ollama-metrics-proxy:
    build: .
    container_name: ollama-metrics-proxy
    ports:
      - "8001:8000"  # OpenAI API proxy
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
  ollama-metrics-api:
    build: .
    container_name: ollama-metrics-api
    ports:
      - "8002:8002"  # Metrics API
    environment:
      - METRICS_PORT=8002
      - DB_PATH=./data/metrics.db
    volumes:
      - ./data:/app/data
    command: ["python", "-m", "backend.metrics_server"]
    depends_on:
      - ollama-metrics-proxy
    restart: unless-stopped

  # React Frontend - displays metrics dashboard
  ollama-metrics-frontend:
    build: ./frontend
    container_name: ollama-metrics-frontend
    ports:
      - "3000:3000"  # Frontend dashboard
    depends_on:
      - ollama-metrics-api
    restart: unless-stopped

  # Ollama Server - serves GGUF models with OpenAI-compatible API
  ollama:
    image: ollama/ollama:latest
    container_name: ollama
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
2. **Ollama Metrics Proxy**: Intercepts requests, tracks metrics, forwards to Ollama
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
  --name ollama-metrics-proxy \
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
  --name ollama-metrics-api \
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
  --name ollama-metrics-frontend \
  -p 3000:3000 \
  -e REACT_APP_METRICS_API_URL=http://your-metrics-api:8002 \
  metrics-frontend:latest
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
ollama-metrics-proxy:
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
ollama-metrics-proxy:
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

### Scaling
- Use external database (PostgreSQL/MySQL) instead of SQLite
- Run metrics API and frontend on separate hosts
- Use load balancer for multiple proxy instances
- Consider Redis for caching

### Monitoring
- Add health checks to all services
- Use Prometheus + Grafana for advanced metrics
- Set up log aggregation
- Monitor database size and performance
