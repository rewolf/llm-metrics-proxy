import { Translation } from '../../types';

export const ja: Translation = {
  // App title
  appTitle: 'LLM メトリクスダッシュボード',
  
  // Tab labels
  overview: '概要',
  streamedRequests: 'ストリーミングリクエスト',
  nonStreamedRequests: '非ストリーミングリクエスト',
  
  // Section headers
  basicStatistics: '基本統計',
  streamingStatistics: 'ストリーミング統計',
  tokenUsage: 'トークン使用量',
  performanceMetrics: 'パフォーマンスメトリクス',
  modelUsage: 'モデル使用状況',
  completionAnalysis: '完了分析',
  errorAnalysis: 'エラー分析',
  requestSources: 'リクエストソース',
  
  // Metric labels
  totalCompletionRequests: '完了リクエスト総数',
  successfulRequests: '成功リクエスト',
  failedRequests: '失敗リクエスト',
  successRate: '成功率',
  streamingRequests: 'ストリーミングリクエスト',
  nonStreamingRequests: '非ストリーミングリクエスト',
  streamingPercentage: 'ストリーミング割合',
  totalTokensUsed: '使用トークン総数',
  avgTokensPerRequest: 'リクエストあたりの平均トークン数',
  avgResponseTime: '平均応答時間',
  avgTokensPerSecond: '1秒あたりの平均トークン数',

  
  // Streaming-specific metrics
  timeToFirstToken: '最初のトークンまでの時間',
  timeToLastToken: '最後のトークンまでの時間',
  completionDuration: '完了時間',
  streamedRequestsCount: 'ストリーミングリクエスト',
  streamedRequestsPercent: '総数に対する割合',
  
  // Non-streaming specific metrics
  nonStreamedRequestsCount: '非ストリーミングリクエスト',
  nonStreamedRequestsPercent: '総数に対する割合',
  tokensPerRequest: 'リクエストあたりのトークン数',
  

  
  // Footer
  footerText: 'LLM メトリクスプロキシ',
  
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
  tokenUsageNote: 'トークン使用量は非ストリーミングリクエストでのみ利用可能です。ストリーミングリクエストでは時間メトリクスが表示されます。',
  performanceNote: '応答時間にはストリーミングと非ストリーミングの両方のリクエストが含まれます。最初のトークンまでの時間はストリーミングのパフォーマンスを示します。',
  streamingPerformanceNote: 'これらのメトリクスは、使用量メトリクスを明示的に要求するリクエストでのみ利用可能です。',
  usageStatsNote: '使用統計は、クライアントが/v1/chat/messagesを呼び出す際に、ペイロードに"stream_options": {"include_usage":true}を追加することで有効にできます。',
  requests: 'リクエスト',
  times: '回',
  tokensPerSecond: 'トークン/秒',
  naStreaming: 'N/A (ストリーミング)',
  
  // Loading and error states
  loadingMetrics: 'メトリクスを読み込み中...',
  errorLoadingMetrics: 'メトリクスの読み込みエラー:',
  noMetricsData: 'メトリクスデータが利用できません',
  
  // Timeframe selector
  selectTimeframe: '期間を選択',
  timeframe1h: '1時間',
  timeframe6h: '6時間',
  timeframe12h: '12時間',
  timeframe1d: '1日',
  timeframe1w: '1週間',
  timeframe1mo: '1ヶ月',
  timeframeAll: '全期間'
};
