/** Map i18n language code to an Intl locale string for date/time formatting */
const LOCALE_MAP: Record<string, string> = {
  en: 'en-GB',
  fr: 'fr-FR',
  es: 'es-ES',
  de: 'de-DE',
  pl: 'pl-PL',
  ja: 'ja-JP',
  ko: 'ko-KR',
};

export function langToLocale(lang: string): string {
  return LOCALE_MAP[lang] || 'en-GB';
}
