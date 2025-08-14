import React from 'react';
import { Metrics } from '../../types';
import { calculatePercentage, formatResponseTime, formatNumber } from '../../utils';
import { MetricSection, MetricGrid, MetricItem } from '../../shared';
import { 
  DocumentIcon, 
  PerformanceIcon, 
  TokenIcon 
} from '../../assets/icons';

interface NonStreamedTabProps {
  metrics: Metrics;
  t: any; // Translation object
}

export const NonStreamedTab: React.FC<NonStreamedTabProps> = ({ metrics, t }) => {
  return (
    <>
      {/* Non-streamed Requests Overview */}
      <MetricSection title={t.nonStreamedRequests} icon={<DocumentIcon />}>
        <MetricGrid>
          <MetricItem
            title={t.nonStreamedRequestsCount}
            value={metrics.non_streaming_requests}
          />
          <MetricItem
            title={t.nonStreamedRequestsPercent}
            value={calculatePercentage(metrics.non_streaming_requests, metrics.total_requests)}
          />
        </MetricGrid>
      </MetricSection>

      {/* Token Usage */}
      {metrics.total_tokens_used && metrics.total_tokens_used > 0 && (
        <MetricSection title={t.tokenUsage} icon={<TokenIcon />}>
          <MetricGrid>
            <MetricItem
              title={t.totalTokensUsed}
              value={formatNumber(metrics.total_tokens_used)}
            />
            <MetricItem
              title={t.tokensPerRequest}
              value={metrics.avg_tokens_per_request || 0}
            />
          </MetricGrid>
        </MetricSection>
      )}

      {/* Performance Metrics */}
      <MetricSection title={t.performanceMetrics} icon={<PerformanceIcon />}>
        <MetricGrid>
          <MetricItem
            title={t.avgResponseTime}
            value={formatResponseTime(metrics.avg_response_time_ms)}
          />
          <MetricItem
            title={t.tokensPerSecond}
            value={
              metrics.avg_tokens_per_second ? `${metrics.avg_tokens_per_second.toFixed(2)} ${t.tokensPerSecond}` : t.naStreaming
            }
          />
        </MetricGrid>
      </MetricSection>
    </>
  );
};
