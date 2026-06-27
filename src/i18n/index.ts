export type Lang = 'de' | 'en' | 'la';

export const LANGS: Lang[] = ['de', 'en', 'la'];

/** Kurzes Kürzel für den Umschalter */
export const LANG_LABELS: Record<Lang, string> = {
  de: 'DE',
  en: 'EN',
  la: 'LA',
};

/** Ausgeschriebener Name (für aria/title) */
export const LANG_NAMES: Record<Lang, string> = {
  de: 'Deutsch',
  en: 'English',
  la: 'Latina',
};

export { LanguageProvider, useI18n, useLang, useT } from './LanguageContext';
export { ui, type UiKey } from './ui';

/** Lokalisierter Textwert in allen Sprachen */
export type Localized = Record<Lang, string>;

/** Wert in der aktuellen Sprache, mit Deutsch als Rückfall */
export const pick = (value: Localized, lang: Lang): string => value[lang] ?? value.de;
