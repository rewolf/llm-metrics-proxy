import React, { useState, useEffect } from 'react';
import './styles/main.scss';
import { Metrics, Language, CompletionRequestData, Timeframe } from './types';
import { calculatePercentage, formatNumber, formatResponseTime, getTimeframeRange } from './utils';
import { ThemeSelector } from './components/ThemeSelector';
import { LanguageSelector } from './components/LanguageSelector';
import { TabSelector, Tab } from './components/TabSelector';
import { TimeframeSelector } from './components/TimeframeSelector';
import { RequestCountChart } from './components/RequestCountChart';
import { ResponseTimeChart } from './components/ResponseTimeChart';
import { getAllThemes, applyTheme, getDefaultThemeId } from './core/themes';
import { getTranslation, getDefaultLanguage, saveLanguagePreference, debugLanguageDetection } from './core/i18n';
import { 
  DashboardIcon, 
  StreamingIcon, 
  DocumentIcon, 
  PerformanceIcon, 
  RobotIcon, 
  GlobeIcon, 
  FinishIcon, 
  ErrorIcon,
  TokenIcon
} from './assets/icons';

// Use environment variable or default to localhost since browser runs on host
const METRICS_API_URL = process.env.REACT_APP_METRICS_API_URL || 'http://localhost:8002';

function App(): JSX.Element {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [completionRequests, setCompletionRequests] = useState<CompletionRequestData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentThemeId, setCurrentThemeId] = useState<string>(getDefaultThemeId());
  const [currentLanguage, setCurrentLanguage] = useState<Language>(getDefaultLanguage());
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [currentTimeframe, setCurrentTimeframe] = useState<string>('all');
  
  // Get current translations
  const t = getTranslation(currentLanguage);
  
  // Define tabs
  const tabs: Tab[] = [
    { id: 'overview', label: t.overview, icon: DashboardIcon },
    { id: 'streamed', label: t.streamedRequests, icon: StreamingIcon },
    { id: 'non-streamed', label: t.nonStreamedRequests, icon: DocumentIcon }
  ];
  
  // Handle language change and persist preference
  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    saveLanguagePreference(language);
  };

  const getTimeframeDates = (timeframe: string): { start?: string; end?: string } => {
    if (timeframe === 'all') {
      return {};
    }
    
    // Use the new utility function for consistent timeframe handling
    const { start, end } = getTimeframeRange(timeframe);
    
    const startISO = start.toISOString();
    console.log(`Timeframe: ${timeframe}, Start (UTC): ${startISO}, End (UTC): ${end.toISOString()}`);
    
    return { start: startISO };
  };

  const fetchMetrics = async (): Promise<void> => {
    try {
      const { start } = getTimeframeDates(currentTimeframe);
      const params = new URLSearchParams();
      if (start) params.append('start', start);
      
      const response = await fetch(`${METRICS_API_URL}/metrics?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Metrics = await response.json();
      setMetrics(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    }
  };

  const fetchCompletionRequests = async (): Promise<void> => {
    try {
      const { start } = getTimeframeDates(currentTimeframe);
      const params = new URLSearchParams();
      if (start) params.append('start', start);
      
      const response = await fetch(`${METRICS_API_URL}/completion_requests?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: CompletionRequestData[] = await response.json();
      setCompletionRequests(data);
    } catch (err) {
      console.error('Failed to fetch completion requests:', err);
      // Don't set error state for completion requests as it's not critical
    }
  };

  const handleTimeframeChange = (timeframe: string) => {
    setCurrentTimeframe(timeframe);
    setLoading(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchMetrics(),
        fetchCompletionRequests()
      ]);
      setLoading(false);
    };
    
    fetchData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    
    // Log language detection results for debugging
    console.log('🌐 Language Detection Results:', debugLanguageDetection());
    
    return () => clearInterval(interval);
  }, [currentTimeframe]);

  // Apply theme when it changes
  useEffect(() => {
    const theme = getAllThemes().find(t => t.id === currentThemeId);
    if (theme) {
      applyTheme(theme);
    }
  }, [currentThemeId]);

  if (loading) {
    return <div className="App loading">{t.loadingMetrics}</div>;
  }

  if (error) {
    return <div className="App error">{t.errorLoadingMetrics} {error}</div>;
  }

  if (!metrics) {
    return <div className="App">{t.noMetricsData}</div>;
  }

  // Render Overview Tab Content
  const renderOverviewTab = () => (
    <>
      {/* Basic Stats */}
      <div className="metric-section">
        <h2><DashboardIcon /> {t.basicStatistics}</h2>
        <div className="metric-split-layout">
          <div className="metric-left">
            <div className="metric-grid">
              <div className="metric">
                <h3>{t.totalCompletionRequests}</h3>
                <div className="value">{metrics.total_requests}</div>
              </div>
              
              <div className="metric">
                <h3>{t.successRate}</h3>
                <div 
                  className="value success-rate-value"
                  style={{
                    color: (() => {
                      const successRate = (metrics.successful_requests / metrics.total_requests) * 100;
                      if (successRate === 100) return 'var(--color-metricSuccess, #28a745)';
                      if (successRate >= 90) return 'var(--color-success, #28a745)';
                      if (successRate >= 80) return 'var(--color-warning, #ffc107)';
                      return 'var(--color-metricFailed, #dc3545)';
                    })()
                  }}
                >
                  {calculatePercentage(metrics.successful_requests, metrics.total_requests)}
                </div>
              </div>
            </div>
          </div>
          <div className="metric-right">
            <RequestCountChart
              requests={completionRequests}
              timeframe={currentTimeframe}
              height={300}
            />
          </div>
        </div>
      </div>

      {/* Response Time Information */}
      <div className="metric-section">
        <h2><PerformanceIcon /> {t.performanceMetrics}</h2>
        <div className="metric-split-layout">
          <div className="metric-left">
            <div className="metric-grid">
              <div className="metric">
                <h3>{t.avgResponseTime}</h3>
                <div className="value">{formatResponseTime(metrics.avg_response_time_ms)}</div>
              </div>
              
              {metrics.avg_time_to_first_token_ms && (
                <div className="metric">
                  <h3>{t.timeToFirstToken}</h3>
                  <div className="value">{formatResponseTime(metrics.avg_time_to_first_token_ms)}</div>
                </div>
              )}
            </div>
          </div>
          <div className="metric-right">
            <ResponseTimeChart
              requests={completionRequests}
              timeframe={currentTimeframe}
              height={300}
            />
          </div>
        </div>
        <div className="metric-note">
          <small>{t.performanceNote}</small>
        </div>
      </div>

      {/* Model Usage */}
      {metrics.model_distribution && Object.keys(metrics.model_distribution).length > 0 && (
        <div className="metric-section">
          <h2><RobotIcon /> {t.modelUsage}</h2>
          <div className="metric-list">
            {Object.entries(metrics.model_distribution)
              .sort(([,a], [,b]) => b - a) // Sort by count descending
              .map(([model, count], index) => (
                <div key={index} className="metric-item">
                  <span className="model-name">{model}</span>
                  <span className="model-count">{count} {t.requests}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Request Sources */}
      {metrics.top_origins && metrics.top_origins.length > 0 && (
        <div className="metric-section">
          <h2><GlobeIcon /> {t.requestSources}</h2>
          <div className="metric-list">
            {metrics.top_origins.map((origin, index) => (
              <div key={index} className="metric-item">
                <span className="origin-name">{origin.origin}</span>
                <span className="origin-count">{origin.count} {t.requests}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completion Analysis */}
      {metrics.finish_reasons && metrics.finish_reasons.length > 0 && (
        <div className="metric-section">
          <h2><FinishIcon /> {t.completionAnalysis}</h2>
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
          <h2><ErrorIcon /> {t.errorAnalysis}</h2>
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
    </>
  );

  // Render Streamed Requests Tab Content
  const renderStreamedTab = () => (
    <>
      {/* Streamed Requests Overview */}
      <div className="metric-section">
        <h2><StreamingIcon /> {t.streamedRequests}</h2>
        <div className="metric-grid">
          <div className="metric">
            <h3>{t.streamedRequestsCount}</h3>
            <div className="value">{metrics.streaming_requests}</div>
          </div>
          
          <div className="metric">
            <h3>{t.streamedRequestsPercent}</h3>
            <div className="value">
              {calculatePercentage(metrics.streaming_requests, metrics.total_requests)}
            </div>
          </div>
        </div>
      </div>

      {/* Streaming Performance Metrics */}
      <div className="metric-section">
        <h2><PerformanceIcon /> {t.performanceMetrics}</h2>
        <div className="metric-grid">
          {metrics.avg_time_to_first_token_ms && (
            <div className="metric">
              <h3>{t.timeToFirstToken}</h3>
              <div className="value">{formatResponseTime(metrics.avg_time_to_first_token_ms)}</div>
            </div>
          )}
          
          {metrics.avg_time_to_last_token_ms && (
            <div className="metric">
              <h3>{t.timeToLastToken}</h3>
              <div className="value">{formatResponseTime(metrics.avg_time_to_last_token_ms)}</div>
            </div>
          )}
          
          {metrics.avg_completion_duration_ms && (
            <div className="metric">
              <h3>{t.completionDuration}</h3>
              <div className="value">{formatResponseTime(metrics.avg_completion_duration_ms)}</div>
            </div>
          )}
        </div>
        <div className="metric-note">
          <small>
            {t.streamingPerformanceNote}
            <br />
            {t.usageStatsNote}
          </small>
        </div>
      </div>
    </>
  );

  // Render Non-streamed Requests Tab Content
  const renderNonStreamedTab = () => (
    <>
      {/* Non-streamed Requests Overview */}
      <div className="metric-section">
        <h2><DocumentIcon /> {t.nonStreamedRequests}</h2>
        <div className="metric-grid">
          <div className="metric">
            <h3>{t.nonStreamedRequestsCount}</h3>
            <div className="value">{metrics.non_streaming_requests}</div>
          </div>
          
          <div className="metric">
            <h3>{t.nonStreamedRequestsPercent}</h3>
            <div className="value">
              {calculatePercentage(metrics.non_streaming_requests, metrics.total_requests)}
            </div>
          </div>
        </div>
      </div>

      {/* Token Usage */}
      {metrics.total_tokens_used && metrics.total_tokens_used > 0 && (
        <div className="metric-section">
          <h2><TokenIcon /> {t.tokenUsage}</h2>
          <div className="metric-grid">
            <div className="metric">
              <h3>{t.totalTokensUsed}</h3>
              <div className="value">{formatNumber(metrics.total_tokens_used)}</div>
            </div>
            
            <div className="metric">
              <h3>{t.tokensPerRequest}</h3>
              <div className="value">{metrics.avg_tokens_per_request || 0}</div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      <div className="metric-section">
        <h2><PerformanceIcon /> {t.performanceMetrics}</h2>
        <div className="metric-grid">
          <div className="metric">
            <h3>{t.avgResponseTime}</h3>
            <div className="value">{formatResponseTime(metrics.avg_response_time_ms)}</div>
          </div>
          
          <div className="metric">
            <h3>{t.tokensPerSecond}</h3>
            <div className="value">
              {metrics.avg_tokens_per_second ? `${metrics.avg_tokens_per_second.toFixed(2)} ${t.tokensPerSecond}` : t.naStreaming}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'streamed':
        return renderStreamedTab();
      case 'non-streamed':
        return renderNonStreamedTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1><RobotIcon /> {t.appTitle}</h1>
        <TimeframeSelector
          currentTimeframe={currentTimeframe}
          onTimeframeChange={handleTimeframeChange}
          currentLanguage={currentLanguage}
        />
      </header>
      
      {/* Tab Selector */}
      <TabSelector
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <div className="metrics">
        {renderTabContent()}
      </div>
      
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
