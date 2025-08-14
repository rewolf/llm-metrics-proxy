export interface Theme {
  id: string;
  name: string;
  description: string;
  fontFamily: string;
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
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
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
    id: 'solarized-light',
    name: 'Solarized Light',
    description: 'Sophisticated light theme with warm, muted colors',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    colors: {
      primary: '#268bd2',
      secondary: '#586e75',
      accent: '#2aa198',
      background: '#fdf6e3',
      surface: '#eee8d5',
      text: '#586e75',
      textSecondary: '#839496',
      border: '#93a1a1',
      borderLight: '#b58900',
      success: '#859900',
      warning: '#b58900',
      error: '#dc322f',
      metricBackground: '#eee8d5',
      metricBorder: '#268bd2',
      metricSuccess: '#859900',
      metricFailed: '#dc322f'
    },
    borders: {
      radius: '6px',
      width: '1px',
      style: 'solid'
    },
    shadows: {
      small: '0 1px 3px rgba(101, 123, 131, 0.1)',
      medium: '0 2px 8px rgba(101, 123, 131, 0.15)',
      large: '0 4px 16px rgba(101, 123, 131, 0.2)'
    }
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Sleek dark theme with rounded corners and green accents',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    colors: {
      primary: '#10b981',
      secondary: '#6b7280',
      accent: '#34d399',
      background: '#111827',
      surface: '#161b22',
      text: '#f9fafb',
      textSecondary: '#c9d1d9',
      border: '#30363d',
      borderLight: '#21262d',
      success: '#10b981',
      warning: '#ffab00',
      error: '#ff5252',
      metricBackground: '#161b22',
      metricBorder: '#10b981',
      metricSuccess: '#10b981',
      metricFailed: '#ff5252'
    },
    borders: {
      radius: '8px',
      width: '1px',
      style: 'solid'
    },
    shadows: {
      small: '0 1px 3px rgba(0, 0, 0, 0.3)',
      medium: '0 4px 6px rgba(0, 0, 0, 0.4)',
      large: '0 10px 15px rgba(0, 0, 0, 0.5)'
    }
  },
  {
    id: 'terminal',
    name: 'Terminal',
    description: 'Dark terminal theme with Tron-like cyan accents',
    fontFamily: '"JetBrains Mono", monospace',
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
  },
  {
    id: 'fluid',
    name: 'Fluid',
    description: 'Vibrant magenta and deep blue theme with flowing aesthetics',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    colors: {
      primary: '#e91e63',
      secondary: '#9c27b0',
      accent: '#ff4081',
      background: '#0d1117',
      surface: '#161b22',
      text: '#ffffff',
      textSecondary: '#c9d1d9',
      border: '#30363d',
      borderLight: '#21262d',
      success: '#00e676',
      warning: '#ffab00',
      error: '#ff5252',
      metricBackground: '#161b22',
      metricBorder: '#e91e63',
      metricSuccess: '#00e676',
      metricFailed: '#ff5252'
    },
    borders: {
      radius: '16px',
      width: '2px',
      style: 'solid'
    },
    shadows: {
      small: '0 4px 12px rgba(233, 30, 99, 0.15)',
      medium: '0 8px 24px rgba(233, 30, 99, 0.25)',
      large: '0 16px 48px rgba(233, 30, 99, 0.35)'
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
  body.classList.remove('theme-light', 'theme-solarized-light', 'theme-dark', 'theme-terminal', 'theme-fluid');
  
  // Add the current theme class
  body.classList.add(`theme-${theme.id}`);
  
  // Apply font family
  root.style.setProperty('--font-family', theme.fontFamily);
  
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
 * Detects the user's preferred color scheme from OS/browser settings
 * Falls back to 'light' if no preference is detected
 */
export function detectUserColorScheme(): 'light' | 'dark' {
  // Check if we're in a browser environment
  if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {
    return 'light';
  }

  // Check if user prefers dark mode
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  
  if (prefersDark) return 'dark';
  if (prefersLight) return 'light';
  
  // Default to light if no preference
  return 'light';
}

/**
 * Gets the stored theme preference from localStorage (if any)
 */
export function getStoredThemePreference(): string | null {
  if (typeof localStorage !== 'undefined') {
    try {
      const stored = localStorage.getItem('llm-metrics-preferences');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.theme && isValidTheme(parsed.theme)) {
          return parsed.theme;
        }
      }
    } catch (error) {
      // Ignore errors
    }
  }
  return null;
}

/**
 * Checks if a theme ID is valid and supported
 */
function isValidTheme(themeId: any): themeId is string {
  return typeof themeId === 'string' && THEMES.some(theme => theme.id === themeId);
}

/**
 * Saves theme preference to localStorage
 */
export function saveThemePreference(themeId: string): void {
  if (typeof localStorage !== 'undefined') {
    try {
      const stored = localStorage.getItem('llm-metrics-preferences');
      const preferences = stored ? JSON.parse(stored) : {};
      preferences.theme = themeId;
      localStorage.setItem('llm-metrics-preferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  }
}

/**
 * Gets the default theme ID, prioritizing stored preferences over OS detection
 */
export function getDefaultThemeId(): string {
  // First, check if there's a stored theme preference
  const storedTheme = getStoredThemePreference();
  if (storedTheme) {
    return storedTheme;
  }
  
  // If no stored preference, use OS color scheme detection
  const preferredScheme = detectUserColorScheme();
  
  // Map the preferred scheme to available themes
  if (preferredScheme === 'dark') {
    // Prefer the 'dark' theme for dark mode
    return 'dark';
  } else {
    // Prefer the 'light' theme for light mode
    return 'light';
  }
}

/**
 * Debug function to see what theme detection found
 * Useful for development and troubleshooting
 */
export function debugThemeDetection(): {
  prefersColorScheme: string | null;
  detectedColorScheme: 'light' | 'dark';
  availableThemes: string[];
  storedThemePreference: string | null;
  finalTheme: string;
} {
  let prefersColorScheme: string | null = null;
  
  if (typeof window !== 'undefined' && typeof window.matchMedia !== 'undefined') {
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const lightQuery = window.matchMedia('(prefers-color-scheme: light)');
    
    if (darkQuery.matches) prefersColorScheme = 'dark';
    else if (lightQuery.matches) prefersColorScheme = 'light';
    else prefersColorScheme = 'no-preference';
  }

  return {
    prefersColorScheme,
    detectedColorScheme: detectUserColorScheme(),
    availableThemes: THEMES.map(theme => theme.id),
    storedThemePreference: getStoredThemePreference(),
    finalTheme: getDefaultThemeId()
  };
}
