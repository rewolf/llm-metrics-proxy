import React from 'react';
import { Metrics } from '../../types';
import { 
  MetricSection, 
  MetricGrid, 
  MetricItem, 
  TokenUsageSection 
} from '../../shared';
import { 
  StreamingIcon, 
  PerformanceIcon, 
  TokenIcon 
} from '../../assets/icons';
import { calculatePercentage, formatResponseTime } from '../../utils';

interface StreamedTabProps {
  metrics: Metrics;
  t: any; // Translation object
}

export const StreamedTab: React.FC<StreamedTabProps> = ({ metrics, t }) => {
  return (
    <>
      {/* Streamed Requests Overview */}
      <MetricSection title={t.streamedRequests} icon={<StreamingIcon />} tooltip={t.tooltipStreamingMetrics}>
        <MetricGrid>
          <MetricItem
            title={t.streamedRequestsCount}
            value={metrics.requests.streamed.total}
          />
          <MetricItem
            title={t.streamedRequestsPercent}
            value={calculatePercentage(metrics.requests.streamed.total, metrics.requests.total.total)}
          />
        </MetricGrid>
      </MetricSection>

      {/* Streaming Performance Metrics */}
      <MetricSection title={t.performanceMetrics} icon={<PerformanceIcon />} tooltip={t.tooltipPerformanceMetrics}>
        <MetricGrid>
          {metrics.requests.streamed.avg_time_to_first_token_ms && (
            <MetricItem
              title={t.timeToFirstToken}
              value={formatResponseTime(metrics.requests.streamed.avg_time_to_first_token_ms)}
            />
          )}
          
          {metrics.requests.streamed.avg_time_to_last_token_ms && (
            <MetricItem
              title={t.timeToLastToken}
              value={formatResponseTime(metrics.requests.streamed.avg_time_to_last_token_ms)}
            />
          )}
          
          {metrics.requests.streamed.avg_completion_duration_ms && (
            <MetricItem
              title={t.completionDuration}
              value={formatResponseTime(metrics.requests.streamed.avg_completion_duration_ms)}
            />
          )}
          
          {metrics.requests.streamed.tokens.avg_tokens_per_second !== null && 
           metrics.requests.streamed.tokens.avg_tokens_per_second !== undefined && (
            <MetricItem
              title={t.avgTokensPerSecond}
              value={`${metrics.requests.streamed.tokens.avg_tokens_per_second.toFixed(2)} ${t.tokensPerSecond}`}
              tooltip={t.tooltipInferenceSpeed}
            />
          )}
        </MetricGrid>
      </MetricSection>

      {/* Token Usage Section */}
      <TokenUsageSection 
        tokenMetrics={metrics.requests.streamed.tokens}
        noteText={t.tokenUsageNoteStreaming}
        t={t}
      />
    </>
  );
};
