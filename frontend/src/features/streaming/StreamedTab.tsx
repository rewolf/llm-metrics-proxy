import React from 'react';
import { Metrics } from '../../types';
import { calculatePercentage, formatResponseTime } from '../../utils';
import { MetricSection, MetricGrid, MetricItem, MetricSplitLayout } from '../../shared';
import { 
  StreamingIcon, 
  PerformanceIcon,
  TokenIcon
} from '../../assets/icons';

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
          
          {metrics.requests.streamed.tokens.reported_count > 0 && (
            <MetricItem
              title={t.tokensPerSecond}
              value={
                (() => {
                  const totalTokens = metrics.requests.streamed.tokens.total;
                  const avgResponseTime = metrics.requests.streamed.avg_response_time_ms;
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
      {metrics.requests.streamed.tokens.reported_count > 0 && (
        <MetricSection title={t.tokenUsage} icon={<TokenIcon />} tooltip={t.tooltipTokenUsage}>
          {/* Row 1: Prompt Tokens */}
          <MetricSplitLayout className="token-usage-row"
            leftContent={
              <MetricItem
                title={t.promptTokens}
                value={metrics.requests.streamed.tokens.prompt_total.toFixed(0)}
              />
            }
            rightContent={
              <MetricItem
                title={t.promptTokensPerRequest}
                value={(metrics.requests.streamed.tokens.prompt_total / metrics.requests.streamed.tokens.reported_count).toFixed(1)}
              />
            }
          />
          
          {/* Row 2: Completion Tokens */}
          <MetricSplitLayout className="token-usage-row"
            leftContent={
              <MetricItem
                title={t.completionTokens}
                value={metrics.requests.streamed.tokens.completion_total.toFixed(0)}
              />
            }
            rightContent={
              <MetricItem
                title={t.completionTokensPerRequest}
                value={(metrics.requests.streamed.tokens.completion_total / metrics.requests.streamed.tokens.reported_count).toFixed(1)}
              />
            }
          />
          
          {/* Row 3: Total Tokens */}
          <MetricSplitLayout className="token-usage-row"
            leftContent={
              <MetricItem
                title={t.totalTokens}
                value={metrics.requests.streamed.tokens.total.toFixed(0)}
              />
            }
            rightContent={
              <MetricItem
                title={t.totalTokensPerRequest}
                value={(metrics.requests.streamed.tokens.total / metrics.requests.streamed.tokens.reported_count).toFixed(1)}
              />
            }
          />
          
          <div className="metric-note">
            <small>{t.tokenUsageNoteStreaming}</small>
          </div>
        </MetricSection>
      )}
    </>
  );
};
