import React, { useState, useEffect } from 'react';
import './App.css';

// Use environment variable or default to localhost since browser runs on host
const METRICS_API_URL = process.env.REACT_APP_METRICS_API_URL || 'http://localhost:8002';

function App() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = async () => {
    try {
      const response = await fetch(`${METRICS_API_URL}/metrics`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMetrics(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="App">Loading metrics...</div>;
  }

  if (error) {
    return <div className="App">Error loading metrics: {error}</div>;
  }

  return (
    <div className="App">
      <h1>🤖 OpenAI LLM Metrics Dashboard</h1>
      
      <div className="metrics">
        {/* Basic Stats */}
        <div className="metric-section">
          <h2>📊 Basic Statistics</h2>
          <div className="metric-grid">
            <div className="metric">
              <h3>Total Completion Requests</h3>
              <div className="value">{metrics?.total_requests || 0}</div>
            </div>
            
            <div className="metric success">
              <h3>Successful Requests</h3>
              <div className="value">{metrics?.successful_requests || 0}</div>
            </div>
            
            <div className="metric failed">
              <h3>Failed Requests</h3>
              <div className="value">{metrics?.failed_requests || 0}</div>
            </div>
            
            <div className="metric">
              <h3>Success Rate</h3>
              <div className="value">{metrics?.success_rate || 0}%</div>
            </div>
            
            <div className="metric">
              <h3>Requests (Last 24h)</h3>
              <div className="value">{metrics?.recent_requests_24h || 0}</div>
            </div>
          </div>
        </div>

        {/* Streaming Stats */}
        <div className="metric-section">
          <h2>🔄 Streaming Statistics</h2>
          <div className="metric-grid">
            <div className="metric">
              <h3>Streaming Requests</h3>
              <div className="value">{metrics?.streaming_requests || 0}</div>
            </div>
            
            <div className="metric">
              <h3>Non-Streaming Requests</h3>
              <div className="value">{metrics?.non_streaming_requests || 0}</div>
            </div>
            
            <div className="metric">
              <h3>Streaming Percentage</h3>
              <div className="value">{metrics?.streaming_percentage || 0}%</div>
            </div>
          </div>
        </div>

        {/* Token Usage */}
        <div className="metric-section">
          <h2>🔤 Token Usage</h2>
          <div className="metric-grid">
            <div className="metric">
              <h3>Total Tokens Used</h3>
              <div className="value">{metrics?.total_tokens_used?.toLocaleString() || 0}</div>
            </div>
            
            <div className="metric">
              <h3>Average Tokens per Request</h3>
              <div className="value">{metrics?.avg_tokens_per_request || 0}</div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="metric-section">
          <h2>⚡ Performance Metrics</h2>
          <div className="metric-grid">
            <div className="metric">
              <h3>Average Response Time</h3>
              <div className="value">{metrics?.avg_response_time_ms || 0}ms</div>
            </div>
            
            <div className="metric">
              <h3>Average Tokens per Second</h3>
              <div className="value">{metrics?.avg_tokens_per_second || 0}</div>
            </div>
          </div>
        </div>

        {/* Model Usage */}
        {metrics?.top_models && metrics.top_models.length > 0 && (
          <div className="metric-section">
            <h2>🤖 Model Usage</h2>
            <div className="metric-list">
              {metrics.top_models.map((model, index) => (
                <div key={index} className="metric-item">
                  <span className="model-name">{model.model}</span>
                  <span className="model-count">{model.count} requests</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Finish Reasons */}
        {metrics?.finish_reasons && metrics.finish_reasons.length > 0 && (
          <div className="metric-section">
            <h2>🏁 Completion Analysis</h2>
            <div className="metric-list">
              {metrics.finish_reasons.map((reason, index) => (
                <div key={index} className="metric-item">
                  <span className="reason-name">{reason.reason}</span>
                  <span className="reason-count">{reason.count} times</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Analysis */}
        {metrics?.error_types && metrics.error_types.length > 0 && (
          <div className="metric-section">
            <h2>❌ Error Analysis</h2>
            <div className="metric-list">
              {metrics.error_types.map((error, index) => (
                <div key={index} className="metric-item">
                  <span className="error-name">{error.type}</span>
                  <span className="error-count">{error.count} times</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="metric">
          <h3>Last Updated</h3>
          <div className="value">{metrics?.timestamp || 'Unknown'}</div>
        </div>
      </div>
      
      <button onClick={fetchMetrics} className="refresh-btn">
        Refresh Now
      </button>
    </div>
  );
}

export default App;
