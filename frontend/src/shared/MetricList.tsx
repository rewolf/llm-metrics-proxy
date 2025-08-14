import React, { ReactNode } from 'react';

interface MetricListProps {
  children: ReactNode;
  className?: string;
}

export const MetricList: React.FC<MetricListProps> = ({ children, className = '' }) => {
  return (
    <div className={`metric-list ${className}`.trim()}>
      {children}
    </div>
  );
};

interface MetricListItemProps {
  label: string;
  count: number;
  unit: string;
  className?: string;
}

export const MetricListItem: React.FC<MetricListItemProps> = ({ 
  label, 
  count, 
  unit, 
  className = '' 
}) => {
  return (
    <div className={`metric-item ${className}`.trim()}>
      <span className="item-label">{label}</span>
      <span className="item-count">{count} {unit}</span>
    </div>
  );
};
