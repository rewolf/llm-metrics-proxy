import { useState, useRef, useEffect } from 'react';
import { getAllThemes } from '../core/themes';

interface ThemeSelectorProps {
  currentThemeId: string;
  onThemeChange: (themeId: string) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentThemeId,
  onThemeChange
}) => {
  const themes = getAllThemes();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentTheme = themes.find(theme => theme.id === currentThemeId);
  const currentThemeName = currentTheme ? currentTheme.name : '';

  const handleThemeSelect = (themeId: string) => {
    onThemeChange(themeId);
    setIsOpen(false);
  };

  return (
    <div className="theme-selector" ref={dropdownRef}>
      <button
        className="theme-selector-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        title="Select theme"
      >
        <span className="theme-selector-text">
          <svg width="16" height="16" viewBox="0 0 512 512" fill="currentColor" style={{ transform: 'scale(0.9)', marginRight: '8px', verticalAlign: 'middle' }}>
            <g fill="currentColor">
              <path d="M479.308,204.721V68.686h-65.385V36.108C413.923,16.198,397.723,0,377.813,0H68.801C48.89,0,32.691,16.198,32.691,36.108    v95.572c0,19.911,16.198,36.109,36.109,36.109h309.012c19.911,0,36.109-16.199,36.109-36.109V99.103h34.968v80.422L208.097,225.15    v53.155h-27.375v233.694h85.168V278.305h-27.375v-27.96L479.308,204.721z"/>
              <path d="M377.813,137.372H68.801    c-3.138,0-5.692-2.554-5.692-5.692V36.108c0-3.138,2.554-5.691,5.692-5.691h309.012c3.139,0,5.692,2.554,5.692,5.691v95.572h0.001    C383.505,134.819,380.951,137.372,377.813,137.372z"/>
              <path d="M235.474,481.583H211.14v-172.86h24.334V481.583z"/>
            </g>
          </svg>
          {currentThemeName}
        </span>
        <span className="theme-selector-arrow">▼</span>
      </button>
      
      {isOpen && (
        <div className="theme-selector-menu">
          {themes.map(theme => (
            <button
              key={theme.id}
              className={`theme-selector-item ${theme.id === currentThemeId ? 'selected' : ''}`}
              onClick={() => handleThemeSelect(theme.id)}
            >
              <div className="theme-selector-item-content">
                <div className="theme-selector-item-name">{theme.name}</div>
                <div className="theme-selector-item-description">{theme.description}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
