import { Translation } from '../../types';

export const ko: Translation = {
  // App title
  appTitle: 'LLM 메트릭 대시보드',
  
  // Tab labels
  overview: '개요',
  streamedRequests: '스트리밍 요청',
  nonStreamedRequests: '비스트리밍 요청',
  
  // Section headers
  basicStatistics: '기본 통계',
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
  avgTokensPerSecond: '초당 평균 토큰 수',
  lastUpdated: '마지막 업데이트',
  
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
  
  // Button text
  refreshNow: '지금 새로고침',
  
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
  tokenUsageNote: '⚠️ 토큰 사용량은 비스트리밍 요청에서만 사용할 수 있습니다. 스트리밍 요청은 시간 메트릭을 대신 표시합니다.',
  performanceNote: '📊 응답 시간에는 스트리밍과 비스트리밍 요청이 모두 포함됩니다. 첫 번째 토큰까지의 시간은 스트리밍 성능을 보여줍니다.',
  streamingPerformanceNote: '📊 이러한 메트릭은 사용량 메트릭을 명시적으로 요청하는 요청에서만 사용할 수 있습니다.',
  requests: '요청',
  times: '회',
  tokensPerSecond: '토큰/초',
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
