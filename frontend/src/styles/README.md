# Styles Directory

This directory contains the SCSS styles for the OpenAI LLM Metrics Proxy frontend, organized into logical modules for maintainability and scalability.

## Structure

```
styles/
├── _variables.scss      # SCSS variables and constants
├── _themes.scss         # Theme system and CSS custom properties
├── _layout.scss         # Main layout and footer styles
├── _typography.scss     # Text and heading styles
├── _metrics.scss        # Metric components and grid styles
├── _buttons.scss        # Button component styles
├── _theme-selector.scss # Theme selector component styles
├── _utilities.scss      # Utility classes and mixins
├── main.scss           # Main file that imports all partials
└── README.md           # This file
```

## Architecture

### Variables (`_variables.scss`)
- Centralized SCSS variables for colors, spacing, typography
- Provides fallback values for CSS custom properties
- Easy to modify for consistent theming

### Themes (`_themes.scss`)
- CSS custom properties for dynamic theming
- Theme utility classes
- Root-level variable definitions

### Component Styles
Each component type has its own file:
- **Layout**: App container, footer, grid system
- **Typography**: Headings, text, font styles
- **Metrics**: Metric cards, sections, lists
- **Buttons**: Button components and states
- **Theme Selector**: Theme selection dropdown

### Utilities (`_utilities.scss`)
- Responsive mixins for mobile/tablet/desktop
- Spacing utility classes
- Display and text alignment utilities

## Usage

### Adding New Styles
1. **Component-specific**: Add to appropriate component file
2. **Global**: Add to `_variables.scss` or create new partial
3. **Import**: Add import to `main.scss`

### Adding New Themes
1. **Define colors**: Add to `_variables.scss`
2. **Create theme class**: Add to `_themes.scss`
3. **Update theme system**: Modify `core/themes/index.ts`

### Responsive Design
Use the provided mixins:
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

## Benefits

- **Modular**: Easy to find and modify specific styles
- **Maintainable**: Clear separation of concerns
- **Scalable**: Easy to add new components and themes
- **Consistent**: Centralized variables ensure consistency
- **Performance**: SCSS compilation optimizes CSS output

## Build Process

The SCSS is automatically compiled by Create React App during:
- `npm start` - Development with hot reloading
- `npm run build` - Production build with optimization
