import { Language, Translation } from '../../types';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { de } from './de';
import { ja } from './ja';
import { zh } from './zh';
import { ru } from './ru';
import { ko } from './ko';

// Translation map
export const translations: Record<Language, Translation> = {
  en,
  es,
  fr,
  de,
  ja,
  zh,
  ru,
  ko
};
