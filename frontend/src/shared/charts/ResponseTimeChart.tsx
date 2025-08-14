import React from 'react';
import { BaseChart, ChartDataPoint } from './BaseChart';
import { CompletionRequestData } from '../../types';
import { aggregateRequestsByTime } from '../../utils';

export interface ResponseTimeChartProps {
  requests: CompletionRequestData[];
  timeframe: string;
  height?: number;
  className?: string;
}

export const ResponseTimeChart: React.FC<ResponseTimeChartProps> = ({
  requests,
  timeframe,
  height = 300,
  className = ''
}) => {
  // Aggregate requests by time buckets using new utility function
  const aggregatedData = aggregateRequestsByTime(
    requests,
    timeframe,
    (bucketRequests) => {
      // Filter requests that have response time data
      const requestsWithTime = bucketRequests.filter(req => 
        req.time_to_last_token_ms !== null && req.time_to_last_token_ms !== undefined
      );
      
      if (requestsWithTime.length === 0) return 0;
      
      // Calculate average response time for the bucket
      const totalTime = requestsWithTime.reduce((sum, req) => 
        sum + (req.time_to_last_token_ms || 0), 0
      );
      
      return Math.round(totalTime / requestsWithTime.length);
    }
  );

  return (
    <BaseChart
      data={aggregatedData}
      title="Response Time"
      yAxisLabel="Response Time (ms)"
      timeframe={timeframe}
      height={height}
      className={className}
    />
  );
};
