import { describe, expect, it } from 'vitest';
import { format, getMessages, plural, locales } from './index';

describe('format', () => {
  it('fills variables', () => expect(format('{n} replies', { n: 3 })).toBe('3 replies'));
  it('leaves unknown variables visible', () => expect(format('Hi {name}')).toBe('Hi {name}'));
});

describe('plural', () => {
  const en = getMessages('en').home as Record<string, string>;
  const fr = getMessages('fr').home as Record<string, string>;
  it('one', () => expect(plural(en, 'replies', 1, 'en')).toBe('1 reply'));
  it('other', () => expect(plural(en, 'replies', 86, 'en')).toBe('86 replies'));
  it('french zero is singular', () => expect(plural(fr, 'replies', 0, 'fr')).toBe('0 réponse'));
});

describe('message parity', () => {
  it('en and fr have the same keys in every namespace', () => {
    const en = getMessages('en'); const fr = getMessages('fr');
    for (const ns of Object.keys(en) as (keyof typeof en)[]) {
      expect(Object.keys(fr[ns]).sort()).toEqual(Object.keys(en[ns]).sort());
    }
    expect(locales).toEqual(['en', 'fr']);
  });
});
