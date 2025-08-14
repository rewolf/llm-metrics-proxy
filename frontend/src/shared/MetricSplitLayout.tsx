import React, { ReactNode } from 'react';

interface MetricSplitLayoutProps {
  leftContent: ReactNode;
  rightContent: ReactNode;
  className?: string;
}

export const MetricSplitLayout: React.FC<MetricSplitLayoutProps> = ({ 
  leftContent, 
  rightContent, 
  className = '' 
}) => {
  return (
    <div className={`metric-split-layout ${className}`.trim()}>
      <div className="metric-left">
        {leftContent}
      </div>
      <div className="metric-right">
        {rightContent}
      </div>
    </div>
  );
};
