import React, { ReactNode } from 'react';

interface MetricSectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const MetricSection: React.FC<MetricSectionProps> = ({ 
  title, 
  icon, 
  children, 
  className = '' 
}) => {
  return (
    <div className={`metric-section ${className}`.trim()}>
      <h2>
        {icon && <span className="section-icon">{icon}</span>}
        {title}
      </h2>
      {children}
    </div>
  );
};
