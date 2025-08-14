import React from 'react';
import { Metrics } from '../../types';
import { calculatePercentage, formatResponseTime, formatNumber } from '../../utils';
import { MetricSection, MetricGrid, MetricItem, MetricSplitLayout } from '../../shared';
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
            value={metrics.requests.non_streamed.total}
          />
          <MetricItem
            title={t.nonStreamedRequestsPercent}
            value={calculatePercentage(metrics.requests.non_streamed.total, metrics.requests.total.total)}
          />
        </MetricGrid>
      </MetricSection>

      {/* Performance Metrics */}
      <MetricSection title={t.performanceMetrics} icon={<PerformanceIcon />}>
        <MetricGrid>
          <MetricItem
            title={t.avgResponseTime}
            value={formatResponseTime(metrics.requests.total.avg_response_time_ms)}
          />
          <MetricItem
            title={t.tokensPerSecond}
            value={
              metrics.requests.non_streamed.tokens.avg_tokens_per_second ? 
                `${metrics.requests.non_streamed.tokens.avg_tokens_per_second.toFixed(2)} ${t.tokensPerSecond}` : 
                t.naStreaming
            }
          />
        </MetricGrid>
      </MetricSection>

      {/* Token Usage Section */}
      {metrics.requests.non_streamed.tokens.reported_count > 0 && (
        <MetricSection title={t.tokenUsage} icon={<TokenIcon />}>
          {/* Row 1: Prompt Tokens */}
          <MetricSplitLayout className="token-usage-row"
            leftContent={
              <MetricItem
                title={t.promptTokens}
                value={metrics.requests.non_streamed.tokens.prompt_total.toFixed(0)}
              />
            }
            rightContent={
              <MetricItem
                title={t.promptTokensPerRequest}
                value={(metrics.requests.non_streamed.tokens.prompt_total / metrics.requests.non_streamed.tokens.reported_count).toFixed(1)}
              />
            }
          />
          
          {/* Row 2: Completion Tokens */}
          <MetricSplitLayout className="token-usage-row"
            leftContent={
              <MetricItem
                title={t.completionTokens}
                value={metrics.requests.non_streamed.tokens.completion_total.toFixed(0)}
              />
            }
            rightContent={
              <MetricItem
                title={t.completionTokensPerRequest}
                value={(metrics.requests.non_streamed.tokens.completion_total / metrics.requests.non_streamed.tokens.reported_count).toFixed(1)}
              />
            }
          />
          
          {/* Row 3: Total Tokens */}
          <MetricSplitLayout className="token-usage-row"
            leftContent={
              <MetricItem
                title={t.totalTokens}
                value={metrics.requests.non_streamed.tokens.total.toFixed(0)}
              />
            }
            rightContent={
              <MetricItem
                title={t.totalTokensPerRequest}
                value={(metrics.requests.non_streamed.tokens.total / metrics.requests.non_streamed.tokens.reported_count).toFixed(1)}
              />
            }
          />
        </MetricSection>
      )}
    </>
  );
};
