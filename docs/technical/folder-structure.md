# Frontend Folder Structure

## Overview
The frontend follows a feature-based architecture with clear separation of concerns between UI components, business logic, and shared utilities.

## Directory Structure

```
frontend/src/
├── components/           # Pure UI components
│   ├── index.ts         # UI component exports
│   ├── LanguageSelector.tsx
│   ├── TabSelector.tsx
│   ├── ThemeSelector.tsx
│   └── TimeframeSelector.tsx
│
├── features/            # Feature-specific components
│   ├── index.ts         # Feature exports
│   ├── overview/        # Overview tab functionality
│   │   ├── index.ts
│   │   └── OverviewTab.tsx
│   ├── streaming/       # Streaming metrics functionality
│   │   ├── index.ts
│   │   └── StreamedTab.tsx
│   └── non-streaming/  # Non-streaming metrics functionality
│       ├── index.ts
│       └── NonStreamedTab.tsx
│
├── shared/              # Reusable UI components and utilities
│   ├── index.ts         # Shared component exports
│   ├── charts/          # Chart components
│   │   ├── BaseChart.tsx
│   │   ├── RequestCountChart.tsx
│   │   └── ResponseTimeChart.tsx
│   ├── MetricSection.tsx
│   ├── MetricGrid.tsx
│   ├── MetricList.tsx
│   └── MetricSplitLayout.tsx
│
├── core/                # Business logic and configuration
│   ├── i18n/           # Internationalization
│   │   ├── index.ts
│   │   ├── translations.ts
│   │   └── [language].ts files
│   └── themes/         # Theme management
│       └── index.ts
│
├── assets/              # Static assets
│   └── icons/          # SVG icons
│
├── styles/              # SCSS stylesheets
├── types.ts             # TypeScript type definitions
├── utils.ts             # Utility functions
├── App.tsx              # Main application component
└── index.tsx            # Application entry point
```

## Architecture Principles

### 1. **Separation of Concerns**
- **components/**: Pure UI components with no business logic
- **features/**: Feature-specific components that combine UI and business logic
- **shared/**: Reusable components used across multiple features
- **core/**: Business logic, configuration, and utilities

### 2. **Feature-Based Organization**
Each feature (overview, streaming, non-streaming) is self-contained with its own directory and index file.

### 3. **Shared Component Reusability**
Common UI patterns (MetricSection, MetricGrid, etc.) are extracted into shared components to avoid duplication.

### 4. **Clean Import Paths**
- Features import from `../../shared` for shared components
- Features import from `../../core` for business logic
- Main App imports from `./features` and `./components`

## Import Patterns

### UI Components
```tsx
import { ThemeSelector, LanguageSelector } from './components';
```

### Feature Components
```tsx
import { OverviewTab, StreamedTab, NonStreamedTab } from './features';
```

### Shared Components
```tsx
import { MetricSection, MetricGrid } from '../../shared';
```

### Business Logic
```tsx
import { getTranslation } from '../../core/i18n';
import { applyTheme } from '../../core/themes';
```

## Benefits

1. **Maintainability**: Clear separation makes code easier to understand and modify
2. **Reusability**: Shared components can be used across features
3. **Scalability**: Easy to add new features following the established pattern
4. **Testing**: Components can be tested in isolation
5. **Team Development**: Different developers can work on different features without conflicts

## Adding New Features

To add a new feature:

1. Create a new directory in `features/`
2. Create an `index.ts` file for exports
3. Follow the established component structure
4. Import shared components from `../../shared`
5. Add the feature to `features/index.ts`

## Adding New Shared Components

To add a new shared component:

1. Create the component in `shared/`
2. Export it from `shared/index.ts`
3. Import it in features using `../../shared`
