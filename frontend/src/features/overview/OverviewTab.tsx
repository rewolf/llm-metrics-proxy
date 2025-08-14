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
      <MetricSection title={t.basicStatistics} icon={<DashboardIcon />}>
        <MetricSplitLayout
          leftContent={
            <MetricGrid>
              <MetricItem
                title={t.totalCompletionRequests}
                value={metrics.total_requests}
              />
              <MetricItem
                title={t.successRate}
                value={
                  <span 
                    className="success-rate-value"
                    style={{
                      color: (() => {
                        const successRate = (metrics.successful_requests / metrics.total_requests) * 100;
                        if (successRate === 100) return 'var(--color-metricSuccess, #28a745)';
                        if (successRate >= 90) return 'var(--color-success, #28a745)';
                        if (successRate >= 80) return 'var(--color-warning, #ffc107)';
                        return 'var(--color-metricFailed, #dc3545)';
                      })()
                    }}
                  >
                    {calculatePercentage(metrics.successful_requests, metrics.total_requests)}
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
      <MetricSection title={t.performanceMetrics} icon={<PerformanceIcon />}>
        <MetricSplitLayout
          leftContent={
            <MetricGrid>
              <MetricItem
                title={t.avgResponseTime}
                value={formatResponseTime(metrics.avg_response_time_ms)}
              />
              {metrics.avg_time_to_first_token_ms && (
                <MetricItem
                  title={t.timeToFirstToken}
                  value={formatResponseTime(metrics.avg_time_to_first_token_ms)}
                />
              )}
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
      {metrics.model_distribution && Object.keys(metrics.model_distribution).length > 0 && (
        <MetricSection title={t.modelUsage} icon={<RobotIcon />}>
          <MetricList>
            {Object.entries(metrics.model_distribution)
              .sort(([,a], [,b]) => b - a) // Sort by count descending
              .map(([model, count], index) => (
                <MetricListItem
                  key={index}
                  label={model}
                  count={count}
                  unit={t.requests}
                  className="model-item"
                />
              ))}
          </MetricList>
        </MetricSection>
      )}

      {/* Request Sources */}
      {metrics.origin_distribution && Object.keys(metrics.origin_distribution).length > 0 && (
        <MetricSection title={t.requestSources} icon={<GlobeIcon />}>
          <MetricList>
            {Object.entries(metrics.origin_distribution).map(([origin, count], index) => (
              <MetricListItem
                key={index}
                label={origin}
                count={count}
                unit={t.requests}
                className="origin-item"
              />
            ))}
          </MetricList>
        </MetricSection>
      )}

      {/* Completion Analysis */}
      {metrics.finish_reasons && metrics.finish_reasons.length > 0 && (
        <MetricSection title={t.completionAnalysis} icon={<FinishIcon />}>
          <MetricList>
            {metrics.finish_reasons.map((reason, index) => (
              <MetricListItem
                key={index}
                label={reason.reason}
                count={reason.count}
                unit={t.times}
                className="reason-item"
              />
            ))}
          </MetricList>
        </MetricSection>
      )}

      {/* Error Analysis */}
      {metrics.error_types && metrics.error_types.length > 0 && (
        <MetricSection title={t.errorAnalysis} icon={<ErrorIcon />}>
          <MetricList>
            {metrics.error_types.map((error, index) => (
              <MetricListItem
                key={index}
                label={error.type}
                count={error.count}
                unit={t.times}
                className="error-item"
              />
            ))}
          </MetricList>
        </MetricSection>
      )}
    </>
  );
};
