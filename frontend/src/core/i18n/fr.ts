import { Translation } from '../../types';

export const fr: Translation = {
  // App title
  appTitle: 'Tableau de Bord des Métriques OpenAI LLM',
  
  // Section headers
  basicStatistics: 'Statistiques de Base',
  streamingStatistics: 'Statistiques de Streaming',
  tokenUsage: 'Utilisation des Tokens',
  performanceMetrics: 'Métriques de Performance',
  modelUsage: 'Utilisation des Modèles',
  completionAnalysis: 'Analyse des Complétions',
  errorAnalysis: 'Analyse des Erreurs',
  
  // Metric labels
  totalCompletionRequests: 'Total des Demandes de Complétion',
  successfulRequests: 'Demandes Réussies',
  failedRequests: 'Demandes Échouées',
  successRate: 'Taux de Réussite',
  requestsLast24h: 'Demandes (Dernières 24h)',
  streamingRequests: 'Demandes de Streaming',
  nonStreamingRequests: 'Demandes Non-Streaming',
  streamingPercentage: 'Pourcentage de Streaming',
  totalTokensUsed: 'Total des Tokens Utilisés',
  avgTokensPerRequest: 'Moyenne des Tokens par Demande',
  avgResponseTime: 'Temps de Réponse Moyen',
  avgTokensPerSecond: 'Moyenne des Tokens par Seconde',
  lastUpdated: 'Dernière Mise à Jour',
  
  // Button text
  refreshNow: 'Actualiser Maintenant',
  
  // Footer
  footerText: 'Proxy de Métriques OpenAI LLM',
  
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
  tokenUsageNote: '⚠️ L\'utilisation des tokens n\'est disponible que pour les demandes non-streaming. Les demandes de streaming affichent des métriques de temps à la place.',
  performanceNote: '📊 Le temps de réponse inclut à la fois les demandes streaming et non-streaming. Les tokens par seconde ne sont disponibles que pour les non-streaming.',
  requests: 'demandes',
  times: 'fois',
  tokensPerSecond: 'tokens/s',
  naStreaming: 'N/A (streaming)',
  
  // Loading and error states
  loadingMetrics: 'Chargement des métriques...',
  errorLoadingMetrics: 'Erreur lors du chargement des métriques:',
  noMetricsData: 'Aucune donnée de métriques disponible'
};
