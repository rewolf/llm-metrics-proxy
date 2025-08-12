import { useState } from 'react';
import { Language } from '../types';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageSelect = (language: Language) => {
    onLanguageChange(language);
    setIsOpen(false);
  };

  const languages: { value: Language; label: string }[] = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'ja', label: '日本語' },
    { value: 'zh', label: '中文' },
    { value: 'ru', label: 'Русский' },
    { value: 'ko', label: '한국어' }
  ];

  const currentLanguageLabel = languages.find(lang => lang.value === currentLanguage)?.label || 'English';

  return (
    <div className="language-dropdown">
      <button
        className="language-dropdown-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="language-dropdown-button-text">{currentLanguageLabel}</span>
        <span className="language-dropdown-arrow">▼</span>
      </button>
      {isOpen && (
        <div className="language-dropdown-menu">
          {languages.map(language => (
            <button
              key={language.value}
              className={`language-dropdown-item ${language.value === currentLanguage ? 'selected' : ''}`}
              onClick={() => handleLanguageSelect(language.value)}
            >
              {language.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
