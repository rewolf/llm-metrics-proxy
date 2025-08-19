import React from 'react';
import { BaseChart, ChartDataPoint } from './BaseChart';
import { CompletionRequestData } from '../../types';
import { aggregateRequestsByTime } from '../../utils';

export interface RequestCountChartProps {
  requests: CompletionRequestData[];
  timeframe: string;
  height?: number;
  className?: string;
  t?: any; // Translation object
}

export const RequestCountChart: React.FC<RequestCountChartProps> = ({
  requests,
  timeframe,
  height = 300,
  className = '',
  t
}) => {
  // Aggregate successful and failed requests separately
  const successfulRequests = requests.filter(req => req.success);
  const failedRequests = requests.filter(req => !req.success);

  const successfulData = aggregateRequestsByTime(
    successfulRequests,
    timeframe,
    (bucketRequests) => bucketRequests.length
  );

  const failedData = aggregateRequestsByTime(
    failedRequests,
    timeframe,
    (bucketRequests) => bucketRequests.length
  );

  // Get computed CSS custom properties for theme-aware colors
  const getComputedColor = (property: string, fallback: string): string => {
    if (typeof window !== 'undefined') {
      const computed = getComputedStyle(document.documentElement).getPropertyValue(property);
      return computed.trim() || fallback;
    }
    return fallback;
  };

  // Use theme-aware colors for failed requests, keep default blue for successful
  const successColor = 'rgba(54, 162, 235, 1)'; // Default blue color
  const failureColor = getComputedColor('--color-metricFailed', '#dc3545'); // Theme-aware failure color

  // Check if there are any failed requests to determine if legend should be shown
  const hasFailedRequests = failedRequests.length > 0;

  const chartData = {
    datasets: [
      {
        label: t?.successfulRequestsLabel || 'Successful Requests',
        data: successfulData.map(point => ({
          x: point.timestamp,
          y: point.value
        })),
        backgroundColor: 'rgba(54, 162, 235, 0.6)', // Default blue with opacity
        borderColor: successColor,
        borderWidth: 1,
      },
      // Only include failed requests dataset if there are any
      ...(hasFailedRequests ? [{
        label: t?.failedRequestsLabel || 'Failed Requests',
        data: failedData.map(point => ({
          x: point.timestamp,
          y: point.value
        })),
        backgroundColor: `${failureColor}80`, // Theme color with 50% opacity
        borderColor: failureColor,
        borderWidth: 1,
      }] : [])
    ],
  };

  return (
    <BaseChart
      data={chartData}
      title={t?.requestsChartTitle || "Requests"}
      yAxisLabel={t?.requestsChartYAxisLabel || "Number of Requests"}
      timeframe={timeframe}
      height={height}
      className={className}
      showLegend={hasFailedRequests}
    />
  );
};
