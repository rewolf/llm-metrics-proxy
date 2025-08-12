import React from 'react';
import { Language } from '../types';
import { getTranslation } from '../core/i18n';

export interface Timeframe {
  id: string;
  label: string;
  hours: number;
}

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
  
  const timeframes: Timeframe[] = [
    { id: '1h', label: t.timeframe1h, hours: 1 },
    { id: '6h', label: t.timeframe6h, hours: 6 },
    { id: '12h', label: t.timeframe12h, hours: 12 },
    { id: '1d', label: t.timeframe1d, hours: 24 },
    { id: '1w', label: t.timeframe1w, hours: 168 },
    { id: '1mo', label: t.timeframe1mo, hours: 720 },
    { id: 'all', label: t.timeframeAll, hours: 0 }
  ];

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
