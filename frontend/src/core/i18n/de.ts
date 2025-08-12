import { Translation } from '../../types';

export const de: Translation = {
  // App title
  appTitle: 'OpenAI LLM Metriken Dashboard',
  
  // Section headers
  basicStatistics: 'Grundlegende Statistiken',
  streamingStatistics: 'Streaming Statistiken',
  tokenUsage: 'Token Verbrauch',
  performanceMetrics: 'Leistungsmetriken',
  modelUsage: 'Modell Verwendung',
  completionAnalysis: 'Vervollständigungsanalyse',
  errorAnalysis: 'Fehleranalyse',
  
  // Metric labels
  totalCompletionRequests: 'Gesamte Vervollständigungsanfragen',
  successfulRequests: 'Erfolgreiche Anfragen',
  failedRequests: 'Fehlgeschlagene Anfragen',
  successRate: 'Erfolgsrate',
  requestsLast24h: 'Anfragen (Letzte 24h)',
  streamingRequests: 'Streaming Anfragen',
  nonStreamingRequests: 'Nicht-Streaming Anfragen',
  streamingPercentage: 'Streaming Prozentsatz',
  totalTokensUsed: 'Gesamte verwendete Tokens',
  avgTokensPerRequest: 'Durchschnittliche Tokens pro Anfrage',
  avgResponseTime: 'Durchschnittliche Antwortzeit',
  avgTokensPerSecond: 'Durchschnittliche Tokens pro Sekunde',
  lastUpdated: 'Zuletzt aktualisiert',
  
  // Button text
  refreshNow: 'Jetzt aktualisieren',
  
  // Footer
  footerText: 'OpenAI LLM Metriken Proxy',
  
  // Language names
  english: 'English',
  spanish: 'Español',
  french: 'Français',
  german: 'Deutsch',
  japanese: '日本語',
  
  // Notes and warnings
  tokenUsageNote: '⚠️ Token-Verbrauch ist nur für Nicht-Streaming-Anfragen verfügbar. Streaming-Anfragen zeigen stattdessen Zeitmetriken.',
  performanceNote: '📊 Antwortzeit umfasst sowohl Streaming- als auch Nicht-Streaming-Anfragen. Tokens pro Sekunde sind nur für Nicht-Streaming verfügbar.',
  requests: 'Anfragen',
  times: 'mal',
  tokensPerSecond: 'Tokens/s',
  naStreaming: 'N/A (Streaming)',
  
  // Loading and error states
  loadingMetrics: 'Metriken werden geladen...',
  errorLoadingMetrics: 'Fehler beim Laden der Metriken:',
  noMetricsData: 'Keine Metrikdaten verfügbar'
};
