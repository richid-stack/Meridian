import { describe, expect, it } from 'vitest';
import { newsHref, parseNewsQuery } from './lib';

describe('parseNewsQuery', () => {
  it('uses defaults', () => expect(parseNewsQuery({})).toEqual({ region: 'africa', topic: 'all', page: 1 }));
  it('reads valid values', () => expect(parseNewsQuery({ region: 'west', topic: 'fintech', page: '2' })).toEqual({ region: 'west', topic: 'fintech', page: 2 }));
  it('takes the first of repeated values', () => expect(parseNewsQuery({ region: ['east', 'west'] }).region).toBe('east'));
  it('ignores a bad value and keeps the good ones', () => {
    expect(parseNewsQuery({ region: 'mars', topic: 'tech', page: '-3' })).toEqual({ region: 'africa', topic: 'tech', page: 1 });
  });
});

describe('newsHref', () => {
  it('omits defaults', () => expect(newsHref('en', { region: 'africa', topic: 'all', page: 1 })).toBe('/en/news'));
  it('includes filters', () => expect(newsHref('fr', { region: 'west', topic: 'tech', page: 2 })).toBe('/fr/news?region=west&topic=tech&page=2'));
});
