import { describe, expect, it } from 'vitest';
import { currentTab } from './AppShell';

describe('currentTab', () => {
  it('maps home', () => expect(currentTab('/en', 'en')).toBe('home'));
  it('maps news to home', () => expect(currentTab('/en/news/abc', 'en')).toBe('home'));
  it('maps people to explore', () => expect(currentTab('/fr/people/ama', 'fr')).toBe('explore'));
  it('maps deals to capital', () => expect(currentTab('/en/capital/deals/1', 'en')).toBe('capital'));
  it('maps messages to community', () => expect(currentTab('/en/messages', 'en')).toBe('community'));
});
