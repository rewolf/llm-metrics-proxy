import { Translation } from '../../types';

export const fr: Translation = {
  // App title
  appTitle: 'Tableau de Bord des Métriques LLM',
  
  // Tab labels
  overview: 'Vue d\'ensemble',
  streamedRequests: 'Requêtes en Streaming',
  nonStreamedRequests: 'Requêtes Non-Streaming',
  
  // Section headers
  basicStatistics: 'Statistiques de Base',
  streamingStatistics: 'Statistiques de Streaming',
  tokenUsage: 'Utilisation des Tokens',
  performanceMetrics: 'Métriques de Performance',
  modelUsage: 'Utilisation des Modèles',
  completionAnalysis: 'Analyse des Complétions',
  errorAnalysis: 'Analyse des Erreurs',
  requestSources: 'Sources des Requêtes',
  
  // Metric labels
  totalCompletionRequests: 'Total des Requêtes de Complétion',
  successfulRequests: 'Requêtes Réussies',
  failedRequests: 'Requêtes Échouées',
  successRate: 'Taux de Réussite',
  streamingRequests: 'Requêtes en Streaming',
  nonStreamingRequests: 'Requêtes Non-Streaming',
  streamingPercentage: 'Pourcentage de Streaming',
  totalTokensUsed: 'Total des Tokens Utilisés',
  avgTokensPerRequest: 'Moyenne des Tokens par Requête',
  avgResponseTime: 'Temps de Réponse Moyen',
  avgTokensPerSecond: 'Moyenne des Tokens par Seconde',
  lastUpdated: 'Dernière Mise à Jour',
  
  // Streaming-specific metrics
  timeToFirstToken: 'Temps jusqu\'au Premier Token',
  timeToLastToken: 'Temps jusqu\'au Dernier Token',
  completionDuration: 'Durée de Complétion',
  streamedRequestsCount: 'Requêtes en Streaming',
  streamedRequestsPercent: 'Pourcentage du Total',
  
  // Non-streaming specific metrics
  nonStreamedRequestsCount: 'Requêtes Non-Streaming',
  nonStreamedRequestsPercent: 'Pourcentage du Total',
  tokensPerRequest: 'Tokens par Requête',
  
  // Button text
  refreshNow: 'Actualiser Maintenant',
  
  // Footer
  footerText: 'Proxy de Métriques LLM',
  
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
  tokenUsageNote: '⚠️ L\'utilisation des tokens n\'est disponible que pour les requêtes non-streaming. Les requêtes en streaming affichent des métriques de temps à la place.',
  performanceNote: '📊 Le temps de réponse inclut à la fois les requêtes en streaming et non-streaming. Le temps jusqu\'au premier token montre la performance du streaming.',
  streamingPerformanceNote: '📊 Ces métriques ne sont disponibles que pour les requêtes demandant explicitement des métriques d\'utilisation.',
  requests: 'requêtes',
  times: 'fois',
  tokensPerSecond: 'tokens/s',
  naStreaming: 'N/A (streaming)',
  
  // Loading and error states
  loadingMetrics: 'Chargement des métriques...',
  errorLoadingMetrics: 'Erreur lors du chargement des métriques :',
  noMetricsData: 'Aucune donnée de métriques disponible',
  
  // Timeframe selector
  selectTimeframe: 'Sélectionner la Période',
  timeframe1h: '1 Heure',
  timeframe6h: '6 Heures',
  timeframe12h: '12 Heures',
  timeframe1d: '1 Jour',
  timeframe1w: '1 Semaine',
  timeframe1mo: '1 Mois',
  timeframeAll: 'Tout le Temps'
};
