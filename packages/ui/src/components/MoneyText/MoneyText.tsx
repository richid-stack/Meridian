import styles from './MoneyText.module.css';

export function formatMoney(amountMinor: number, currency: string, locale = 'en'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(amountMinor / 100);
}

export function MoneyText({ amountMinor, currency, locale }: { amountMinor: number; currency: string; locale?: string }) {
  return <span className={styles.root}>{formatMoney(amountMinor, currency, locale)}</span>;
}
