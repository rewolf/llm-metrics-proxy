import { Translation } from '../../types';

export const ko: Translation = {
  // App title
  appTitle: 'LLM 메트릭 대시보드',
  
  // Tab labels
  overview: '개요',
  streamedRequests: '스트리밍 요청',
  nonStreamedRequests: '비스트리밍 요청',
  
  // Section headers
  basicStatistics: '완료 요청',
  streamingStatistics: '스트리밍 통계',
  tokenUsage: '토큰 사용량',
  performanceMetrics: '성능 메트릭',
  modelUsage: '모델 사용 현황',
  completionAnalysis: '완료 분석',
  errorAnalysis: '오류 분석',
  requestSources: '요청 소스',
  
  // Metric labels
  totalCompletionRequests: '완료 요청 총수',
  successfulRequests: '성공한 요청',
  failedRequests: '실패한 요청',
  successRate: '성공률',
  streamingRequests: '스트리밍 요청',
  nonStreamingRequests: '비스트리밍 요청',
  streamingPercentage: '스트리밍 비율',
  totalTokensUsed: '사용된 토큰 총수',
  avgTokensPerRequest: '요청당 평균 토큰 수',
  avgResponseTime: '평균 응답 시간',
  avgTokensPerSecond: '평균 추론 속도',

  
  // Streaming-specific metrics
  timeToFirstToken: '첫 번째 토큰까지의 시간',
  timeToLastToken: '마지막 토큰까지의 시간',
  completionDuration: '완료 지속 시간',
  streamedRequestsCount: '스트리밍 요청',
  streamedRequestsPercent: '전체 대비 비율',
  
  // Non-streaming specific metrics
  nonStreamedRequestsCount: '비스트리밍 요청',
  nonStreamedRequestsPercent: '전체 대비 비율',
  tokensPerRequest: '요청당 토큰 수',
  

  
  // Footer
  footerText: 'LLM 메트릭 프록시',
  
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
  tokenUsageNote: '토큰 사용량은 비스트리밍 요청에서만 사용할 수 있습니다. 스트리밍 요청은 대신 시간 메트릭을 표시합니다.',
  performanceNote: '응답 시간에는 스트리밍 및 비스트리밍 요청이 모두 포함됩니다. 스트리밍 완료 요청의 경우 응답 시간은 마지막 토큰이 완료될 때까지의 시간입니다.',
  streamingPerformanceNote: '이 메트릭은 사용량 메트릭을 명시적으로 요청하는 요청에서만 사용할 수 있습니다.',
  usageStatsNote: '사용량 통계는 클라이언트가 /v1/chat/messages를 호출할 때 페이로드에 "stream_options": {"include_usage":true}를 추가하여 활성화할 수 있습니다.',
  
  // Tooltips
  tooltipCompletionRequests: '성공/실패율과 총 수를 포함한 모든 완료 요청의 개요',
  tooltipPerformanceMetrics: '모든 요청 유형에 대한 응답 시간 및 추론 속도 메트릭',
  tooltipModelUsage: '다양한 LLM 모델에 걸친 요청 분포',
  tooltipRequestSources: '어떤 클라이언트/소스가 시스템을 사용하고 있는지 보여주는 요청의 출처',
  tooltipInferenceSpeed: 'LLM이 토큰을 처리할 수 있는 속도, 초당 토큰(TPS)으로 측정',
  tooltipResponseTime: '요청 시작부터 완료까지의 총 시간, 토큰 생성 시간 포함',
  tooltipTokenUsage: '요청에 사용된 프롬프트, 완료 및 총 토큰의 세분화',
  tooltipStreamingMetrics: '사용량이 활성화된 스트리밍 요청 전용 성능 메트릭',
  tooltipNonStreamingMetrics: '비스트리밍 완료 요청 전용 성능 메트릭',
  
  // Token usage section
  promptTokens: '프롬프트 토큰',
  completionTokens: '완성 토큰',
  totalTokens: '총 토큰',
  promptTokensPerRequest: '요청당 프롬프트 토큰',
  completionTokensPerRequest: '요청당 완성 토큰',
  totalTokensPerRequest: '요청당 총 토큰',
  tokenUsageNoteStreaming: '토큰 사용량 메트릭은 클라이언트가 스트리밍 요청에서 "include_usage"를 활성화한 경우에만 사용할 수 있습니다.',
  requests: '요청',
  times: '회',
  tokensPerSecond: 'TPS',
  naStreaming: 'N/A (스트리밍)',
  
  // Loading and error states
  loadingMetrics: '메트릭을 로딩 중...',
  errorLoadingMetrics: '메트릭 로딩 오류:',
  noMetricsData: '사용 가능한 메트릭 데이터가 없습니다',
  
  // Timeframe selector
  selectTimeframe: '기간 선택',
  timeframe1h: '1시간',
  timeframe6h: '6시간',
  timeframe12h: '12시간',
  timeframe1d: '1일',
  timeframe1w: '1주',
  timeframe1mo: '1개월',
  timeframeAll: '전체 기간'
};
