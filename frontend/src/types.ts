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
  is_streaming: boolean;
  success: boolean;
  error_type?: string;
  message_count?: number;
  timing: {
    time_to_first_token_ms?: number;
    time_to_last_token_ms?: number;
    response_time_ms?: number;
  };
  tokens: {
    total?: number;
    prompt?: number;
    completion?: number;
  };
  model?: string;
  origin?: string;
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
  
  // Tooltips
  tooltipCompletionRequests: string;
  tooltipPerformanceMetrics: string;
  tooltipModelUsage: string;
  tooltipRequestSources: string;
  tooltipInferenceSpeed: string;
  tooltipResponseTime: string;
  tooltipTokenUsage: string;
  tooltipStreamingMetrics: string;
  tooltipNonStreamingMetrics: string;
  
  // Token usage section
  promptTokens: string;
  completionTokens: string;
  totalTokens: string;
  promptTokensPerRequest: string;
  completionTokensPerRequest: string;
  totalTokensPerRequest: string;
  tokenUsageNoteStreaming: string;
  
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

export interface RequestsSummary {
  total: number;
  successful: number;
  failed: number;
  avg_response_time_ms: number;
}

export interface TokenMetrics {
  reported_count: number;
  total: number;
  prompt_total: number;
  completion_total: number;
  avg_tokens_per_second?: number;
}

export interface StreamedRequests {
  total: number;
  successful: number;
  failed: number;
  tokens: TokenMetrics;
  error_types: { [key: string]: number };
  avg_response_time_ms: number;
  avg_time_to_first_token_ms?: number;
  avg_time_to_last_token_ms?: number;
  avg_completion_duration_ms?: number;
}

export interface NonStreamedRequests {
  total: number;
  successful: number;
  failed: number;
  tokens: TokenMetrics;
  error_types: { [key: string]: number };
  avg_time_to_first_token_ms?: number;
  avg_time_to_last_token_ms?: number;
  avg_completion_duration_ms?: number;
}

export interface Requests {
  total: RequestsSummary;
  streamed: StreamedRequests;
  non_streamed: NonStreamedRequests;
}

export interface Metrics {
  timestamp: string;
  requests: Requests;
  model_distribution: { [key: string]: number };
  origin_distribution: { [key: string]: number };
}
