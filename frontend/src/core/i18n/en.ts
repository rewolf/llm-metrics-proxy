import { Translation } from '../../types';

export const en: Translation = {
  // App title
  appTitle: 'LLM Metrics Dashboard',
  
  // Tab labels
  overview: 'Overview',
  streamedRequests: 'Streamed Requests',
  nonStreamedRequests: 'Non-streamed Requests',
  
  // Section headers
  basicStatistics: 'Completion Requests',
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
  avgTokensPerSecond: 'Average Inference Speed',
  
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
  tokenUsageNote: 'Token usage is only available for non-streaming requests. Streaming requests show timing metrics instead.',
  performanceNote: 'Response time includes both streaming and non-streaming requests. For streamed completion requests, response time is the time until the last token is completed.',
  streamingPerformanceNote: 'These metrics are only available for requests explicitly requesting usage metrics.',
  usageStatsNote: 'Usage stats can be enabled by clients when calling /v1/chat/messages by adding "stream_options": {"include_usage":true} to their payload.',
  
  // Tooltips
  tooltipCompletionRequests: 'Overview of all completion requests, including success/failure rates and total counts',
  tooltipPerformanceMetrics: 'Response time and inference speed metrics for all request types',
  tooltipModelUsage: 'Distribution of requests across different LLM models',
  tooltipRequestSources: 'Origin of requests showing which clients/sources are using the system',
  tooltipInferenceSpeed: 'The rate at which an LLM can process tokens, measured in tokens-per-second (TPS)',
  tooltipResponseTime: 'Total time from request start to completion, including token generation time',
  tooltipTokenUsage: 'Breakdown of prompt, completion, and total tokens used across requests',
  tooltipStreamingMetrics: 'Performance metrics specific to streaming requests with usage enabled',
  tooltipNonStreamingMetrics: 'Performance metrics specific to non-streaming completion requests',
  
  // Token usage section
  promptTokens: 'Prompt Tokens',
  completionTokens: 'Completion Tokens',
  totalTokens: 'Total Tokens',
  promptTokensPerRequest: 'Prompt Tokens per Request',
  completionTokensPerRequest: 'Completion Tokens per Request',
  totalTokensPerRequest: 'Total Tokens per Request',
  tokenUsageNoteStreaming: 'Token usage metrics are only available when clients enable "include_usage" in their streaming requests.',
  requests: 'requests',
  times: 'times',
  tokensPerSecond: 'TPS',
  naStreaming: 'N/A (streaming)',
  
  // Loading and error states
  loadingMetrics: 'Loading metrics...',
  errorLoadingMetrics: 'Error loading metrics:',
  noMetricsData: 'No metrics data available',
  
  // Chart labels
  successfulRequestsLabel: 'Successful Requests',
  failedRequestsLabel: 'Failed Requests',
  requestsChartTitle: 'Requests',
  requestsChartYAxisLabel: 'Number of Requests',
  
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
