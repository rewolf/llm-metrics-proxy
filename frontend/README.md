# OpenAI LLM Metrics Frontend

A simple React-based dashboard for displaying metrics from the OpenAI LLM Metrics Proxy.

## Features

- **Real-time Metrics**: Displays current request counts and success rates
- **Auto-refresh**: Updates every 30 seconds automatically
- **Simple Interface**: Clean, text-based design
- **Responsive**: Works on desktop and mobile devices

## Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will open at http://localhost:3000

### Building for Production

```bash
# Build the app
npm run build

# The build folder will contain the production-ready files
```

## Architecture

- **Frontend**: React app running on port 3000
- **Backend**: Metrics API server on port 8002
- **Proxy**: OpenAI API proxy on port 8001
- **Database**: SQLite database shared between proxy and metrics API

## Configuration

The frontend is configured to proxy API requests to the metrics API server. This is set in `package.json`:

```json
{
  "proxy": "http://localhost:8002"
}
```

## Docker

```bash
# Build the frontend image
docker build -t metrics-frontend .

# Run the container
docker run -p 3000:3000 metrics-frontend
```
