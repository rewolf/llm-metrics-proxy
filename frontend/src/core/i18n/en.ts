import { Translation } from '../../types';

export const en: Translation = {
  // App title
  appTitle: 'LLM Metrics Dashboard',
  
  // Tab labels
  overview: 'Overview',
  streamedRequests: 'Streamed Requests',
  nonStreamedRequests: 'Non-streamed Requests',
  
  // Section headers
  basicStatistics: 'Basic Statistics',
  streamingStatistics: 'Streaming Statistics',
  tokenUsage: 'Token Usage',
  performanceMetrics: 'Performance Metrics',
  modelUsage: 'Model Usage',
  completionAnalysis: 'Completion Analysis',
  errorAnalysis: 'Error Analysis',
  requestSources: 'Request Sources',
  
  // Metric labels
  totalCompletionRequests: 'Total Completion Requests',
  successfulRequests: 'Successful Requests',
  failedRequests: 'Failed Requests',
  successRate: 'Success Rate',
  streamingRequests: 'Streaming Requests',
  nonStreamingRequests: 'Non-Streaming Requests',
  streamingPercentage: 'Streaming Percentage',
  totalTokensUsed: 'Total Tokens Used',
  avgTokensPerRequest: 'Average Tokens per Request',
  avgResponseTime: 'Average Response Time',
  avgTokensPerSecond: 'Average Tokens per Second',
  lastUpdated: 'Last Updated',
  
  // Streaming-specific metrics
  timeToFirstToken: 'Time to First Token',
  timeToLastToken: 'Time to Last Token',
  completionDuration: 'Completion Duration',
  streamedRequestsCount: 'Streamed Requests',
  streamedRequestsPercent: 'Percent of Total',
  
  // Non-streaming specific metrics
  nonStreamedRequestsCount: 'Non-streamed Requests',
  nonStreamedRequestsPercent: 'Percent of Total',
  tokensPerRequest: 'Tokens per Request',
  
  // Button text
  refreshNow: 'Refresh Now',
  
  // Footer
  footerText: 'LLM Metrics Proxy',
  
  // Language names
  english: 'English',
  spanish: 'Español',
  french: 'Français',
  german: 'Deutsch',
  japanese: '日本語',
  chinese: '中文',
  russian: 'Русский',
  korean: '한국어',
  
  // Notes and warnings
  tokenUsageNote: '⚠️ Token usage is only available for non-streaming requests. Streaming requests show timing metrics instead.',
  performanceNote: '📊 Response time includes both streaming and non-streaming requests. Time to first token shows streaming performance.',
  streamingPerformanceNote: '📊 These metrics are only available for requests explicitly requesting usage metrics.',
  requests: 'requests',
  times: 'times',
  tokensPerSecond: 'tokens/s',
  naStreaming: 'N/A (streaming)',
  
  // Loading and error states
  loadingMetrics: 'Loading metrics...',
  errorLoadingMetrics: 'Error loading metrics:',
  noMetricsData: 'No metrics data available',
  
  // Timeframe selector
  selectTimeframe: 'Select Timeframe',
  timeframe1h: '1 Hour',
  timeframe6h: '6 Hours',
  timeframe12h: '12 Hours',
  timeframe1d: '1 Day',
  timeframe1w: '1 Week',
  timeframe1mo: '1 Month',
  timeframeAll: 'All Time'
};
