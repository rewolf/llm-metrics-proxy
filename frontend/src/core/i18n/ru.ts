import { Translation } from '../../types';

export const ru: Translation = {
  // App title
  appTitle: 'Панель метрик LLM',
  
  // Tab labels
  overview: 'Обзор',
  streamedRequests: 'Потоковые запросы',
  nonStreamedRequests: 'Непотоковые запросы',
  
  // Section headers
  basicStatistics: 'Основная статистика',
  streamingStatistics: 'Статистика потоков',
  tokenUsage: 'Использование токенов',
  performanceMetrics: 'Метрики производительности',
  modelUsage: 'Использование моделей',
  completionAnalysis: 'Анализ завершения',
  errorAnalysis: 'Анализ ошибок',
  requestSources: 'Источники запросов',
  
  // Metric labels
  totalCompletionRequests: 'Общее количество запросов на завершение',
  successfulRequests: 'Успешные запросы',
  failedRequests: 'Неудачные запросы',
  successRate: 'Процент успеха',
  streamingRequests: 'Потоковые запросы',
  nonStreamingRequests: 'Непотоковые запросы',
  streamingPercentage: 'Процент потоков',
  totalTokensUsed: 'Общее количество использованных токенов',
  avgTokensPerRequest: 'Среднее количество токенов на запрос',
  avgResponseTime: 'Среднее время ответа',
  avgTokensPerSecond: 'Среднее количество токенов в секунду',

  
  // Streaming-specific metrics
  timeToFirstToken: 'Время до первого токена',
  timeToLastToken: 'Время до последнего токена',
  completionDuration: 'Продолжительность завершения',
  streamedRequestsCount: 'Потоковые запросы',
  streamedRequestsPercent: 'Процент от общего числа',
  
  // Non-streaming specific metrics
  nonStreamedRequestsCount: 'Непотоковые запросы',
  nonStreamedRequestsPercent: 'Процент от общего числа',
  tokensPerRequest: 'Токены на запрос',
  

  
  // Footer
  footerText: 'Прокси метрик LLM',
  
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
  tokenUsageNote: 'Использование токенов доступно только для непотоковых запросов. Потоковые запросы показывают метрики времени.',
  performanceNote: 'Время ответа включает как потоковые, так и непотоковые запросы. Время до первого токена показывает производительность потоков.',
  streamingPerformanceNote: 'Эти метрики доступны только для запросов, которые явно запрашивают метрики использования.',
  usageStatsNote: 'Статистика использования может быть включена клиентами при вызове /v1/chat/messages, добавив "stream_options": {"include_usage":true} в их payload.',
  requests: 'запросов',
  times: 'раз',
  tokensPerSecond: 'токенов/с',
  naStreaming: 'N/A (поток)',
  
  // Loading and error states
  loadingMetrics: 'Загрузка метрик...',
  errorLoadingMetrics: 'Ошибка загрузки метрик:',
  noMetricsData: 'Данные метрик недоступны',
  
  // Timeframe selector
  selectTimeframe: 'Выбрать Период',
  timeframe1h: '1 Час',
  timeframe6h: '6 Часов',
  timeframe12h: '12 Часов',
  timeframe1d: '1 День',
  timeframe1w: '1 Неделя',
  timeframe1mo: '1 Месяц',
  timeframeAll: 'Все Время'
};
