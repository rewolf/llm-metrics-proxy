import React from 'react';
import { Metrics, CompletionRequestData } from '../../types';
import { calculatePercentage, formatResponseTime } from '../../utils';
import { RequestCountChart, ResponseTimeChart } from '../../shared';
import { MetricSection, MetricGrid, MetricItem, MetricList, MetricListItem, MetricSplitLayout } from '../../shared';
import { 
  DashboardIcon, 
  PerformanceIcon, 
  RobotIcon, 
  GlobeIcon, 
  FinishIcon, 
  ErrorIcon 
} from '../../assets/icons';

interface OverviewTabProps {
  metrics: Metrics;
  completionRequests: CompletionRequestData[];
  currentTimeframe: string;
  t: any; // Translation object
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ 
  metrics, 
  completionRequests, 
  currentTimeframe, 
  t 
}) => {
  return (
    <>
      {/* Basic Stats */}
      <MetricSection title={t.basicStatistics} icon={<DashboardIcon />} tooltip={t.tooltipCompletionRequests}>
        <MetricSplitLayout
          leftContent={
            <MetricGrid>
              <MetricItem
                title={t.totalCompletionRequests}
                value={metrics.requests.total.total}
              />
              <MetricItem
                title={t.successRate}
                value={
                  <span 
                    className="success-rate-value"
                    style={{
                      color: (() => {
                        const successRate = (metrics.requests.total.successful / metrics.requests.total.total) * 100;

                        if (successRate === 100) return 'var(--color-metricSuccess, #28a745)';
                        if (successRate >= 90) return 'var(--color-success, #28a745)';
                        if (successRate >= 80) return 'var(--color-warning, #ffc107)';
                        return 'var(--color-metricFailed, #dc3545)';
                      })()
                    }}
                  >
                    {calculatePercentage(metrics.requests.total.successful, metrics.requests.total.total)}
                  </span>
                }
              />
            </MetricGrid>
          }
          rightContent={
            <RequestCountChart
              requests={completionRequests}
              timeframe={currentTimeframe}
              height={300}
            />
          }
        />
      </MetricSection>

      {/* Response Time Information */}
      <MetricSection title={t.performanceMetrics} icon={<PerformanceIcon />} tooltip={t.tooltipPerformanceMetrics}>
        <MetricSplitLayout
          leftContent={
            <MetricGrid>
              <MetricItem
                title={t.avgResponseTime}
                value={formatResponseTime(metrics.requests.total.avg_response_time_ms)}
                tooltip={t.tooltipResponseTime}
              />
              {(() => {
                // Use corrected API values for inference speed
                const nonStreamedTPS = metrics.requests.non_streamed.tokens.avg_tokens_per_second;
                const streamedTPS = metrics.requests.streamed.tokens.avg_tokens_per_second;
                
                if (nonStreamedTPS !== null && nonStreamedTPS !== undefined) {
                  return (
                    <MetricItem
                      title={t.avgTokensPerSecond}
                      value={`${nonStreamedTPS.toFixed(2)} ${t.tokensPerSecond}`}
                      tooltip={t.tooltipInferenceSpeed}
                    />
                  );
                }
                return null;
              })()}
            </MetricGrid>
          }
          rightContent={
            <ResponseTimeChart
              requests={completionRequests}
              timeframe={currentTimeframe}
              height={300}
            />
          }
        />
        <div className="metric-note">
          <small>{t.performanceNote}</small>
        </div>
      </MetricSection>

      {/* Model Usage */}
      <MetricSection title={t.modelUsage} icon={<RobotIcon />} tooltip={t.tooltipModelUsage}>
        <MetricList>
          {Object.entries(metrics.model_distribution).map(([model, count]) => (
            <MetricListItem
              key={model}
              label={model}
              count={count}
              unit={t.requests}
            />
          ))}
        </MetricList>
      </MetricSection>

      {/* Request Sources */}
      <MetricSection title={t.requestSources} icon={<GlobeIcon />} tooltip={t.tooltipRequestSources}>
        <MetricList>
          {Object.entries(metrics.origin_distribution).map(([origin, count]) => (
            <MetricListItem
              key={origin}
              label={origin}
              count={count}
              unit={t.requests}
            />
          ))}
        </MetricList>
      </MetricSection>
    </>
  );
};
