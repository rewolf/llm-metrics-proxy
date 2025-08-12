export interface ModelUsage {
  model: string;
  count: number;
}

export interface FinishReason {
  reason: string;
  count: number;
}

export interface ErrorType {
  type: string;
  count: number;
}

// i18n types
export type Language = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh' | 'ru' | 'ko';

export interface Translation {
  // App title
  appTitle: string;
  
  // Section headers
  basicStatistics: string;
  streamingStatistics: string;
  tokenUsage: string;
  performanceMetrics: string;
  modelUsage: string;
  completionAnalysis: string;
  errorAnalysis: string;
  
  // Metric labels
  totalCompletionRequests: string;
  successfulRequests: string;
  failedRequests: string;
  successRate: string;
  requestsLast24h: string;
  streamingRequests: string;
  nonStreamingRequests: string;
  streamingPercentage: string;
  totalTokensUsed: string;
  avgTokensPerRequest: string;
  avgResponseTime: string;
  avgTokensPerSecond: string;
  lastUpdated: string;
  
  // Button text
  refreshNow: string;
  
  // Footer
  footerText: string;
  
  // Language names
  english: string;
  spanish: string;
  french: string;
  german: string;
  japanese: string;
  chinese: string;
  russian: string;
  korean: string;
  
  // Notes and warnings
  tokenUsageNote: string;
  performanceNote: string;
  requests: string;
  times: string;
  tokensPerSecond: string;
  naStreaming: string;
  
  // Loading and error states
  loadingMetrics: string;
  errorLoadingMetrics: string;
  noMetricsData: string;
}

export interface Metrics {
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
  recent_requests_24h: number;
  
  // Streaming stats
  streaming_requests: number;
  non_streaming_requests: number;
  
  // Token usage
  total_tokens_used: number | null;
  avg_tokens_per_request: number | null;
  
  // Performance
  avg_response_time_ms: number;
  avg_tokens_per_second: number | null;
  
  // Model usage
  top_models: ModelUsage[];
  
  // Completion analysis
  finish_reasons: FinishReason[];
  error_types: ErrorType[];
  
  timestamp: string;
}
