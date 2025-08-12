import { Language, Translation } from '../../types';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { de } from './de';
import { ja } from './ja';

// Translation map
export const translations: Record<Language, Translation> = {
  en,
  es,
  fr,
  de,
  ja
};
