import React, { useState, useEffect } from 'react';
import './styles/main.scss';
import { Metrics, Language, CompletionRequestData, Timeframe } from './types';
import { getTimeframeRange } from './utils';
import { 
  ThemeSelector,
  LanguageSelector,
  TabSelector, 
  Tab,
  TimeframeSelector
} from './components';
import { OverviewTab, StreamedTab, NonStreamedTab } from './features';
import { getAllThemes, applyTheme, getDefaultThemeId } from './core/themes';
import { getTranslation, getDefaultLanguage, saveLanguagePreference, debugLanguageDetection } from './core/i18n';
import { 
  RobotIcon,
  DashboardIcon,
  StreamingIcon,
  DocumentIcon
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







  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab
            metrics={metrics}
            completionRequests={completionRequests}
            currentTimeframe={currentTimeframe}
            t={t}
          />
        );
      case 'streamed':
        return (
          <StreamedTab
            metrics={metrics}
            t={t}
          />
        );
      case 'non-streamed':
        return (
          <NonStreamedTab
            metrics={metrics}
            t={t}
          />
        );
      default:
        return (
          <OverviewTab
            metrics={metrics}
            completionRequests={completionRequests}
            currentTimeframe={currentTimeframe}
            t={t}
          />
        );
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
