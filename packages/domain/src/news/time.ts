/** "35 min. ago", "3 hr. ago", "2 days ago" in the reader's language. At least one minute. */
export function relativeAgo(at: number, now: number, locale: string): string {
  const minutes = Math.max(1, Math.round((now - at) / 60000));
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'always', style: 'short' });
  if (minutes < 60) return rtf.format(-minutes, 'minute');
  if (minutes < 1440) return rtf.format(-Math.round(minutes / 60), 'hour');
  return rtf.format(-Math.round(minutes / 1440), 'day');
}
