import { Translation } from '../../types';

export const zh: Translation = {
  // App title
  appTitle: 'OpenAI LLM 指标仪表板',
  
  // Section headers
  basicStatistics: '基础统计',
  streamingStatistics: '流式统计',
  tokenUsage: '令牌使用量',
  performanceMetrics: '性能指标',
  modelUsage: '模型使用情况',
  completionAnalysis: '完成分析',
  errorAnalysis: '错误分析',
  
  // Metric labels
  totalCompletionRequests: '完成请求总数',
  successfulRequests: '成功请求',
  failedRequests: '失败请求',
  successRate: '成功率',
  requestsLast24h: '请求（过去24小时）',
  streamingRequests: '流式请求',
  nonStreamingRequests: '非流式请求',
  streamingPercentage: '流式百分比',
  totalTokensUsed: '使用的令牌总数',
  avgTokensPerRequest: '每个请求的平均令牌数',
  avgResponseTime: '平均响应时间',
  avgTokensPerSecond: '每秒平均令牌数',
  lastUpdated: '最后更新',
  
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
  performanceNote: '📊 响应时间包括流式和非流式请求。每秒令牌数仅适用于非流式。',
  requests: '请求',
  times: '次',
  tokensPerSecond: '令牌/秒',
  naStreaming: 'N/A（流式）',
  
  // Loading and error states
  loadingMetrics: '正在加载指标...',
  errorLoadingMetrics: '加载指标时出错:',
  noMetricsData: '没有可用的指标数据'
};
