import { Translation } from '../../types';

export const de: Translation = {
  // App title
  appTitle: 'LLM Metriken Dashboard',
  
  // Tab labels
  overview: 'Übersicht',
  streamedRequests: 'Streaming Anfragen',
  nonStreamedRequests: 'Nicht-Streaming Anfragen',
  
  // Section headers
  basicStatistics: 'Grundlegende Statistiken',
  streamingStatistics: 'Streaming Statistiken',
  tokenUsage: 'Token Verbrauch',
  performanceMetrics: 'Leistungsmetriken',
  modelUsage: 'Modell Verwendung',
  completionAnalysis: 'Vervollständigungsanalyse',
  errorAnalysis: 'Fehleranalyse',
  requestSources: 'Anfragequellen',
  
  // Metric labels
  totalCompletionRequests: 'Gesamte Vervollständigungsanfragen',
  successfulRequests: 'Erfolgreiche Anfragen',
  failedRequests: 'Fehlgeschlagene Anfragen',
  successRate: 'Erfolgsrate',
  streamingRequests: 'Streaming Anfragen',
  nonStreamingRequests: 'Nicht-Streaming Anfragen',
  streamingPercentage: 'Streaming Prozentsatz',
  totalTokensUsed: 'Gesamte verwendete Tokens',
  avgTokensPerRequest: 'Durchschnittliche Tokens pro Anfrage',
  avgResponseTime: 'Durchschnittliche Antwortzeit',
  avgTokensPerSecond: 'Durchschnittliche Tokens pro Sekunde',
  lastUpdated: 'Zuletzt aktualisiert',
  
  // Streaming-specific metrics
  timeToFirstToken: 'Zeit bis zum ersten Token',
  timeToLastToken: 'Zeit bis zum letzten Token',
  completionDuration: 'Vervollständigungsdauer',
  streamedRequestsCount: 'Streaming Anfragen',
  streamedRequestsPercent: 'Prozent der Gesamten',
  
  // Non-streaming specific metrics
  nonStreamedRequestsCount: 'Nicht-Streaming Anfragen',
  nonStreamedRequestsPercent: 'Prozent der Gesamten',
  tokensPerRequest: 'Tokens pro Anfrage',
  
  // Button text
  refreshNow: 'Jetzt aktualisieren',
  
  // Footer
  footerText: 'LLM Metriken Proxy',
  
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
  tokenUsageNote: '⚠️ Token-Verbrauch ist nur für Nicht-Streaming-Anfragen verfügbar. Streaming-Anfragen zeigen stattdessen Zeitmetriken.',
  performanceNote: '📊 Antwortzeit umfasst sowohl Streaming- als auch Nicht-Streaming-Anfragen. Zeit bis zum ersten Token zeigt Streaming-Leistung.',
  streamingPerformanceNote: '📊 Diese Metriken sind nur für Anfragen verfügbar, die explizit Nutzungsmetriken anfordern.',
  requests: 'Anfragen',
  times: 'mal',
  tokensPerSecond: 'Tokens/s',
  naStreaming: 'N/A (Streaming)',
  
  // Loading and error states
  loadingMetrics: 'Metriken werden geladen...',
  errorLoadingMetrics: 'Fehler beim Laden der Metriken:',
  noMetricsData: 'Keine Metrikdaten verfügbar',
  
  // Timeframe selector
  selectTimeframe: 'Zeitraum Auswählen',
  timeframe1h: '1 Stunde',
  timeframe6h: '6 Stunden',
  timeframe12h: '12 Stunden',
  timeframe1d: '1 Tag',
  timeframe1w: '1 Woche',
  timeframe1mo: '1 Monat',
  timeframeAll: 'Gesamte Zeit'
};
