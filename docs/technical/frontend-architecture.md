# Frontend Architecture

## Overview

The frontend is built with React 18+ and TypeScript, featuring a modern component architecture with a comprehensive theming system and organized SCSS styling.

## Technology Stack

- **React**: 18.2.0+ with hooks and functional components
- **TypeScript**: Strict mode enabled for type safety
- **SCSS**: Modular stylesheet organization
- **CSS Custom Properties**: Dynamic theming system

## Project Structure

```
frontend/src/
├── App.tsx                    # Main application component
├── index.tsx                  # Application entry point
├── types.ts                   # TypeScript interfaces
├── utils.ts                   # Utility functions
├── styles/                    # SCSS styles organized by component
│   ├── main.scss             # Main stylesheet that imports all partials
│   ├── _variables.scss       # SCSS variables and constants
│   ├── _themes.scss          # Theme system and CSS custom properties
│   ├── _layout.scss          # Main layout and footer styles
│   ├── _typography.scss      # Text and heading styles
│   ├── _metrics.scss         # Metric components and grid styles
│   ├── _buttons.scss         # Button component styles
│   ├── _theme-selector.scss  # Theme selector component styles
│   ├── _utilities.scss       # Utility classes and mixins
│   └── README.md             # Style organization guide
├── components/                # Reusable components
│   └── ThemeSelector.tsx     # Theme selection component
└── core/                      # Core functionality
    └── themes/               # Theming system
        └── index.ts          # Theme definitions and utilities
```

## SCSS Architecture

### Organization Principles

The styles are organized using SCSS partials for better maintainability and scalability:

1. **Separation of Concerns**: Each component type has its own file
2. **Variable Centralization**: All constants defined in `_variables.scss`
3. **Theme Integration**: CSS custom properties for dynamic theming
4. **Utility Classes**: Reusable patterns and responsive mixins

### File Structure

- **`_variables.scss`**: Colors, spacing, typography, and layout constants
- **`_themes.scss`**: CSS custom properties and theme utility classes
- **`_layout.scss`**: App container, footer, and grid system
- **`_typography.scss`**: Headings, text styles, and font definitions
- **`_metrics.scss`**: Metric cards, sections, and data visualization
- **`_buttons.scss**`: Button components and interactive states
- **`_theme-selector.scss`**: Theme selection dropdown styling
- **`_utilities.scss`**: Responsive mixins and utility classes

### SCSS Features Used

- **Variables**: `$color-primary`, `$spacing-lg`, `$font-size-base`
- **Nesting**: Component-specific style organization
- **Mixins**: Responsive breakpoints and reusable patterns
- **Functions**: CSS custom property fallbacks
- **Import System**: Modular file organization

## User Preferences System

### LocalStorage Persistence

The application stores user preferences in LocalStorage under the key `llm-metrics-preferences`:

```json
{
  "language": "en",
  "theme": "dark",
  "timeframe": "1d"
}
```

### Theme Persistence

- **Stored Preferences**: User-selected themes are saved to LocalStorage
- **OS Detection**: Automatically detects `prefers-color-scheme` media query
- **Fallback Logic**: Stored preference > OS preference > default theme
- **Dynamic Updates**: Listens for OS theme changes when no stored preference exists

### Timeframe Persistence

- **Stored Preferences**: User-selected timeframes are saved to LocalStorage
- **Default Logic**: Stored preference > default timeframe ('all')
- **Available Timeframes**: 1h, 6h, 12h, 1d, 1w, 1mo, all
- **Smart Defaults**: 'all' provides comprehensive data view for new users

### Language Persistence

- **Stored Preferences**: User-selected languages are saved to LocalStorage
- **Browser Detection**: Uses `navigator.languages` and `navigator.language`
- **Fallback Logic**: Stored preference > browser language > English
- **Supported Languages**: EN, ES, FR, DE, JA, ZH, RU, KO

## Theming System

### Architecture

The theming system uses CSS custom properties applied at the document root:

1. **Theme Definition**: JavaScript objects define colors, borders, shadows
2. **CSS Application**: Properties applied via `document.documentElement.style`
3. **Fallback Values**: SCSS variables provide default values
4. **Dynamic Switching**: Themes can be changed without page reload
5. **Persistence**: User preferences saved to LocalStorage

### Theme Structure

```typescript
interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    background: string;
    text: string;
    // ... other color properties
  };
  borders: {
    radius: string;
    width: string;
    style: string;
  };
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
}
```

### CSS Custom Properties

The system generates CSS custom properties for each theme:

```css
:root {
  --color-primary: #007bff;
  --color-background: #f8f9fa;
  --color-text: #212529;
  --border-radius: 12px;
  --shadow-medium: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

## Component Architecture

### App Component

The main `App.tsx` component:
- Manages application state (metrics, loading, errors)
- Handles theme selection and application
- Provides the main layout structure
- Includes footer with theme selector

### Theme Selector

The `ThemeSelector` component:
- Dropdown interface for theme selection
- Click-outside handling for accessibility
- Dynamic theme switching
- Responsive design

### Metrics Display

Metrics are organized into logical sections:
- Basic statistics (requests, success rates)
- Streaming analysis
- Token usage (when available)
- Performance metrics
- Model usage patterns
- Error analysis

## Development Workflow

### Adding New Styles

1. **Component-specific**: Add to appropriate component file
2. **Global variables**: Add to `_variables.scss`
3. **New components**: Create new partial file
4. **Import**: Add to `main.scss`

### Adding New Themes

1. **Define theme**: Add to `THEMES` array in `core/themes/index.ts`
2. **Update variables**: Add new colors to `_variables.scss` if needed
3. **Test**: Verify theme application and fallbacks
4. **Document**: Update relevant documentation

### Responsive Design

Use the provided SCSS mixins:

```scss
@include mobile {
  // Mobile-specific styles
}

@include tablet {
  // Tablet-specific styles
}

@include desktop {
  // Desktop-specific styles
}
```

## Build Process

### Development

- **`npm start`**: Development server with hot reloading
- **SCSS Compilation**: Automatic compilation by Create React App
- **Type Checking**: TypeScript compilation and error reporting

### Production

- **`npm run build`**: Optimized production build
- **SCSS Processing**: Compiled to optimized CSS
- **Bundle Optimization**: Code splitting and minification
- **Asset Optimization**: Images and fonts optimized

## Performance Considerations

- **CSS Custom Properties**: Efficient theme switching
- **SCSS Compilation**: Optimized CSS output
- **Component Lazy Loading**: Future optimization opportunity
- **Bundle Splitting**: Separate CSS and JS bundles

## Future Enhancements

- **Dark Theme**: Additional theme variants
- **CSS-in-JS**: Alternative styling approach
- **Design System**: Component library and design tokens
- **Animation System**: Enhanced transitions and micro-interactions
