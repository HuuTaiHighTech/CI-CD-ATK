const LOCALE_MAP: Record<string, string> = {
  vi: 'vi-VN',
  en: 'en-US'
};

export function formatDate(iso: string, locale: string = 'vi') {
  return new Intl.DateTimeFormat(LOCALE_MAP[locale], {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Ho_Chi_Minh'
  }).format(new Date(iso));
}
