import React from 'react';
import { Metrics } from '../../types';
import { 
  MetricSection, 
  MetricGrid, 
  MetricItem, 
  TokenUsageSection 
} from '../../shared';
import { 
  DocumentIcon, 
  PerformanceIcon, 
  TokenIcon 
} from '../../assets/icons';
import { calculatePercentage, formatResponseTime } from '../../utils';

interface NonStreamedTabProps {
  metrics: Metrics;
  t: any; // Translation object
}

export const NonStreamedTab: React.FC<NonStreamedTabProps> = ({ metrics, t }) => {
  return (
    <>
      {/* Non-streamed Requests Overview */}
      <MetricSection title={t.nonStreamedRequests} icon={<DocumentIcon />} tooltip={t.tooltipNonStreamingMetrics}>
        <MetricGrid>
          <MetricItem
            title={t.nonStreamedRequestsCount}
            value={metrics.requests.non_streamed.total}
          />
          <MetricItem
            title={t.nonStreamedRequestsPercent}
            value={calculatePercentage(metrics.requests.non_streamed.total, metrics.requests.total.total)}
          />
        </MetricGrid>
      </MetricSection>

      {/* Performance Metrics */}
      <MetricSection title={t.performanceMetrics} icon={<PerformanceIcon />} tooltip={t.tooltipPerformanceMetrics}>
        <MetricGrid>
          <MetricItem
            title={t.avgResponseTime}
            value={formatResponseTime(metrics.requests.total.avg_response_time_ms)}
            tooltip={t.tooltipResponseTime}
          />
          {metrics.requests.non_streamed.tokens.reported_count > 0 && (
            <MetricItem
              title={t.avgTokensPerSecond}
              value={
                (() => {
                  const totalTokens = metrics.requests.non_streamed.tokens.total;
                  const avgResponseTime = metrics.requests.total.avg_response_time_ms;
                  if (totalTokens > 0 && avgResponseTime > 0) {
                    const tps = (totalTokens / avgResponseTime) * 1000;
                    return `${tps.toFixed(2)} ${t.tokensPerSecond}`;
                  }
                  return t.naStreaming;
                })()
              }
              tooltip={t.tooltipInferenceSpeed}
            />
          )}
        </MetricGrid>
      </MetricSection>

      {/* Token Usage Section */}
      <TokenUsageSection 
        tokenMetrics={metrics.requests.non_streamed.tokens}
        t={t}
      />
    </>
  );
};
