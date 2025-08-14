import React from 'react';
import { MetricSection, MetricSplitLayout, MetricItem } from './index';
import { TokenIcon } from '../assets/icons';
import { TokenMetrics } from '../types';

interface TokenUsageSectionProps {
  tokenMetrics: TokenMetrics;
  noteText?: string;
  t: any; // Translation object
}

export const TokenUsageSection: React.FC<TokenUsageSectionProps> = ({ 
  tokenMetrics, 
  noteText, 
  t 
}) => {
  // Only show section if we have reported token data
  if (tokenMetrics.reported_count === 0) {
    return null;
  }

  return (
    <MetricSection title={t.tokenUsage} icon={<TokenIcon />} tooltip={t.tooltipTokenUsage}>
      {/* Row 1: Prompt Tokens */}
      <MetricSplitLayout className="token-usage-row"
        leftContent={
          <MetricItem
            title={t.promptTokens}
            value={tokenMetrics.prompt_total.toFixed(0)}
          />
        }
        rightContent={
          <MetricItem
            title={t.promptTokensPerRequest}
            value={(tokenMetrics.prompt_total / tokenMetrics.reported_count).toFixed(1)}
          />
        }
      />
      
      {/* Row 2: Completion Tokens */}
      <MetricSplitLayout className="token-usage-row"
        leftContent={
          <MetricItem
            title={t.completionTokens}
            value={tokenMetrics.completion_total.toFixed(0)}
          />
        }
        rightContent={
          <MetricItem
            title={t.completionTokensPerRequest}
            value={(tokenMetrics.completion_total / tokenMetrics.reported_count).toFixed(1)}
          />
        }
      />
      
      {/* Row 3: Total Tokens */}
      <MetricSplitLayout className="token-usage-row"
        leftContent={
          <MetricItem
            title={t.totalTokens}
            value={tokenMetrics.total.toFixed(0)}
          />
        }
        rightContent={
          <MetricItem
            title={t.totalTokensPerRequest}
            value={(tokenMetrics.total / tokenMetrics.reported_count).toFixed(1)}
          />
        }
      />
      
      {/* Optional note text (used by streaming version) */}
      {noteText && (
        <div className="metric-note">
          <small>{noteText}</small>
        </div>
      )}
    </MetricSection>
  );
};
