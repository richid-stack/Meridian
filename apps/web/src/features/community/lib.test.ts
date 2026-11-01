import { describe, expect, it } from 'vitest';
import { parseTab, tabHref } from './lib';

describe('community tabs', () => {
  it('defaults to For you', () => {
    expect(parseTab(undefined)).toBe('for-you');
    expect(parseTab('nonsense')).toBe('for-you');
  });
  it('reads known tabs, first value wins', () => {
    expect(parseTab('groups')).toBe('groups');
    expect(parseTab(['following', 'groups'])).toBe('following');
  });
  it('builds links', () => {
    expect(tabHref('en', 'for-you')).toBe('/en/community');
    expect(tabHref('fr', 'groups')).toBe('/fr/community?tab=groups');
  });
});
