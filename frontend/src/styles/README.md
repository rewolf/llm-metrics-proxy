# Frontend Styles

This directory contains all the SCSS styles for the OpenAI LLM Metrics Proxy frontend application.

## File Structure

- `main.scss` - Main stylesheet that imports all partials
- `_variables.scss` - SCSS variables for colors, spacing, typography, etc.
- `_themes.scss` - Theme system implementation with CSS custom properties
- `_layout.scss` - Layout and structural styles
- `_typography.scss` - Typography and text styling
- `_metrics.scss` - Metrics components and chart styling
- `_buttons.scss` - Button component styles
- `_theme-selector.scss` - Theme selector dropdown styles
- `_language-selector.scss` - Language selector dropdown styles
- `_timeframe-selector.scss` - Timeframe selector styles
- `_utilities.scss` - Utility classes and helper styles

## Theme System

The application uses a CSS custom properties-based theme system that allows for dynamic theme switching.

### Available Themes

1. **Light Theme** (`theme-light`)
   - Clean, modern light theme
   - Rounded corners and subtle shadows
   - Blue primary color scheme

2. **Terminal Theme** (`theme-terminal`)
   - Dark terminal theme with Tron-like cyan accents
   - Square corners and glowing effects
   - JetBrains Mono monospace font
   - Subtle scanlines and CRT effects
   - Animated elements with cyan glow

### Theme Features

- **Dynamic Switching**: Themes can be changed at runtime
- **CSS Custom Properties**: All theme values are stored as CSS custom properties
- **Responsive Design**: All themes are fully responsive
- **Accessibility**: Proper contrast ratios and focus states
- **Performance**: Minimal CSS overhead with efficient selectors

### Terminal Theme Special Features

- **Monospace Typography**: Uses JetBrains Mono font for authentic terminal feel
- **Glowing Effects**: Cyan accents with subtle glow animations
- **Scanline Effects**: Subtle horizontal scanlines for CRT monitor feel
- **Square Design**: All rounded corners removed for authentic terminal look
- **Enhanced Animations**: Subtle pulse, flicker, and scanline animations
- **Grid Patterns**: Subtle background grid patterns
- **Enhanced Focus States**: Clear focus indicators for accessibility

## Usage

Themes are automatically applied when selected through the theme selector component. The theme class is applied to the body element, allowing for theme-specific styling throughout the application.

## Customization

To add a new theme:

1. Add the theme definition to `src/core/themes/index.ts`
2. Add the corresponding CSS class in `_themes.scss`
3. Add theme-specific component styles in the respective component files
4. Update the theme selector to include the new theme

## Browser Support

- Modern browsers with CSS custom properties support
- Fallbacks provided for older browsers
- Progressive enhancement approach
