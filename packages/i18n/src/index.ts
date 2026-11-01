import enNav from '../messages/en/nav.json';
import frNav from '../messages/fr/nav.json';
import enHome from '../messages/en/home.json';
import frHome from '../messages/fr/home.json';
import enExplore from '../messages/en/explore.json';
import frExplore from '../messages/fr/explore.json';
import enNews from '../messages/en/news.json';
import frNews from '../messages/fr/news.json';
import enCommunity from '../messages/en/community.json';
import frCommunity from '../messages/fr/community.json';
import enCompose from '../messages/en/compose.json';
import frCompose from '../messages/fr/compose.json';
import enProfile from '../messages/en/profile.json';
import frProfile from '../messages/fr/profile.json';
import enCommon from '../messages/en/common.json';
import frCommon from '../messages/fr/common.json';

export const locales = ['en', 'fr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v);

const messages = { en: { nav: enNav, home: enHome, explore: enExplore, profile: enProfile, news: enNews, community: enCommunity, compose: enCompose, common: enCommon },
  fr: { nav: frNav, home: frHome, explore: frExplore, profile: frProfile, news: frNews, community: frCommunity, compose: frCompose, common: frCommon } } as const;
export type Messages = (typeof messages)['en'];

/** Messages for a locale. More namespaces are added as screens are built. */
export function getMessages(locale: string): Messages {
  return isLocale(locale) ? messages[locale] : messages[defaultLocale];
}

/** Locale tag used for number and currency formatting (en uses US style so USD reads "$"). */
export function numberLocale(locale: string): string {
  return locale === 'fr' ? 'fr-FR' : 'en-US';
}
/** Locale tag used for dates ("Saturday 24 October"). */
export function dateLocale(locale: string): string {
  return locale === 'fr' ? 'fr-FR' : 'en-GB';
}

export type Vars = Record<string, string | number>;

/** "{n} replies" + { n: 3 } -> "3 replies" */
export function format(template: string, vars: Vars = {}): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`));
}

/** Picks key_one / key_other (CLDR plural rules for the locale), then formats. `n` is added to vars. */
export function plural(dict: Record<string, string>, key: string, n: number, locale: string, vars: Vars = {}): string {
  const rule = new Intl.PluralRules(locale).select(n);
  const tpl = dict[`${key}_${rule}`] ?? dict[`${key}_other`] ?? key;
  return format(tpl, { n, ...vars });
}
