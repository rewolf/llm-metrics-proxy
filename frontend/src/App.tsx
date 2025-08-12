import React, { useState, useEffect } from 'react';
import './styles/main.scss';
import { Metrics, Language } from './types';
import { calculatePercentage, formatNumber, formatResponseTime } from './utils';
import { ThemeSelector } from './components/ThemeSelector';
import { LanguageSelector } from './components/LanguageSelector';
import { getAllThemes, applyTheme, getDefaultThemeId } from './core/themes';
import { getTranslation, getDefaultLanguage, saveLanguagePreference, debugLanguageDetection } from './core/i18n';

// Use environment variable or default to localhost since browser runs on host
const METRICS_API_URL = process.env.REACT_APP_METRICS_API_URL || 'http://localhost:8002';

function App(): JSX.Element {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentThemeId, setCurrentThemeId] = useState<string>(getDefaultThemeId());
  const [currentLanguage, setCurrentLanguage] = useState<Language>(getDefaultLanguage());
  
  // Get current translations
  const t = getTranslation(currentLanguage);
  
  // Handle language change and persist preference
  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    saveLanguagePreference(language);
  };

  const fetchMetrics = async (): Promise<void> => {
    try {
      const response = await fetch(`${METRICS_API_URL}/metrics`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Metrics = await response.json();
      setMetrics(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    
    // Log language detection results for debugging
    console.log('🌐 Language Detection Results:', debugLanguageDetection());
    
    return () => clearInterval(interval);
  }, []);

  // Apply theme when it changes
  useEffect(() => {
    const theme = getAllThemes().find(t => t.id === currentThemeId);
    if (theme) {
      applyTheme(theme);
    }
  }, [currentThemeId]);

  if (loading) {
    return <div className="App">{t.loadingMetrics}</div>;
  }

  if (error) {
    return <div className="App">{t.errorLoadingMetrics} {error}</div>;
  }

  if (!metrics) {
    return <div className="App">{t.noMetricsData}</div>;
  }

  return (
    <div className="App">
      <h1>🤖 {t.appTitle}</h1>
      
      <div className="metrics">
        {/* Basic Stats */}
        <div className="metric-section">
          <h2>📊 {t.basicStatistics}</h2>
                      <div className="metric-grid">
              <div className="metric">
                <h3>{t.totalCompletionRequests}</h3>
                <div className="value">{metrics.total_requests}</div>
              </div>
              
              <div className="metric success">
                <h3>{t.successfulRequests}</h3>
                <div className="value">{metrics.successful_requests}</div>
              </div>
              
              <div className="metric failed">
                <h3>{t.failedRequests}</h3>
                <div className="value">{metrics.failed_requests}</div>
              </div>
              
              <div className="metric">
                <h3>{t.successRate}</h3>
                <div className="value">
                  {calculatePercentage(metrics.successful_requests, metrics.total_requests)}
                </div>
              </div>
              
              <div className="metric">
                <h3>{t.requestsLast24h}</h3>
                <div className="value">{metrics.recent_requests_24h}</div>
              </div>
            </div>
        </div>

        {/* Streaming Stats */}
        <div className="metric-section">
          <h2>🔄 {t.streamingStatistics}</h2>
          <div className="metric-grid">
            <div className="metric">
              <h3>{t.streamingRequests}</h3>
              <div className="value">{metrics.streaming_requests}</div>
            </div>
            
            <div className="metric">
              <h3>{t.nonStreamingRequests}</h3>
              <div className="value">{metrics.non_streaming_requests}</div>
            </div>
            
            <div className="metric">
              <h3>{t.streamingPercentage}</h3>
              <div className="value">
                {calculatePercentage(metrics.streaming_requests, metrics.total_requests)}
              </div>
            </div>
          </div>
        </div>

        {/* Token Usage */}
        {metrics.total_tokens_used && metrics.total_tokens_used > 0 && (
          <div className="metric-section">
            <h2>🔤 {t.tokenUsage}</h2>
            <div className="metric-grid">
              <div className="metric">
                <h3>{t.totalTokensUsed}</h3>
                <div className="value">{formatNumber(metrics.total_tokens_used)}</div>
              </div>
              
              <div className="metric">
                <h3>{t.avgTokensPerRequest}</h3>
                <div className="value">{metrics.avg_tokens_per_request || 0}</div>
              </div>
            </div>
            <div className="metric-note">
              <small>{t.tokenUsageNote}</small>
            </div>
          </div>
        )}

        {/* Performance Metrics */}
        <div className="metric-section">
          <h2>⚡ {t.performanceMetrics}</h2>
          <div className="metric-grid">
            <div className="metric">
              <h3>{t.avgResponseTime}</h3>
              <div className="value">{formatResponseTime(metrics.avg_response_time_ms)}</div>
            </div>
            
            <div className="metric">
              <h3>{t.avgTokensPerSecond}</h3>
              <div className="value">
                {metrics.avg_tokens_per_second ? `${metrics.avg_tokens_per_second.toFixed(2)} ${t.tokensPerSecond}` : t.naStreaming}
              </div>
            </div>
          </div>
          <div className="metric-note">
            <small>{t.performanceNote}</small>
          </div>
        </div>

        {/* Model Usage */}
        {metrics.top_models && metrics.top_models.length > 0 && (
          <div className="metric-section">
            <h2>🤖 {t.modelUsage}</h2>
            <div className="metric-list">
              {metrics.top_models.map((model, index) => (
                <div key={index} className="metric-item">
                  <span className="model-name">{model.model}</span>
                  <span className="model-count">{model.count} {t.requests}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Finish Reasons */}
        {metrics.finish_reasons && metrics.finish_reasons.length > 0 && (
          <div className="metric-section">
            <h2>🏁 {t.completionAnalysis}</h2>
            <div className="metric-list">
              {metrics.finish_reasons.map((reason, index) => (
                <div key={index} className="metric-item">
                  <span className="reason-name">{reason.reason}</span>
                  <span className="reason-count">{reason.count} {t.times}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Analysis */}
        {metrics.error_types && metrics.error_types.length > 0 && (
          <div className="metric-section">
            <h2>❌ {t.errorAnalysis}</h2>
            <div className="metric-list">
              {metrics.error_types.map((error, index) => (
                <div key={index} className="metric-item">
                  <span className="error-name">{error.type}</span>
                  <span className="error-count">{error.count} {t.times}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="metric">
          <h3>{t.lastUpdated}</h3>
          <div className="value">{metrics.timestamp}</div>
        </div>
      </div>
      
      <button onClick={fetchMetrics} className="refresh-btn">
        {t.refreshNow}
      </button>
      
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-left">
            <span className="footer-text">{t.footerText}</span>
          </div>
          <div className="footer-right">
            <LanguageSelector
              currentLanguage={currentLanguage}
              onLanguageChange={handleLanguageChange}
            />
            <ThemeSelector
              currentThemeId={currentThemeId}
              onThemeChange={setCurrentThemeId}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
