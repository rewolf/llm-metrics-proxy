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
        <span className="theme-selector-text">🎨 {currentThemeName}</span>
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
