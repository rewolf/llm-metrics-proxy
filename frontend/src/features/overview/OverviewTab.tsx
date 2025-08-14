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
      {/* Completion Requests Overview */}
      <MetricSection title={t.basicStatistics} icon={<DashboardIcon />} tooltip={t.tooltipCompletionRequests}>
        <MetricGrid>
          <MetricItem
            title={t.totalCompletionRequests}
            value={metrics.requests.total.total}
          />
          <MetricItem
            title={t.successfulRequests}
            value={metrics.requests.total.successful}
          />
          <MetricItem
            title={t.failedRequests}
            value={metrics.requests.total.failed}
          />
          <MetricItem
            title={t.successRate}
            value={calculatePercentage(metrics.requests.total.successful, metrics.requests.total.total)}
          />
        </MetricGrid>
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
                const totalTokens = (metrics.requests.streamed.tokens.total || 0) + (metrics.requests.non_streamed.tokens.total || 0);
                const avgResponseTime = metrics.requests.total.avg_response_time_ms;
                if (totalTokens > 0 && avgResponseTime > 0) {
                  const tps = (totalTokens / avgResponseTime) * 1000;
                  return (
                    <MetricItem
                      title={t.avgTokensPerSecond}
                      value={`${tps.toFixed(2)} ${t.tokensPerSecond}`}
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
