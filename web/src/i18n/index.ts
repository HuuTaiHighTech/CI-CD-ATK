export const i18n = {
  default: 'vi',
  locales: ['vi', 'en']
} as const;

export type Locale = (typeof i18n.locales)[number];

export const localeCodes: Record<Locale, string> = {
  vi: 'vi_VN',
  en: 'en_US'
};

export const localeNames: Record<Locale, string> = {
  vi: 'Tiếng Việt',
  en: 'English'
};
