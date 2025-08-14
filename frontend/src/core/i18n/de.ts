import { Translation } from '../../types';

export const de: Translation = {
  // App title
  appTitle: 'LLM Metriken Dashboard',
  
  // Tab labels
  overview: 'Übersicht',
  streamedRequests: 'Streaming Anfragen',
  nonStreamedRequests: 'Nicht-Streaming Anfragen',
  
  // Section headers
  basicStatistics: 'Vervollständigungsanfragen',
  streamingStatistics: 'Streaming-Statistiken',
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
  avgTokensPerSecond: 'Durchschnittliche Inferenzgeschwindigkeit',

  
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
  tokenUsageNote: 'Token-Verbrauch ist nur für Nicht-Streaming-Anfragen verfügbar. Streaming-Anfragen zeigen stattdessen Zeitmetriken.',
  performanceNote: 'Antwortzeit umfasst sowohl Streaming- als auch Nicht-Streaming-Anfragen. Für gestreamte Vervollständigungsanfragen ist die Antwortzeit die Zeit bis zum letzten Token.',
  streamingPerformanceNote: 'Diese Metriken sind nur für Anfragen verfügbar, die explizit Nutzungsmetriken anfordern.',
  usageStatsNote: 'Nutzungsstatistiken können von Clients aktiviert werden, wenn sie /v1/chat/messages aufrufen, indem sie "stream_options": {"include_usage":true} zu ihrer Anfrage hinzufügen.',
  
  // Tooltips
  tooltipCompletionRequests: 'Übersicht aller Vervollständigungsanfragen, einschließlich Erfolgs-/Fehlerraten und Gesamtanzahlen',
  tooltipPerformanceMetrics: 'Antwortzeit- und Inferenzgeschwindigkeitsmetriken für alle Anfragentypen',
  tooltipModelUsage: 'Verteilung der Anfragen über verschiedene LLM-Modelle',
  tooltipRequestSources: 'Herkunft der Anfragen, die zeigt, welche Clients/Quellen das System nutzen',
  tooltipInferenceSpeed: 'Die Geschwindigkeit, mit der ein LLM Token verarbeiten kann, gemessen in Token-pro-Sekunde (TPS)',
  tooltipResponseTime: 'Gesamtzeit vom Anfragebeginn bis zur Fertigstellung, einschließlich Token-Generierungszeit',
  tooltipTokenUsage: 'Aufschlüsselung der verwendeten Prompt-, Vervollständigungs- und Gesamttoken über Anfragen',
  tooltipStreamingMetrics: 'Leistungsmetriken spezifisch für Streaming-Anfragen mit aktivierter Nutzung',
  tooltipNonStreamingMetrics: 'Leistungsmetriken spezifisch für Nicht-Streaming-Vervollständigungsanfragen',
  
  // Token usage section
  promptTokens: 'Prompt-Tokens',
  completionTokens: 'Vervollständigungs-Tokens',
  totalTokens: 'Gesamte Tokens',
  promptTokensPerRequest: 'Prompt-Tokens pro Anfrage',
  completionTokensPerRequest: 'Vervollständigungs-Tokens pro Anfrage',
  totalTokensPerRequest: 'Gesamte Tokens pro Anfrage',
  tokenUsageNoteStreaming: 'Token-Verbrauchsmetriken sind nur verfügbar, wenn Clients "include_usage" in ihren Streaming-Anfragen aktivieren.',
  requests: 'Anfragen',
  times: 'mal',
  tokensPerSecond: 'TPS',
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
