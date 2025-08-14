import React, { ReactNode } from 'react';

interface MetricSectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  tooltip?: string;
}

export const MetricSection: React.FC<MetricSectionProps> = ({ 
  title, 
  icon, 
  children, 
  className = '',
  tooltip
}) => {
  return (
    <div className={`metric-section ${className}`.trim()}>
      <h2 data-tooltip={tooltip}>
        {icon && <span className="section-icon">{icon}</span>}
        {title}
      </h2>
      {children}
    </div>
  );
};
