# LLM Metrics Frontend

A React TypeScript frontend for displaying metrics from the LLM Metrics Proxy.

## Features

- **TypeScript**: Full type safety with interfaces for all metrics data
- **Real-time Updates**: Auto-refreshes metrics every 30 seconds
- **Responsive Design**: Clean, modern UI that works on all devices
- **Theming System**: Dynamic theme support with CSS custom properties
- **Comprehensive Metrics**: Displays all available proxy metrics including:
  - Basic statistics (requests, success rates)
  - Streaming vs non-streaming analysis
  - Token usage (when available)
  - Performance metrics
  - Model usage patterns
  - Error analysis

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

# Build for production
npm run build

# Run tests
npm test
```

### TypeScript

The project uses TypeScript for better type safety and developer experience:

- **Strict Mode**: Enabled for maximum type safety
- **Interfaces**: Well-defined types for all metrics data
- **Type Guards**: Proper null checking and error handling
- **Modern React**: Uses React 18+ with hooks and TypeScript

### Project Structure

```
src/
├── App.tsx          # Main application component
├── index.tsx        # Application entry point
├── types.ts         # TypeScript interfaces
├── styles/          # Organized stylesheets
├── components/      # Reusable components
├── core/            # Core functionality and theming
└── react-app-env.d.ts # React environment types
```

## Configuration

The frontend connects to the metrics API via the `REACT_APP_METRICS_API_URL` environment variable:

```bash
# Default: http://localhost:8002
REACT_APP_METRICS_API_URL=http://your-metrics-api:8002
```

## Theming

The frontend includes a dynamic theming system:

- **Theme Selector**: Located in the footer for easy access
- **CSS Custom Properties**: Efficient theme switching without page reloads
- **Extensible**: Easy to add new themes by extending the theme interface
- **Fallbacks**: All styles include fallback values for compatibility

### Current Themes
- **Light**: Clean, modern light theme (default)

### Adding Themes
See the theme system implementation in `src/core/themes/` for detailed examples and the `src/styles/README.md` for styling guidelines.

## Development

### Style Architecture
The styles use SCSS for better organization and maintainability. See `src/styles/README.md` for detailed information about the style structure and organization.

### Adding Features
- **New Components**: Add to `src/components/`
- **New Themes**: Extend the theme system in `src/core/themes/`
- **Style Changes**: Modify appropriate files in `src/styles/`

## Building for Production

The Dockerfile automatically handles TypeScript compilation and builds the production bundle:

```bash
docker build -t metrics-frontend .
docker run -p 3000:3000 metrics-frontend
```

## Metrics Display

The frontend intelligently handles different types of metrics:

- **Token Usage**: Only shown when data is available (non-streaming requests)
- **Performance**: Adapts display based on available data
- **Conditional Rendering**: Sections only appear when they have data to show
