export function formatDateTime(
   isoString: string | null | undefined,
   locale = 'vi-VN',
   includeTime = true
): string {
   if (!isoString) return '-';
   const date = new Date(isoString);
   if (isNaN(date.getTime())) return '-';

   const options: Intl.DateTimeFormatOptions = includeTime
      ? {
           year: 'numeric',
           month: '2-digit',
           day: '2-digit',
           hour: '2-digit',
           minute: '2-digit',
           second: '2-digit'
        }
      : { year: 'numeric', month: '2-digit', day: '2-digit' };

   return date.toLocaleString(locale, options);
}
