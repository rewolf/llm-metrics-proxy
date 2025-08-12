# Technical Documentation

Welcome to the technical documentation for the OpenAI LLM Metrics Proxy project. This documentation is designed for developers and users who want to understand, deploy, and extend the system.

## 🚀 Quick Start

1. **Clone and Deploy**: `docker-compose up -d`
2. **Access Services**:
   - Proxy: http://localhost:8001
   - Dashboard: http://localhost:3000
   - Metrics API: http://localhost:8002

## 📚 Documentation Sections

### [Architecture Overview](./architecture.md)
- System design and component relationships
- Security model and separation of concerns
- Data flow and request handling

### [API Reference](./api.md)
- OpenAI API compatibility
- Metrics API endpoints
- Request/response formats

### [Deployment Guide](./deployment.md)
- Docker deployment options
- Environment configuration
- Production considerations

### [Development Guide](./development.md)
- Local development setup
- Code structure and patterns
- Testing and debugging

### [Configuration](./configuration.md)
- Environment variables
- Database configuration
- Backend service setup

## 🔧 Key Concepts

- **Reverse Proxy**: Securely forwards OpenAI API requests to backend LLM services
- **Metrics Collection**: Tracks usage, performance, and success rates
- **Separation of Concerns**: Three independent services for security
- **Universal Compatibility**: Works with any OpenAI-spec compliant backend

## 📖 Additional Resources

- [Main Project README](../../README.md) - Project overview and features
- [EXAMPLES.md](../../EXAMPLES.md) - Deployment examples and configurations
