import React from 'react';
import { BaseChart, ChartDataPoint } from './BaseChart';
import { CompletionRequestData } from '../../types';
import { aggregateRequestsByTime } from '../../utils';

export interface RequestCountChartProps {
  requests: CompletionRequestData[];
  timeframe: string;
  height?: number;
  className?: string;
}

export const RequestCountChart: React.FC<RequestCountChartProps> = ({
  requests,
  timeframe,
  height = 300,
  className = ''
}) => {
  // Aggregate requests by time buckets using new utility function
  const aggregatedData = aggregateRequestsByTime(
    requests,
    timeframe,
    (bucketRequests) => bucketRequests.length // Count requests in each bucket
  );

  return (
    <BaseChart
      data={aggregatedData}
      title="Request Count Over Time"
      yAxisLabel="Number of Requests"
      timeframe={timeframe}
      height={height}
      className={className}
    />
  );
};
