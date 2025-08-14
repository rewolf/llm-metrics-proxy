import { Translation } from '../../types';

export const es: Translation = {
  // App title
  appTitle: 'Panel de Métricas LLM',
  
  // Tab labels
  overview: 'Resumen',
  streamedRequests: 'Solicitudes en Streaming',
  nonStreamedRequests: 'Solicitudes No-Streaming',
  
  // Section headers
  basicStatistics: 'Estadísticas Básicas',
  streamingStatistics: 'Estadísticas de Streaming',
  tokenUsage: 'Uso de Tokens',
  performanceMetrics: 'Métricas de Rendimiento',
  modelUsage: 'Uso de Modelos',
  completionAnalysis: 'Análisis de Completado',
  errorAnalysis: 'Análisis de Errores',
  requestSources: 'Fuentes de Solicitudes',
  
  // Metric labels
  totalCompletionRequests: 'Total de Solicitudes de Completado',
  successfulRequests: 'Solicitudes Exitosas',
  failedRequests: 'Solicitudes Fallidas',
  successRate: 'Tasa de Éxito',
  streamingRequests: 'Solicitudes en Streaming',
  nonStreamingRequests: 'Solicitudes No-Streaming',
  streamingPercentage: 'Porcentaje de Streaming',
  totalTokensUsed: 'Total de Tokens Utilizados',
  avgTokensPerRequest: 'Promedio de Tokens por Solicitud',
  avgResponseTime: 'Tiempo de Respuesta Promedio',
  avgTokensPerSecond: 'Promedio de Tokens por Segundo',

  
  // Streaming-specific metrics
  timeToFirstToken: 'Tiempo hasta el Primer Token',
  timeToLastToken: 'Tiempo hasta el Último Token',
  completionDuration: 'Duración de Completado',
  streamedRequestsCount: 'Solicitudes en Streaming',
  streamedRequestsPercent: 'Porcentaje del Total',
  
  // Non-streaming specific metrics
  nonStreamedRequestsCount: 'Solicitudes No-Streaming',
  nonStreamedRequestsPercent: 'Porcentaje del Total',
  tokensPerRequest: 'Tokens por Solicitud',
  

  
  // Footer
  footerText: 'Proxy de Métricas LLM',
  
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
  tokenUsageNote: 'El uso de tokens solo está disponible para solicitudes no-streaming. Las solicitudes en streaming muestran métricas de tiempo en su lugar.',
  performanceNote: 'El tiempo de respuesta incluye tanto solicitudes en streaming como no-streaming. El tiempo hasta el primer token muestra el rendimiento del streaming.',
  streamingPerformanceNote: 'Estas métricas solo están disponibles para solicitudes que solicitan explícitamente métricas de uso.',
  usageStatsNote: 'Las estadísticas de uso pueden ser habilitadas por los clientes al llamar /v1/chat/messages agregando "stream_options": {"include_usage":true} a su payload.',
  
  // Token usage section
  promptTokens: 'Tokens de Entrada',
  completionTokens: 'Tokens de Completado',
  totalTokens: 'Total de Tokens',
  promptTokensPerRequest: 'Tokens de Entrada por Solicitud',
  completionTokensPerRequest: 'Tokens de Completado por Solicitud',
  totalTokensPerRequest: 'Total de Tokens por Solicitud',
  tokenUsageNoteStreaming: 'Las métricas de uso de tokens solo están disponibles cuando los clientes habilitan "include_usage" en sus solicitudes de streaming.',
  requests: 'solicitudes',
  times: 'veces',
  tokensPerSecond: 'tokens/s',
  naStreaming: 'N/A (streaming)',
  
  // Loading and error states
  loadingMetrics: 'Cargando métricas...',
  errorLoadingMetrics: 'Error al cargar métricas:',
  noMetricsData: 'No hay datos de métricas disponibles',
  
  // Timeframe selector
  selectTimeframe: 'Seleccionar Período',
  timeframe1h: '1 Hora',
  timeframe6h: '6 Horas',
  timeframe12h: '12 Horas',
  timeframe1d: '1 Día',
  timeframe1w: '1 Semana',
  timeframe1mo: '1 Mes',
  timeframeAll: 'Todo el Tiempo'
};
