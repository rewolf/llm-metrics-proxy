# Frontend Styles

This directory contains the SCSS styles for the LLM Metrics Proxy frontend, organized into logical modules for maintainability and scalability.

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

The application uses a sophisticated CSS custom properties-based theme system that allows for dynamic theme switching with comprehensive styling control.

### Available Themes

1. **Light Theme** (`theme-light`)
   - Clean, modern light theme with blue primary colors
   - Rounded corners (12px) and subtle shadows
   - Professional appearance suitable for business environments

2. **Solarized Light Theme** (`theme-solarized-light`)
   - Sophisticated light theme with warm, muted colors
   - Based on the Solarized color palette
   - Subtle borders (6px radius) with warm accent colors
   - Professional yet approachable appearance

3. **Dark Theme** (`theme-dark`)
   - Modern dark theme with high contrast
   - Dark backgrounds with light text for reduced eye strain
   - Consistent with modern dark mode design patterns

4. **Terminal Theme** (`theme-terminal`)
   - Dark terminal theme with Tron-like cyan accents
   - Square corners and glowing effects
   - JetBrains Mono monospace font
   - Subtle scanlines and CRT effects
   - Animated elements with cyan glow

5. **Fluid Theme** (`theme-fluid`)
   - Dynamic, flowing design with smooth transitions
   - Enhanced hover and focus states
   - Modern glassmorphism-inspired effects
   - Sophisticated shadow and border systems

### Theme Features

- **Dynamic Switching**: Themes can be changed at runtime without page reload
- **CSS Custom Properties**: All theme values stored as CSS custom properties for performance
- **Comprehensive Styling**: Full control over colors, borders, shadows, and typography
- **Responsive Design**: All themes are fully responsive across device sizes
- **Accessibility**: Proper contrast ratios and focus states for all themes
- **Performance**: Minimal CSS overhead with efficient selectors and optimized properties

### Advanced Theme System

#### Color Management
Each theme includes a complete color palette:
- **Primary/Secondary/Accent**: Main brand and UI colors
- **Background/Surface**: Layout and component backgrounds
- **Text/TextSecondary**: Typography colors with proper contrast
- **Border/BorderLight**: Border colors for different emphasis levels
- **Success/Warning/Error**: Semantic color indicators
- **Metric-specific**: Specialized colors for metrics display

#### Border System
Comprehensive border control:
- **Radius**: Configurable border radius (0px to 12px)
- **Width**: Border thickness options
- **Style**: Border style variations
- **Theme-specific**: Each theme can define unique border characteristics

#### Shadow System
Sophisticated shadow management:
- **Small**: Subtle shadows for cards and buttons
- **Medium**: Medium shadows for elevated components
- **Large**: Prominent shadows for modals and overlays
- **Performance**: Optimized shadow values for smooth rendering

#### Typography
Advanced font management:
- **Font Families**: Theme-specific font stacks
- **Responsive**: Font sizes that scale with viewport
- **Accessibility**: Proper line heights and spacing
- **Theme Integration**: Fonts that complement each theme's aesthetic

### Terminal Theme Special Features

- **Monospace Typography**: Uses JetBrains Mono font for authentic terminal feel
- **Glowing Effects**: Cyan accents with subtle glow animations
- **Scanline Effects**: Subtle horizontal scanlines for CRT monitor feel
- **Square Design**: All rounded corners removed for authentic terminal look
- **Enhanced Animations**: Subtle pulse, flicker, and scanline animations
- **Grid Patterns**: Subtle background grid patterns
- **Enhanced Focus States**: Clear focus indicators for accessibility

### Fluid Theme Special Features

- **Smooth Transitions**: Enhanced hover and focus state animations
- **Glassmorphism**: Modern translucent effects and blur
- **Dynamic Shadows**: Responsive shadow systems
- **Enhanced Interactions**: Sophisticated button and input states

## Usage

Themes are automatically applied when selected through the theme selector component. The theme class is applied to the body element, allowing for theme-specific styling throughout the application.

## Customization

To add a new theme:

1. **Define Theme Interface**: Add the theme definition to `src/core/themes/index.ts`
2. **Implement CSS**: Add the corresponding CSS class in `_themes.scss`
3. **Component Styles**: Add theme-specific component styles in respective component files
4. **Theme Selector**: Update the theme selector to include the new theme
5. **Testing**: Ensure the theme works across all components and states

### Theme Development Guidelines

- **Color Harmony**: Ensure all colors work together cohesively
- **Accessibility**: Maintain proper contrast ratios (WCAG AA minimum)
- **Performance**: Use efficient CSS selectors and properties
- **Consistency**: Follow established patterns for spacing and sizing
- **Responsiveness**: Test themes across different screen sizes

## Browser Support

- Modern browsers with CSS custom properties support
- Fallbacks provided for older browsers
- Progressive enhancement approach
- Optimized for Chrome, Firefox, Safari, and Edge

## Performance Considerations

- **CSS Custom Properties**: Efficient theme switching without additional CSS
- **Minimal Overhead**: Themes add minimal CSS overhead
- **Optimized Selectors**: Efficient CSS selectors for fast rendering
- **Lazy Loading**: Theme styles loaded only when needed
