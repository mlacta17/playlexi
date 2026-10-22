import { parseSpellingWord } from '../src';

describe('parseSpellingWord', () => {
  it('normalizes a valid fixture into letters', () => {
    expect(parseSpellingWord({ id: 'cat', prompt: ' cat ', answer: 'CAT' })).toEqual({
      ok: true,
      value: { id: 'cat', prompt: 'cat', letters: ['C', 'A', 'T'] },
    });
  });

  it.each([
    null,
    { id: 'Cat', prompt: 'cat', answer: 'CAT' },
    { id: 'cat', prompt: '', answer: 'CAT' },
    { id: 'cat', prompt: 'cat', answer: 'Cat' },
    { id: 'cat', prompt: 'cat', answer: 'CAT!' },
  ])('rejects invalid external data: %p', (fixture) => {
    expect(parseSpellingWord(fixture).ok).toBe(false);
  });
});
