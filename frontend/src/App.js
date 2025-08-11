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
