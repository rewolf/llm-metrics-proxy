import { Timeframe } from '../../types';

export const AVAILABLE_TIMEFRAMES: Timeframe[] = [
  { id: '1h', label: '1 Hour', hours: 1 },
  { id: '6h', label: '6 Hours', hours: 6 },
  { id: '12h', label: '12 Hours', hours: 12 },
  { id: '1d', label: '1 Day', hours: 24 },
  { id: '1w', label: '1 Week', hours: 168 },
  { id: '1mo', label: '1 Month', hours: 720 },
  { id: 'all', label: 'All Time', hours: 0 }
];



/**
 * Gets the stored timeframe preference from localStorage (if any)
 */
export function getStoredTimeframePreference(): string | null {
  if (typeof localStorage !== 'undefined') {
    try {
      const stored = localStorage.getItem('llm-metrics-preferences');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.timeframe && isValidTimeframe(parsed.timeframe)) {
          return parsed.timeframe;
        }
      }
    } catch (error) {
      // Ignore errors
    }
  }
  return null;
}

/**
 * Checks if a timeframe ID is valid and supported
 */
function isValidTimeframe(timeframeId: any): timeframeId is string {
  return typeof timeframeId === 'string' && AVAILABLE_TIMEFRAMES.some(tf => tf.id === timeframeId);
}

/**
 * Saves timeframe preference to localStorage
 */
export function saveTimeframePreference(timeframeId: string): void {
  if (typeof localStorage !== 'undefined') {
    try {
      const stored = localStorage.getItem('llm-metrics-preferences');
      const preferences = stored ? JSON.parse(stored) : {};
      preferences.timeframe = timeframeId;
      localStorage.setItem('llm-metrics-preferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save timeframe preference:', error);
    }
  }
}

/**
 * Gets the default timeframe ID, prioritizing stored preferences over default
 */
export function getDefaultTimeframeId(): string {
  // First, check if there's a stored timeframe preference
  const storedTimeframe = getStoredTimeframePreference();
  if (storedTimeframe) {
    return storedTimeframe;
  }
  
  // If no stored preference, use default
  return 'all';
}

/**
 * Debug function to see what timeframe detection found
 * Useful for development and troubleshooting
 */
export function debugTimeframeDetection(): {
  availableTimeframes: string[];
  storedTimeframePreference: string | null;
  finalTimeframe: string;
} {
  return {
    availableTimeframes: AVAILABLE_TIMEFRAMES.map(tf => tf.id),
    storedTimeframePreference: getStoredTimeframePreference(),
    finalTimeframe: getDefaultTimeframeId()
  };
}
