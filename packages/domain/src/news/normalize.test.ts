import { describe, expect, it } from 'vitest';
import { normalizeAggregator, normalizeEvents } from './normalize';

describe('normalizeAggregator', () => {
  it('maps fields and applies defaults', () => {
    const s = normalizeAggregator({ id: 'a', source: { name: 'Wire' }, title: 'T', url: 'https://x.test/a', publishedAt: '2026-01-01T00:00:00.000Z' });
    expect(s).toMatchObject({ id: 'a', source: 'Wire', snippet: '', region: 'pan', topic: 'markets', lang: 'en', entities: [], africaRel: false, translation: null });
    expect(s.at).toBe(Date.parse('2026-01-01T00:00:00.000Z'));
  });
});

describe('normalizeEvents', () => {
  it('keeps English stories untranslated', () => {
    const s = normalizeEvents({ id: 'b', src: 'Ledger', title: { en: 'Hello' }, summary: { en: 'S' }, link: 'https://x.test/b', pub: '2026-01-01T00:00:00.000Z', lang: 'en' });
    expect(s.title).toBe('Hello');
    expect(s.translation).toBeNull();
  });
  it('shows the original and keeps the English version as the translation', () => {
    const s = normalizeEvents({ id: 'c', src: 'Dakar', title: { fr: 'Bonjour', en: 'Hello' }, summary: { fr: 'Salut', en: 'Hi' }, link: 'https://x.test/c', pub: '2026-01-01T00:00:00.000Z', lang: 'fr' });
    expect(s).toMatchObject({ title: 'Bonjour', titleEn: 'Hello', snippet: 'Salut', lang: 'fr', translation: { title: 'Hello', snippet: 'Hi' } });
  });
  it('falls back to English when the language is missing', () => {
    const s = normalizeEvents({ id: 'd', src: 'X', title: { en: 'Only English' }, link: 'https://x.test/d', pub: '2026-01-01T00:00:00.000Z', lang: 'fr' });
    expect(s.title).toBe('Only English');
  });
});
