import { Translation } from '../../types';

export const zh: Translation = {
  // App title
  appTitle: 'OpenAI LLM 指标仪表板',
  
  // Tab labels
  overview: '概览',
  streamedRequests: '流式请求',
  nonStreamedRequests: '非流式请求',
  
  // Section headers
  basicStatistics: '基本统计',
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
  avgTokensPerSecond: '每秒平均令牌数',
  lastUpdated: '最后更新',
  
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
  
  // Button text
  refreshNow: '立即刷新',
  
  // Footer
  footerText: 'OpenAI LLM 指标代理',
  
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
  tokenUsageNote: '⚠️ 令牌使用量仅适用于非流式请求。流式请求显示时间指标。',
  performanceNote: '📊 响应时间包括流式和非流式请求。到第一个令牌的时间显示流式性能。',
  streamingPerformanceNote: '📊 这些指标仅适用于明确请求使用指标的请求。',
  requests: '请求',
  times: '次',
  tokensPerSecond: '令牌/秒',
  naStreaming: 'N/A (流式)',
  
  // Loading and error states
  loadingMetrics: '正在加载指标...',
  errorLoadingMetrics: '加载指标时出错:',
  noMetricsData: '没有可用的指标数据',
  
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
