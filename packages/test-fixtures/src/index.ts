import { parseSpellingWord, type SpellingWord } from '@playlexi/domain';

const rawWordFixtures: readonly unknown[] = [
  { id: 'cat', prompt: 'cat', answer: 'CAT' },
  { id: 'map', prompt: 'map', answer: 'MAP' },
  { id: 'sun', prompt: 'sun', answer: 'SUN' },
];

export const BUNDLED_WORDS: readonly SpellingWord[] = rawWordFixtures.map(
  (fixture, index) => {
    const result = parseSpellingWord(fixture);
    if (!result.ok) {
      throw new Error(`Invalid bundled word at index ${index}: ${result.message}`);
    }
    return result.value;
  },
);
