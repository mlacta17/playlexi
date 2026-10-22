import { BUNDLED_WORDS } from '../src';

describe('bundled words', () => {
  it('loads only validated, uniquely identified words', () => {
    expect(BUNDLED_WORDS.length).toBeGreaterThan(0);
    expect(new Set(BUNDLED_WORDS.map((word) => word.id)).size).toBe(BUNDLED_WORDS.length);
    expect(BUNDLED_WORDS.every((word) => word.letters.length > 0)).toBe(true);
  });
});
