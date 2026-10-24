import { describe, expect, it } from 'vitest';
import { initials } from './Avatar';

describe('initials', () => {
  it('uses first and last name', () => expect(initials('Ama Boateng')).toBe('AB'));
  it('handles one word', () => expect(initials('Kora')).toBe('K'));
  it('handles empty', () => expect(initials('  ')).toBe(''));
});
