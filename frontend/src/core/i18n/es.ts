import { Translation } from '../../types';

export const es: Translation = {
  // App title
  appTitle: 'Panel de Métricas OpenAI LLM',
  
  // Section headers
  basicStatistics: 'Estadísticas Básicas',
  streamingStatistics: 'Estadísticas de Streaming',
  tokenUsage: 'Uso de Tokens',
  performanceMetrics: 'Métricas de Rendimiento',
  modelUsage: 'Uso de Modelos',
  completionAnalysis: 'Análisis de Completado',
  errorAnalysis: 'Análisis de Errores',
  
  // Metric labels
  totalCompletionRequests: 'Total de Solicitudes de Completado',
  successfulRequests: 'Solicitudes Exitosas',
  failedRequests: 'Solicitudes Fallidas',
  successRate: 'Tasa de Éxito',
  requestsLast24h: 'Solicitudes (Últimas 24h)',
  streamingRequests: 'Solicitudes de Streaming',
  nonStreamingRequests: 'Solicitudes No-Streaming',
  streamingPercentage: 'Porcentaje de Streaming',
  totalTokensUsed: 'Total de Tokens Usados',
  avgTokensPerRequest: 'Promedio de Tokens por Solicitud',
  avgResponseTime: 'Tiempo de Respuesta Promedio',
  avgTokensPerSecond: 'Promedio de Tokens por Segundo',
  lastUpdated: 'Última Actualización',
  
  // Button text
  refreshNow: 'Actualizar Ahora',
  
  // Footer
  footerText: 'Proxy de Métricas OpenAI LLM',
  
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
  tokenUsageNote: '⚠️ El uso de tokens solo está disponible para solicitudes no-streaming. Las solicitudes de streaming muestran métricas de tiempo en su lugar.',
  performanceNote: '📊 El tiempo de respuesta incluye tanto solicitudes streaming como no-streaming. Los tokens por segundo solo están disponibles para no-streaming.',
  requests: 'solicitudes',
  times: 'veces',
  tokensPerSecond: 'tokens/s',
  naStreaming: 'N/A (streaming)',
  
  // Loading and error states
  loadingMetrics: 'Cargando métricas...',
  errorLoadingMetrics: 'Error al cargar métricas:',
  noMetricsData: 'No hay datos de métricas disponibles'
};
