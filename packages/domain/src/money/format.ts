/** Number and money formatting. Pure, locale-aware, no React. */

export function formatNumber(value: number, decimals: number, locale: string): string {
  return new Intl.NumberFormat(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
}

/** +0.84% / -0.31% / 0.00% */
export function formatSignedPercent(pct: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2, signDisplay: 'exceptZero',
  }).format(pct / 100);
}

/** $1.28M from minor units (cents). */
export function formatCompactMoney(amountMinor: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency, notation: 'compact', maximumFractionDigits: 2 }).format(amountMinor / 100);
}
