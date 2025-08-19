import { Translation } from '../../types';

export const ja: Translation = {
  // App title
  appTitle: 'LLM メトリクスダッシュボード',
  
  // Tab labels
  overview: '概要',
  streamedRequests: 'ストリーミングリクエスト',
  nonStreamedRequests: '非ストリーミングリクエスト',
  
  // Section headers
  basicStatistics: '完了リクエスト',
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
  avgTokensPerSecond: '平均推論速度',

  
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
  tokenUsageNote: 'トークン使用量は非ストリーミングリクエストでのみ利用可能です。ストリーミングリクエストでは代わりにタイミングメトリクスが表示されます。',
  performanceNote: '応答時間にはストリーミングと非ストリーミングの両方のリクエストが含まれます。ストリーミング完了リクエストの場合、応答時間は最後のトークンが完了するまでの時間です。',
  streamingPerformanceNote: 'これらのメトリクスは、使用量メトリクスを明示的に要求するリクエストでのみ利用可能です。',
  usageStatsNote: '使用量統計は、クライアントが/v1/chat/messagesを呼び出す際にペイロードに"stream_options": {"include_usage":true}を追加することで有効にできます。',
  
  // Tooltips
  tooltipCompletionRequests: '成功/失敗率と総数を含む、すべての完了リクエストの概要',
  tooltipPerformanceMetrics: 'すべてのリクエストタイプの応答時間と推論速度メトリクス',
  tooltipModelUsage: '異なるLLMモデル間でのリクエストの分布',
  tooltipRequestSources: 'どのクライアント/ソースがシステムを使用しているかを示すリクエストの起源',
  tooltipInferenceSpeed: 'LLMがトークンを処理できる速度、トークン/秒（TPS）で測定',
  tooltipResponseTime: 'リクエスト開始から完了までの総時間、トークン生成時間を含む',
  tooltipTokenUsage: 'リクエスト全体で使用されるプロンプト、完了、総トークンの内訳',
  tooltipStreamingMetrics: '使用量が有効なストリーミングリクエスト専用のパフォーマンスメトリクス',
  tooltipNonStreamingMetrics: '非ストリーミング完了リクエスト専用のパフォーマンスメトリクス',
  
  // Token usage section
  promptTokens: 'プロンプトトークン',
  completionTokens: '完了トークン',
  totalTokens: '総トークン',
  promptTokensPerRequest: 'リクエストあたりのプロンプトトークン',
  completionTokensPerRequest: 'リクエストあたりの完了トークン',
  totalTokensPerRequest: 'リクエストあたりの総トークン',
  tokenUsageNoteStreaming: 'トークン使用量メトリクスは、クライアントがストリーミングリクエストで"include_usage"を有効にした場合のみ利用可能です。',
  requests: 'リクエスト',
  times: '回',
  tokensPerSecond: 'TPS',
  naStreaming: 'N/A (ストリーミング)',
  
  // Loading and error states
  loadingMetrics: 'メトリクスを読み込み中...',
  errorLoadingMetrics: 'メトリクスの読み込みエラー:',
  noMetricsData: 'メトリクスデータが利用できません',
  
  // Chart labels
  successfulRequestsLabel: '成功したリクエスト',
  failedRequestsLabel: '失敗したリクエスト',
  requestsChartTitle: 'リクエスト',
  requestsChartYAxisLabel: 'リクエスト数',
  
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
