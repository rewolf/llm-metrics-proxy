import { Translation } from '../../types';

export const ko: Translation = {
  // App title
  appTitle: 'OpenAI LLM 메트릭 대시보드',
  
  // Section headers
  basicStatistics: '기본 통계',
  streamingStatistics: '스트리밍 통계',
  tokenUsage: '토큰 사용량',
  performanceMetrics: '성능 메트릭',
  modelUsage: '모델 사용 현황',
  completionAnalysis: '완료 분석',
  errorAnalysis: '오류 분석',
  
  // Metric labels
  totalCompletionRequests: '완료 요청 총수',
  successfulRequests: '성공한 요청',
  failedRequests: '실패한 요청',
  successRate: '성공률',
  requestsLast24h: '요청 (지난 24시간)',
  streamingRequests: '스트리밍 요청',
  nonStreamingRequests: '비스트리밍 요청',
  streamingPercentage: '스트리밍 비율',
  totalTokensUsed: '사용된 토큰 총수',
  avgTokensPerRequest: '요청당 평균 토큰 수',
  avgResponseTime: '평균 응답 시간',
  avgTokensPerSecond: '초당 평균 토큰 수',
  lastUpdated: '마지막 업데이트',
  
  // Button text
  refreshNow: '지금 새로고침',
  
  // Footer
  footerText: 'OpenAI LLM 메트릭 프록시',
  
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
  tokenUsageNote: '⚠️ 토큰 사용량은 비스트리밍 요청에서만 사용할 수 있습니다. 스트리밍 요청은 시간 메트릭을 표시합니다.',
  performanceNote: '📊 응답 시간에는 스트리밍과 비스트리밍 요청이 모두 포함됩니다. 초당 토큰 수는 비스트리밍에서만 사용할 수 있습니다.',
  requests: '요청',
  times: '회',
  tokensPerSecond: '토큰/초',
  naStreaming: 'N/A (스트리밍)',
  
  // Loading and error states
  loadingMetrics: '메트릭을 로딩 중...',
  errorLoadingMetrics: '메트릭 로딩 오류:',
  noMetricsData: '사용할 수 있는 메트릭 데이터가 없습니다'
};
