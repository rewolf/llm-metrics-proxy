import React from 'react';
import { Metrics } from '../../types';
import { calculatePercentage, formatResponseTime } from '../../utils';
import { MetricSection, MetricGrid, MetricItem } from '../../shared';
import { 
  StreamingIcon, 
  PerformanceIcon 
} from '../../assets/icons';

interface StreamedTabProps {
  metrics: Metrics;
  t: any; // Translation object
}

export const StreamedTab: React.FC<StreamedTabProps> = ({ metrics, t }) => {
  return (
    <>
      {/* Streamed Requests Overview */}
      <MetricSection title={t.streamedRequests} icon={<StreamingIcon />}>
        <MetricGrid>
          <MetricItem
            title={t.streamedRequestsCount}
            value={metrics.streaming_requests}
          />
          <MetricItem
            title={t.streamedRequestsPercent}
            value={calculatePercentage(metrics.streaming_requests, metrics.total_requests)}
          />
        </MetricGrid>
      </MetricSection>

      {/* Streaming Performance Metrics */}
      <MetricSection title={t.performanceMetrics} icon={<PerformanceIcon />}>
        <MetricGrid>
          {metrics.avg_time_to_first_token_ms && (
            <MetricItem
              title={t.timeToFirstToken}
              value={formatResponseTime(metrics.avg_time_to_first_token_ms)}
            />
          )}
          
          {metrics.avg_time_to_last_token_ms && (
            <MetricItem
              title={t.timeToLastToken}
              value={formatResponseTime(metrics.avg_time_to_last_token_ms)}
            />
          )}
          
          {metrics.avg_completion_duration_ms && (
            <MetricItem
              title={t.completionDuration}
              value={formatResponseTime(metrics.avg_completion_duration_ms)}
            />
          )}
        </MetricGrid>
        <div className="metric-note">
          <small>
            {t.streamingPerformanceNote}
            <br />
            {t.usageStatsNote}
          </small>
        </div>
      </MetricSection>
    </>
  );
};
