import { Language, Translation } from '../../types';
import { translations } from './translations';

/**
 * Gets translation for the specified language
 */
export function getTranslation(language: Language): Translation {
  return translations[language] || translations.en;
}

/**
 * Gets all available languages
 */
export function getAvailableLanguages(): Language[] {
  return Object.keys(translations) as Language[];
}

/**
 * Gets the default language
 */
export function getDefaultLanguage(): Language {
  return 'en';
}
