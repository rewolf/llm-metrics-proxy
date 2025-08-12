import { Translation } from '../../types';

export const ja: Translation = {
  // App title
  appTitle: 'OpenAI LLM メトリクスダッシュボード',
  
  // Section headers
  basicStatistics: '基本統計',
  streamingStatistics: 'ストリーミング統計',
  tokenUsage: 'トークン使用量',
  performanceMetrics: 'パフォーマンスメトリクス',
  modelUsage: 'モデル使用状況',
  completionAnalysis: '完了分析',
  errorAnalysis: 'エラー分析',
  
  // Metric labels
  totalCompletionRequests: '完了リクエスト総数',
  successfulRequests: '成功リクエスト',
  failedRequests: '失敗リクエスト',
  successRate: '成功率',
  requestsLast24h: 'リクエスト（過去24時間）',
  streamingRequests: 'ストリーミングリクエスト',
  nonStreamingRequests: '非ストリーミングリクエスト',
  streamingPercentage: 'ストリーミング割合',
  totalTokensUsed: '使用トークン総数',
  avgTokensPerRequest: 'リクエストあたりの平均トークン数',
  avgResponseTime: '平均応答時間',
  avgTokensPerSecond: '1秒あたりの平均トークン数',
  lastUpdated: '最終更新',
  
  // Button text
  refreshNow: '今すぐ更新',
  
  // Footer
  footerText: 'OpenAI LLM メトリクスプロキシ',
  
  // Language names
  english: 'English',
  spanish: 'Español',
  french: 'Français',
  german: 'Deutsch',
  japanese: '日本語',
  
  // Notes and warnings
  tokenUsageNote: '⚠️ トークン使用量は非ストリーミングリクエストでのみ利用可能です。ストリーミングリクエストでは時間メトリクスが表示されます。',
  performanceNote: '📊 応答時間にはストリーミングと非ストリーミングの両方のリクエストが含まれます。1秒あたりのトークン数は非ストリーミングでのみ利用可能です。',
  requests: 'リクエスト',
  times: '回',
  tokensPerSecond: 'トークン/秒',
  naStreaming: 'N/A（ストリーミング）',
  
  // Loading and error states
  loadingMetrics: 'メトリクスを読み込み中...',
  errorLoadingMetrics: 'メトリクスの読み込みエラー:',
  noMetricsData: 'メトリクスデータが利用できません'
};
