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

export interface OriginUsage {
  origin: string;
  count: number;
}

export interface CompletionRequestData {
  timestamp: string;
  time_to_first_token_ms: number | null;
  time_to_last_token_ms: number | null;
  is_streaming: boolean;
  success: boolean;
  message_count: number | null;
  prompt_tokens: number | null;
  tokens: {
    total: number | null;
    prompt: number | null;
    completion: number | null;
  };
}

export interface Timeframe {
  id: string;
  label: string;
  hours: number;
}

// i18n types
export type Language = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh' | 'ru' | 'ko';

export interface Translation {
  // App title
  appTitle: string;
  
  // Tab labels
  overview: string;
  streamedRequests: string;
  nonStreamedRequests: string;
  
  // Section headers
  basicStatistics: string;
  streamingStatistics: string;
  tokenUsage: string;
  performanceMetrics: string;
  modelUsage: string;
  completionAnalysis: string;
  errorAnalysis: string;
  requestSources: string;
  
  // Metric labels
  totalCompletionRequests: string;
  successfulRequests: string;
  failedRequests: string;
  successRate: string;
  streamingRequests: string;
  nonStreamingRequests: string;
  streamingPercentage: string;
  totalTokensUsed: string;
  avgTokensPerRequest: string;
  avgResponseTime: string;
  avgTokensPerSecond: string;
  
  // Streaming-specific metrics
  timeToFirstToken: string;
  timeToLastToken: string;
  completionDuration: string;
  streamedRequestsCount: string;
  streamedRequestsPercent: string;
  
  // Non-streaming specific metrics
  nonStreamedRequestsCount: string;
  nonStreamedRequestsPercent: string;
  tokensPerRequest: string;
  
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
  streamingPerformanceNote: string;
  usageStatsNote: string;
  requests: string;
  times: string;
  tokensPerSecond: string;
  naStreaming: string;
  
  // Loading and error states
  loadingMetrics: string;
  errorLoadingMetrics: string;
  noMetricsData: string;
  
  // Timeframe selector
  selectTimeframe: string;
  timeframe1h: string;
  timeframe6h: string;
  timeframe12h: string;
  timeframe1d: string;
  timeframe1w: string;
  timeframe1mo: string;
  timeframeAll: string;
}

export interface Metrics {
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
  
  // Streaming stats
  streaming_requests: number;
  non_streaming_requests: number;
  
  // Token usage (non-streaming only)
  total_tokens_used: number | null;
  avg_tokens_per_request: number | null;
  
  // Performance
  avg_response_time_ms: number;
  avg_tokens_per_second: number | null;
  
  // Streaming-specific metrics
  avg_time_to_first_token_ms: number | null;
  avg_time_to_last_token_ms: number | null;
  avg_completion_duration_ms: number | null;
  
  // Model usage
  top_models: ModelUsage[];
  
  // Origin usage
  top_origins: OriginUsage[];
  
  // Completion analysis
  finish_reasons: FinishReason[];
  error_types: ErrorType[];
  
  timestamp: string;
}
