import React from 'react';
import { Language, Timeframe } from '../types';
import { getTranslation } from '../core/i18n';
import { AVAILABLE_TIMEFRAMES } from '../core/timeframes';

interface TimeframeSelectorProps {
  currentTimeframe: string;
  onTimeframeChange: (timeframe: string) => void;
  currentLanguage: Language;
}

export const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({
  currentTimeframe,
  onTimeframeChange,
  currentLanguage
}) => {
  const t = getTranslation(currentLanguage);
  
  const timeframes: Timeframe[] = AVAILABLE_TIMEFRAMES.map(tf => ({
    ...tf,
    label: t[`timeframe${tf.id.charAt(0).toUpperCase() + tf.id.slice(1)}` as keyof typeof t] || tf.label
  }));

  return (
    <div className="timeframe-selector">
      <select
        value={currentTimeframe}
        onChange={(e) => onTimeframeChange(e.target.value)}
        className="timeframe-dropdown"
      >
        {timeframes.map((timeframe) => (
          <option key={timeframe.id} value={timeframe.id}>
            {timeframe.label}
          </option>
        ))}
      </select>
    </div>
  );
};
