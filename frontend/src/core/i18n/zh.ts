import { Translation } from '../../types';

export const zh: Translation = {
  // App title
  appTitle: 'LLM 指标仪表板',
  
  // Tab labels
  overview: '概览',
  streamedRequests: '流式请求',
  nonStreamedRequests: '非流式请求',
  
  // Section headers
  basicStatistics: '完成请求',
  streamingStatistics: '流式统计',
  tokenUsage: '令牌使用量',
  performanceMetrics: '性能指标',
  modelUsage: '模型使用情况',
  completionAnalysis: '完成分析',
  errorAnalysis: '错误分析',
  requestSources: '请求来源',
  
  // Metric labels
  totalCompletionRequests: '完成请求总数',
  successfulRequests: '成功请求',
  failedRequests: '失败请求',
  successRate: '成功率',
  streamingRequests: '流式请求',
  nonStreamingRequests: '非流式请求',
  streamingPercentage: '流式比例',
  totalTokensUsed: '使用令牌总数',
  avgTokensPerRequest: '每个请求的平均令牌数',
  avgResponseTime: '平均响应时间',
  avgTokensPerSecond: '平均推理速度',

  
  // Streaming-specific metrics
  timeToFirstToken: '到第一个令牌的时间',
  timeToLastToken: '到最后一个令牌的时间',
  completionDuration: '完成持续时间',
  streamedRequestsCount: '流式请求',
  streamedRequestsPercent: '占总数的百分比',
  
  // Non-streaming specific metrics
  nonStreamedRequestsCount: '非流式请求',
  nonStreamedRequestsPercent: '占总数的百分比',
  tokensPerRequest: '每个请求的令牌数',
  

  
  // Footer
  footerText: 'LLM 指标代理',
  
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
  tokenUsageNote: '令牌使用量仅适用于非流式请求。流式请求显示时间指标。',
  performanceNote: '响应时间包括流式和非流式请求。对于流式完成请求，响应时间是直到最后一个令牌完成的时间。',
  streamingPerformanceNote: '这些指标仅适用于明确请求使用量指标的请求。',
  usageStatsNote: '使用量统计可以通过客户端在调用/v1/chat/messages时在payload中添加"stream_options": {"include_usage":true}来启用。',
  
  // Tooltips
  tooltipCompletionRequests: '所有完成请求的概览，包括成功/失败率和总计数',
  tooltipPerformanceMetrics: '所有请求类型的响应时间和推理速度指标',
  tooltipModelUsage: '不同LLM模型间请求的分布',
  tooltipRequestSources: '请求的来源，显示哪些客户端/源正在使用系统',
  tooltipInferenceSpeed: 'LLM处理令牌的速率，以每秒令牌数（TPS）测量',
  tooltipResponseTime: '从请求开始到完成的总时间，包括令牌生成时间',
  tooltipTokenUsage: '请求中使用的提示、完成和总令牌的细分',
  tooltipStreamingMetrics: '启用使用量的流式请求专用的性能指标',
  tooltipNonStreamingMetrics: '非流式完成请求专用的性能指标',
  
  // Token usage section
  promptTokens: '提示令牌',
  completionTokens: '完成令牌',
  totalTokens: '总令牌',
  promptTokensPerRequest: '每个请求的提示令牌',
  completionTokensPerRequest: '每个请求的完成令牌',
  totalTokensPerRequest: '每个请求的总令牌',
  tokenUsageNoteStreaming: '令牌使用量指标仅在客户端在流式请求中启用"include_usage"时可用。',
  requests: '请求',
  times: '次',
  tokensPerSecond: 'TPS',
  naStreaming: 'N/A (流式)',
  
  // Loading and error states
  loadingMetrics: '正在加载指标...',
  errorLoadingMetrics: '加载指标时出错:',
  noMetricsData: '没有可用的指标数据',
  
  // Chart labels
  successfulRequestsLabel: '成功的请求',
  failedRequestsLabel: '失败的请求',
  requestsChartTitle: '请求',
  requestsChartYAxisLabel: '请求数量',
  
  // Timeframe selector
  selectTimeframe: '选择时间段',
  timeframe1h: '1小时',
  timeframe6h: '6小时',
  timeframe12h: '12小时',
  timeframe1d: '1天',
  timeframe1w: '1周',
  timeframe1mo: '1个月',
  timeframeAll: '全部时间'
};
