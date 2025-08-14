import { Language, Translation } from '../../types';
import { translations } from './translations';

/**
 * Detects the user's preferred language from browser settings
 * Falls back to English if no supported language is detected
 */
export function detectUserLanguage(): Language {
  // Check if we're in a browser environment
  if (typeof navigator === 'undefined') {
    return 'en';
  }

  // Get the user's preferred languages from browser
  const userLanguages = navigator.languages || [navigator.language];
  
  // Map of browser language codes to our supported languages
  const languageMap: Record<string, Language> = {
    // English variants
    'en': 'en',
    'en-US': 'en',
    'en-GB': 'en',
    'en-CA': 'en',
    'en-AU': 'en',
    
    // Spanish variants
    'es': 'es',
    'es-ES': 'es',
    'es-MX': 'es',
    'es-AR': 'es',
    'es-CO': 'es',
    
    // French variants
    'fr': 'fr',
    'fr-FR': 'fr',
    'fr-CA': 'fr',
    'fr-BE': 'fr',
    'fr-CH': 'fr',
    
    // German variants
    'de': 'de',
    'de-DE': 'de',
    'de-AT': 'de',
    'de-CH': 'de',
    'de-LU': 'de',
    
    // Japanese variants
    'ja': 'ja',
    'ja-JP': 'ja',
    
    // Chinese variants
    'zh': 'zh',
    'zh-CN': 'zh',
    'zh-Hans': 'zh',
    'zh-Hans-CN': 'zh',
    'zh-TW': 'zh',
    'zh-Hant': 'zh',
    'zh-Hant-TW': 'zh',
    'zh-HK': 'zh',
    'zh-Hant-HK': 'zh',
    
    // Russian variants
    'ru': 'ru',
    'ru-RU': 'ru',
    'ru-BY': 'ru',
    'ru-KZ': 'ru',
    
    // Korean variants
    'ko': 'ko',
    'ko-KR': 'ko',
    'ko-KP': 'ko'
  };

  // Try to find a match in the user's preferred languages
  for (const userLang of userLanguages) {
    // Try exact match first
    if (languageMap[userLang]) {
      return languageMap[userLang];
    }
    
    // Try to match the base language (e.g., 'en' from 'en-US')
    const baseLang = userLang.split('-')[0];
    if (languageMap[baseLang]) {
      return languageMap[baseLang];
    }
  }

  // Fallback to English if no supported language is found
  return 'en';
}

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
 * Gets the default language, prioritizing stored preferences over automatic detection
 */
export function getDefaultLanguage(): Language {
  // First, check if there's a stored language preference
  if (typeof localStorage !== 'undefined') {
    try {
      const stored = localStorage.getItem('llm-metrics-preferences');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.language && isValidLanguage(parsed.language)) {
          return parsed.language;
        }
      }
    } catch (error) {
      // Ignore errors, fall back to automatic detection
      console.warn('Failed to parse stored language preference:', error);
    }
  }
  
  // If no stored preference, use automatic detection
  return detectUserLanguage();
}

/**
 * Checks if a language code is valid and supported
 */
function isValidLanguage(lang: any): lang is Language {
  return typeof lang === 'string' && getAvailableLanguages().includes(lang as Language);
}

/**
 * Saves language preference to localStorage
 */
export function saveLanguagePreference(language: Language): void {
  if (typeof localStorage !== 'undefined') {
    try {
      const stored = localStorage.getItem('llm-metrics-preferences');
      const preferences = stored ? JSON.parse(stored) : {};
      preferences.language = language;
      localStorage.setItem('llm-metrics-preferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  }
}

/**
 * Debug function to see what language detection found
 * Useful for development and troubleshooting
 */
export function debugLanguageDetection(): {
  navigatorLanguage: string | undefined;
  navigatorLanguages: readonly string[] | undefined;
  detectedLanguage: Language;
  availableLanguages: Language[];
  storedLanguagePreference: Language | null;
  finalLanguage: Language;
} {
  return {
    navigatorLanguage: typeof navigator !== 'undefined' ? navigator.language : undefined,
    navigatorLanguages: typeof navigator !== 'undefined' ? navigator.languages : undefined,
    detectedLanguage: detectUserLanguage(),
    availableLanguages: getAvailableLanguages(),
    storedLanguagePreference: getStoredLanguagePreference(),
    finalLanguage: getDefaultLanguage()
  };
}

/**
 * Gets the stored language preference from localStorage (if any)
 */
export function getStoredLanguagePreference(): Language | null {
  if (typeof localStorage !== 'undefined') {
    try {
      const stored = localStorage.getItem('llm-metrics-preferences');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.language && isValidLanguage(parsed.language)) {
          return parsed.language;
        }
      }
    } catch (error) {
      // Ignore errors
    }
  }
  return null;
}
