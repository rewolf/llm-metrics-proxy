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

/**
 * Get preset bucket size based on timeframe
 * @param timeframe - The selected timeframe (e.g., '1h', '6h', '1d')
 * @returns Bucket size in milliseconds
 */
export const getPresetBucketSize = (timeframe: string): number => {
  switch (timeframe) {
    case '1h':
      return 30 * 1000; // 30 seconds
    case '6h':
      return 2 * 60 * 1000; // 2 minutes
    case '12h':
      return 5 * 60 * 1000; // 5 minutes
    case '1d':
      return 10 * 60 * 1000; // 10 minutes
    case '1w':
      return 60 * 60 * 1000; // 1 hour
    case '1mo':
      return 6 * 60 * 60 * 1000; // 6 hours
    default:
      // For 'all' or unknown timeframes, use 1 hour buckets
      return 60 * 60 * 1000;
  }
};

/**
 * Convert UTC timestamp to local timezone
 * @param utcTimestamp - ISO timestamp string in UTC
 * @returns Date object in local timezone
 */
export const convertUTCToLocal = (utcTimestamp: string): Date => {
  // Create a Date object from the UTC timestamp
  const utcDate = new Date(utcTimestamp);
  
  // Get the local timezone offset in minutes
  const localOffset = utcDate.getTimezoneOffset();
  
  // Create a new Date object adjusted to local timezone
  const localDate = new Date(utcDate.getTime() - (localOffset * 60 * 1000));
  
  return localDate;
};

/**
 * Get timeframe start and end dates
 * @param timeframe - The selected timeframe
 * @returns Object with start and end dates
 */
export const getTimeframeRange = (timeframe: string): { start: Date; end: Date } => {
  const end = new Date();
  let start: Date;
  
  switch (timeframe) {
    case '1h':
      start = new Date(end.getTime() - (60 * 60 * 1000));
      break;
    case '6h':
      start = new Date(end.getTime() - (6 * 60 * 60 * 1000));
      break;
    case '12h':
      start = new Date(end.getTime() - (12 * 60 * 60 * 1000));
      break;
    case '1d':
      start = new Date(end.getTime() - (24 * 60 * 60 * 1000));
      break;
    case '1w':
      start = new Date(end.getTime() - (7 * 24 * 60 * 60 * 1000));
      break;
    case '1mo':
      start = new Date(end.getTime() - (30 * 24 * 60 * 60 * 1000));
      break;
    default:
      // For 'all' or unknown timeframes, use 24 hours
      start = new Date(end.getTime() - (24 * 60 * 60 * 1000));
  }
  
  return { start, end };
};

/**
 * Generate all buckets for a timeframe, including empty ones
 * @param timeframe - The selected timeframe
 * @returns Array of bucket timestamps in local timezone
 */
export const generateTimeBuckets = (timeframe: string): string[] => {
  const { start, end } = getTimeframeRange(timeframe);
  const bucketSize = getPresetBucketSize(timeframe);
  const buckets: string[] = [];
  
  let currentTime = new Date(start.getTime());
  
  while (currentTime <= end) {
    // Generate buckets in local timezone to match the converted request timestamps
    buckets.push(currentTime.toLocaleString('sv-SE').replace(' ', 'T'));
    currentTime = new Date(currentTime.getTime() + bucketSize);
  }
  
  return buckets;
};

/**
 * Aggregate completion request data into time buckets with empty bucket support
 * @param requests - Array of completion request data
 * @param timeframe - The selected timeframe
 * @param aggregateFunction - Function to aggregate values in each bucket
 * @returns Array of aggregated data points including empty buckets
 */
export const aggregateRequestsByTime = <T>(
  requests: any[],
  timeframe: string,
  aggregateFunction: (bucketRequests: any[]) => T
): Array<{ timestamp: string; value: T }> => {
  const bucketSize = getPresetBucketSize(timeframe);
  const buckets = generateTimeBuckets(timeframe);
  
  // Create a map of bucket data
  const bucketData = new Map<string, any[]>();
  
  // Initialize all buckets with empty arrays
  buckets.forEach(bucket => {
    bucketData.set(bucket, []);
  });
  
  // Group requests into buckets
  requests.forEach(request => {
    // Convert UTC timestamp to local timezone before processing
    const localTimestamp = convertUTCToLocal(request.timestamp);
    
    // Find the bucket that contains this timestamp
    const requestTime = localTimestamp.getTime();
    
    // Find the bucket that contains this request time
    const targetBucket = buckets.find(bucket => {
      const bucketDate = new Date(bucket);
      const bucketStart = bucketDate.getTime();
      const bucketEnd = bucketStart + bucketSize;
      
      // Check if request time falls within this bucket
      return requestTime >= bucketStart && requestTime < bucketEnd;
    });
    
    if (targetBucket && bucketData.has(targetBucket)) {
      bucketData.get(targetBucket)!.push(request);
    }
  });
  
  // Convert buckets to sorted array with aggregated values
  const result = buckets.map(timestamp => ({
    timestamp,
    value: aggregateFunction(bucketData.get(timestamp) || [])
  }));
  
  return result;
};
