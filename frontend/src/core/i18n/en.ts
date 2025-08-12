import { Translation } from '../../types';

export const en: Translation = {
  // App title
  appTitle: 'OpenAI LLM Metrics Dashboard',
  
  // Section headers
  basicStatistics: 'Basic Statistics',
  streamingStatistics: 'Streaming Statistics',
  tokenUsage: 'Token Usage',
  performanceMetrics: 'Performance Metrics',
  modelUsage: 'Model Usage',
  completionAnalysis: 'Completion Analysis',
  errorAnalysis: 'Error Analysis',
  
  // Metric labels
  totalCompletionRequests: 'Total Completion Requests',
  successfulRequests: 'Successful Requests',
  failedRequests: 'Failed Requests',
  successRate: 'Success Rate',
  requestsLast24h: 'Requests (Last 24h)',
  streamingRequests: 'Streaming Requests',
  nonStreamingRequests: 'Non-Streaming Requests',
  streamingPercentage: 'Streaming Percentage',
  totalTokensUsed: 'Total Tokens Used',
  avgTokensPerRequest: 'Average Tokens per Request',
  avgResponseTime: 'Average Response Time',
  avgTokensPerSecond: 'Average Tokens per Second',
  lastUpdated: 'Last Updated',
  
  // Button text
  refreshNow: 'Refresh Now',
  
  // Footer
  footerText: 'OpenAI LLM Metrics Proxy',
  
  // Language names
  english: 'English',
  spanish: 'Español',
  french: 'Français',
  german: 'Deutsch',
  japanese: '日本語',
  
  // Notes and warnings
  tokenUsageNote: '⚠️ Token usage is only available for non-streaming requests. Streaming requests show timing metrics instead.',
  performanceNote: '📊 Response time includes both streaming and non-streaming requests. Tokens per second only available for non-streaming.',
  requests: 'requests',
  times: 'times',
  tokensPerSecond: 'tokens/s',
  naStreaming: 'N/A (streaming)',
  
  // Loading and error states
  loadingMetrics: 'Loading metrics...',
  errorLoadingMetrics: 'Error loading metrics:',
  noMetricsData: 'No metrics data available'
};
