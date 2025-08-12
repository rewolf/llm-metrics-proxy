# Architecture Overview

This document describes the system architecture, design principles, and component relationships of the OpenAI LLM Metrics Proxy.

## 🏗️ System Architecture

The system is designed with **separation of concerns** and **security** as primary principles, split into three independent services:

```
┌─────────────────┐    ┌──────────────────────┐    ┌─────────────────┐
│   Client App   │───▶│  Proxy Server       │───▶│  LLM Backend   │
│                 │    │  (Port 8001)        │    │  (Ollama/vLLM)  │
└─────────────────┘    └──────────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────────┐
                       │  Metrics API        │
                       │  (Port 8002)        │
                       └──────────────────────┘
                                │
                                ▼
                       ┌──────────────────────┐
                       │  React Frontend     │
                       │  (Port 3000)        │
                       └──────────────────────┘
                                │
                                ▼
                       ┌──────────────────────┐
                       │  SQLite Database    │
                       │  (Internal)         │
                       └──────────────────────┘
```

## 🔒 Security Model

### Public-Facing Components
- **Proxy Server (Port 8001)**: Safe for internet exposure
  - Only exposes OpenAI API endpoints (`/v1/chat/completions`)
  - No metrics or internal data exposed
  - Can be placed in DMZ or public networks

### Internal Components
- **Metrics API (Port 8002)**: Internal service only
  - Exposes metrics data for frontend consumption
  - Should not be exposed to public internet
  - CORS enabled for frontend communication

- **Frontend (Port 3000)**: Internal dashboard
  - Web interface for viewing metrics
  - Should not be exposed to public internet
  - Consumes internal metrics API

- **Database**: Internal storage only
  - SQLite file with no network exposure
  - Stored in container volumes

## 📊 Data Flow

### 1. Request Processing
```
Client Request → Proxy Server → Backend LLM → Response → Client
                ↓
            Metrics Collection
                ↓
            Database Storage
```

### 2. Metrics Retrieval
```
Frontend → Metrics API → Database → JSON Response → Frontend Display
```

## 🗄️ Database Schema

The system uses a single SQLite table `completion_requests` with comprehensive metrics:

- **Request Metadata**: Timestamp, model, user, streaming status
- **Performance Metrics**: Response time, tokens per second
- **Usage Statistics**: Prompt/completion/total tokens
- **Error Handling**: Error types and messages
- **Streaming Support**: Time to first/last token

## 🔄 Component Responsibilities

### Proxy Server (`metrics_proxy.py`)
- **Primary Function**: Reverse proxy for OpenAI API requests
- **Metrics Collection**: Captures request/response data
- **Database Operations**: Stores metrics in SQLite
- **Error Handling**: Graceful fallback and logging
- **Streaming Support**: Handles both streaming and non-streaming requests

### Metrics API (`metrics_server.py`)
- **Data Exposure**: RESTful API for metrics retrieval
- **Aggregation**: Calculates summary statistics
- **CORS Support**: Enables frontend communication
- **Performance**: Efficient database queries

### Frontend (`frontend/src/`)
- **Data Visualization**: React-based dashboard
- **Real-time Updates**: Auto-refresh every 30 seconds
- **Responsive Design**: Modern, mobile-friendly interface
- **Error Handling**: User-friendly error messages

## 🐳 Deployment Architecture

### Docker Compose Setup
- **Service Isolation**: Each component runs in separate containers
- **Volume Persistence**: Database and configuration persistence
- **Network Isolation**: Internal communication between services
- **Easy Scaling**: Individual services can be scaled independently

### Production Considerations
- **Load Balancing**: Proxy server can be load balanced
- **Database Scaling**: SQLite can be replaced with PostgreSQL/MySQL
- **Monitoring**: Integration with external monitoring systems
- **Backup**: Automated database backup strategies

## 🔧 Configuration Management

### Environment Variables
- **Backend Configuration**: Host, port, and connection settings
- **Port Configuration**: Service port assignments
- **Database Path**: Storage location configuration
- **Security Settings**: CORS and access control

### Configuration Files
- **Docker Compose**: Service definitions and networking
- **Dockerfiles**: Container build instructions
- **Requirements**: Python dependency management
- **Package.json**: Frontend dependency management

## 🚀 Extension Points

### Custom Metrics
- **Database Schema**: Easy to add new metric fields
- **API Endpoints**: Extensible metrics API
- **Frontend Widgets**: Modular dashboard components

### Backend Integration
- **OpenAI Compatibility**: Works with any compliant service
- **Custom Protocols**: Extensible for non-standard backends
- **Authentication**: Support for various auth mechanisms

### Monitoring Integration
- **Prometheus**: Metrics export for monitoring systems
- **Grafana**: Dashboard integration capabilities
- **Alerting**: Integration with notification systems
