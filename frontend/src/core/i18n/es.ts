import { Translation } from '../../types';

export const es: Translation = {
  // App title
  appTitle: 'Panel de Métricas LLM',
  
  // Tab labels
  overview: 'Resumen',
  streamedRequests: 'Solicitudes en Streaming',
  nonStreamedRequests: 'Solicitudes No-Streaming',
  
  // Section headers
  basicStatistics: 'Solicitudes de Completado',
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
  avgTokensPerSecond: 'Velocidad Promedio de Inferencia',

  
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
  tokenUsageNote: 'El uso de tokens solo está disponible para solicitudes no streaming. Las solicitudes streaming muestran métricas de tiempo en su lugar.',
  performanceNote: 'El tiempo de respuesta incluye tanto solicitudes streaming como no streaming. Para solicitudes de completado streaming, el tiempo de respuesta es el tiempo hasta que se complete el último token.',
  streamingPerformanceNote: 'Estas métricas solo están disponibles para solicitudes que solicitan explícitamente métricas de uso.',
  usageStatsNote: 'Las estadísticas de uso pueden ser habilitadas por los clientes al llamar a /v1/chat/messages agregando "stream_options": {"include_usage":true} a su payload.',
  
  // Tooltips
  tooltipCompletionRequests: 'Resumen de todas las solicitudes de completado, incluyendo tasas de éxito/fallo y conteos totales',
  tooltipPerformanceMetrics: 'Métricas de tiempo de respuesta y velocidad de inferencia para todos los tipos de solicitudes',
  tooltipModelUsage: 'Distribución de solicitudes a través de diferentes modelos LLM',
  tooltipRequestSources: 'Origen de las solicitudes mostrando qué clientes/fuentes están usando el sistema',
  tooltipInferenceSpeed: 'La velocidad a la que un LLM puede procesar tokens, medida en tokens-por-segundo (TPS)',
  tooltipResponseTime: 'Tiempo total desde el inicio de la solicitud hasta la finalización, incluyendo el tiempo de generación de tokens',
  tooltipTokenUsage: 'Desglose de tokens de prompt, completado y totales utilizados en las solicitudes',
  tooltipStreamingMetrics: 'Métricas de rendimiento específicas para solicitudes streaming con uso habilitado',
  tooltipNonStreamingMetrics: 'Métricas de rendimiento específicas para solicitudes de completado no streaming',
  
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
  tokensPerSecond: 'TPS',
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
