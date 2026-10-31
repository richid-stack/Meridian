import { describe, expect, it } from 'vitest';
import { relativeAgo } from './time';

const NOW = 1_800_000_000_000;
const min = 60_000;

describe('relativeAgo', () => {
  it('uses minutes under an hour', () => expect(relativeAgo(NOW - 35 * min, NOW, 'en')).toMatch(/^35 min/));
  it('uses hours under a day', () => expect(relativeAgo(NOW - 180 * min, NOW, 'en')).toMatch(/^3 hr/));
  it('uses days after that', () => expect(relativeAgo(NOW - 2 * 1440 * min, NOW, 'en')).toMatch(/^2 days/));
  it('never says zero minutes', () => expect(relativeAgo(NOW, NOW, 'en')).toMatch(/^1 min/));
  it('speaks French', () => expect(relativeAgo(NOW - 3 * 1440 * min, NOW, 'fr')).toMatch(/^il y a 3 j/));
});
