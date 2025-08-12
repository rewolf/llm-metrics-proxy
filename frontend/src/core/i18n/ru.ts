import { Translation } from '../../types';

export const ru: Translation = {
  // App title
  appTitle: 'Панель метрик OpenAI LLM',
  
  // Section headers
  basicStatistics: 'Основная статистика',
  streamingStatistics: 'Статистика потоковой передачи',
  tokenUsage: 'Использование токенов',
  performanceMetrics: 'Метрики производительности',
  modelUsage: 'Использование моделей',
  completionAnalysis: 'Анализ завершения',
  errorAnalysis: 'Анализ ошибок',
  
  // Metric labels
  totalCompletionRequests: 'Общее количество запросов на завершение',
  successfulRequests: 'Успешные запросы',
  failedRequests: 'Неудачные запросы',
  successRate: 'Процент успеха',
  requestsLast24h: 'Запросы (последние 24 часа)',
  streamingRequests: 'Потоковые запросы',
  nonStreamingRequests: 'Непотоковые запросы',
  streamingPercentage: 'Процент потоковой передачи',
  totalTokensUsed: 'Общее количество использованных токенов',
  avgTokensPerRequest: 'Среднее количество токенов на запрос',
  avgResponseTime: 'Среднее время ответа',
  avgTokensPerSecond: 'Среднее количество токенов в секунду',
  lastUpdated: 'Последнее обновление',
  
  // Button text
  refreshNow: 'Обновить сейчас',
  
  // Footer
  footerText: 'Прокси метрик OpenAI LLM',
  
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
  tokenUsageNote: '⚠️ Использование токенов доступно только для непотоковых запросов. Потоковые запросы показывают метрики времени.',
  performanceNote: '📊 Время ответа включает как потоковые, так и непотоковые запросы. Токены в секунду доступны только для непотоковых.',
  requests: 'запросов',
  times: 'раз',
  tokensPerSecond: 'токенов/с',
  naStreaming: 'Н/Д (потоковая передача)',
  
  // Loading and error states
  loadingMetrics: 'Загрузка метрик...',
  errorLoadingMetrics: 'Ошибка загрузки метрик:',
  noMetricsData: 'Данные метрик недоступны'
};
