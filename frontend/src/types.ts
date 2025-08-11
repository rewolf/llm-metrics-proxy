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
