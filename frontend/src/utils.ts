/**
 * Calculate percentage with proper handling of edge cases
 * @param part - The part value
 * @param total - The total value
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export const calculatePercentage = (part: number, total: number, decimals: number = 1): string => {
  if (total === 0) return '0%';
  const percentage = (part / total) * 100;
  return `${percentage.toFixed(decimals)}%`;
};

/**
 * Format a number with locale-specific formatting
 * @param value - The number to format
 * @returns Formatted number string
 */
export const formatNumber = (value: number): string => {
  return value.toLocaleString();
};

/**
 * Format response time in milliseconds
 * @param ms - Time in milliseconds
 * @returns Formatted time string
 */
export const formatResponseTime = (ms: number): string => {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
};
