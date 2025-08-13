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
  },
  {
    id: 'terminal',
    name: 'Terminal',
    description: 'Dark terminal theme with Tron-like cyan accents',
    colors: {
      primary: '#00ffff',
      secondary: '#008080',
      accent: '#00b3b3',
      background: '#0a0a0a',
      surface: '#1a1a1a',
      text: '#00ffff',
      textSecondary: '#00b3b3',
      border: '#00ffff',
      borderLight: '#008080',
      success: '#00ff00',
      warning: '#ffff00',
      error: '#ff0000',
      metricBackground: '#1a1a1a',
      metricBorder: '#00ffff',
      metricSuccess: '#00ff00',
      metricFailed: '#ff0000'
    },
    borders: {
      radius: '0px',
      width: '2px',
      style: 'solid'
    },
    shadows: {
      small: '0 0 0 rgba(0, 255, 255, 0.3)',
      medium: '0 0 10px rgba(0, 255, 255, 0.5)',
      large: '0 0 20px rgba(0, 255, 255, 0.7)'
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
  const body = document.body;
  
  // Remove all existing theme classes
  body.classList.remove('theme-light', 'theme-terminal');
  
  // Add the current theme class
  body.classList.add(`theme-${theme.id}`);
  
  // Apply colors
  Object.keys(theme.colors).forEach((key: string) => {
    const value = (theme.colors as any)[key];
    root.style.setProperty(`--color-${key}`, value);
  });
  
  // Apply borders
  Object.keys(theme.borders).forEach((key: string) => {
    const value = (theme.borders as any)[key];
    root.style.setProperty(`--border-${key}`, value);
  });
  
  // Apply shadows
  Object.keys(theme.shadows).forEach((key: string) => {
    const value = (theme.shadows as any)[key];
    root.style.setProperty(`--shadow-${key}`, value);
  });
}

/**
 * Gets the default theme ID
 */
export function getDefaultThemeId(): string {
  return 'light';
}
