import { describe, expect, it } from 'vitest';
import { normalize, osa, search, type Searchable } from './search';

const item = (kind: string, id: string, title: string, subtitle: string, text = '', boost = 1): Searchable => ({ kind, id, title, subtitle, text, boost });
const catalogue = [
  item('person', 'ama', 'Ama Boateng', 'Founder and CEO, Kora Freight', 'logistics ghana', 1.2),
  item('company', 'kora', 'Kora Freight', 'Digital freight network, Accra', 'logistics', 1.2),
  item('company', 'nakala', 'Nakala', 'Freight marketplace, Lagos', 'logistics', 1.2),
  item('person', 'mateo', 'Mateo Alvarez', 'CEO, Lumen Grid', 'Valparaíso chile', 1.2),
  item('book', 'goal', 'The Goal', 'Eliyahu Goldratt', 'book', 1),
];

describe('normalize', () => {
  it('lowercases and strips accents', () => expect(normalize('Valparaíso, Chile!')).toEqual(['valparaiso', 'chile']));
  it('returns nothing for blanks', () => expect(normalize('  ')).toEqual([]));
});

describe('osa', () => {
  it('counts an adjacent swap as one edit', () => expect(osa('frieght', 'freight')).toBe(1));
  it('is zero for equal strings', () => expect(osa('kora', 'kora')).toBe(0));
  it('counts substitutions', () => expect(osa('cat', 'cut')).toBe(1));
});

describe('search', () => {
  it('returns nothing for an empty query', () => expect(search(catalogue, '')).toEqual([]));
  it('ranks the company above the person for its own name', () => {
    const r = search(catalogue, 'kora');
    expect(r[0]?.id).toBe('kora');
    expect(r.map((x) => x.id)).toContain('ama');
  });
  it('tolerates a typo', () => expect(search(catalogue, 'kora frieght')[0]?.id).toBe('kora'));
  it('matches prefixes', () => expect(search(catalogue, 'mat')[0]?.id).toBe('mateo'));
  it('ignores accents', () => expect(search(catalogue, 'valparaiso')[0]?.id).toBe('mateo'));
  it('requires every word to match', () => expect(search(catalogue, 'kora zzzzzz')).toEqual([]));
  it('respects the limit', () => expect(search(catalogue, 'freight', 1)).toHaveLength(1));
});
