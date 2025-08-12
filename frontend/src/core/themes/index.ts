export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    borderLight: string;
    success: string;
    warning: string;
    error: string;
    metricBackground: string;
    metricBorder: string;
    metricSuccess: string;
    metricFailed: string;
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

// Predefined themes - starting with just one light theme
export const THEMES: Theme[] = [
  {
    id: 'light',
    name: 'Light',
    description: 'Clean, modern light theme',
    colors: {
      primary: '#007bff',
      secondary: '#6c757d',
      accent: '#28a745',
      background: '#f8f9fa',
      surface: '#ffffff',
      text: '#212529',
      textSecondary: '#6c757d',
      border: '#dee2e6',
      borderLight: '#e9ecef',
      success: '#28a745',
      warning: '#ffc107',
      error: '#dc3545',
      metricBackground: '#f8f9fa',
      metricBorder: '#007bff',
      metricSuccess: '#28a745',
      metricFailed: '#dc3545'
    },
    borders: {
      radius: '12px',
      width: '1px',
      style: 'solid'
    },
    shadows: {
      small: '0 1px 3px rgba(0, 0, 0, 0.05)',
      medium: '0 2px 8px rgba(0, 0, 0, 0.1)',
      large: '0 4px 12px rgba(0, 0, 0, 0.15)'
    }
  }
];

/**
 * Gets a theme by ID
 */
export function getTheme(themeId: string): Theme {
  const theme = THEMES.find(t => t.id === themeId);
  return theme || THEMES[0]; // Default to light theme if not found
}

/**
 * Gets all available themes
 */
export function getAllThemes(): Theme[] {
  return [...THEMES];
}

/**
 * Applies a theme to the document by setting CSS custom properties
 */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  
  // Apply colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
  
  // Apply borders
  Object.entries(theme.borders).forEach(([key, value]) => {
    root.style.setProperty(`--border-${key}`, value);
  });
  
  // Apply shadows
  Object.entries(theme.shadows).forEach(([key, value]) => {
    root.style.setProperty(`--shadow-${key}`, value);
  });
}

/**
 * Gets the default theme ID
 */
export function getDefaultThemeId(): string {
  return 'light';
}
