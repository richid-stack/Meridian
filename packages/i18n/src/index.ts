import enNav from '../messages/en/nav.json';
import frNav from '../messages/fr/nav.json';

export const locales = ['en', 'fr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v);

const messages = { en: { nav: enNav }, fr: { nav: frNav } } as const;
export type Messages = (typeof messages)['en'];

/** Messages for a locale. More namespaces are added as screens are built. */
export function getMessages(locale: string): Messages {
  return isLocale(locale) ? messages[locale] : messages[defaultLocale];
}
