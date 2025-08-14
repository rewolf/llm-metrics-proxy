import React, { ReactNode } from 'react';

interface MetricGridProps {
  children: ReactNode;
  className?: string;
}

export const MetricGrid: React.FC<MetricGridProps> = ({ children, className = '' }) => {
  return (
    <div className={`metric-grid ${className}`.trim()}>
      {children}
    </div>
  );
};

interface MetricItemProps {
  title: string;
  value: ReactNode;
  className?: string;
}

export const MetricItem: React.FC<MetricItemProps> = ({ title, value, className = '' }) => {
  return (
    <div className={`metric ${className}`.trim()}>
      <h3>{title}</h3>
      <div className="value">{value}</div>
    </div>
  );
};
