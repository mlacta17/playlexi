import { DeterministicFakeLetterRecognizer } from '../src';

describe('DeterministicFakeLetterRecognizer', () => {
  it('returns its script in order and never needs the expected answer', async () => {
    const recognizer = new DeterministicFakeLetterRecognizer([
      { kind: 'recognized', candidates: [{ letter: 'C' }] },
      { kind: 'ambiguous' },
    ]);

    await expect(recognizer.recognize({ attemptNumber: 1 })).resolves.toEqual({
      kind: 'recognized',
      candidates: [{ letter: 'C' }],
    });
    await expect(recognizer.recognize({ attemptNumber: 2 })).resolves.toEqual({
      kind: 'ambiguous',
    });
    await expect(recognizer.recognize({ attemptNumber: 3 })).resolves.toEqual({
      kind: 'unavailable',
    });
  });

  it('can reset a repeatable practice run', async () => {
    const recognizer = new DeterministicFakeLetterRecognizer([
      { kind: 'recognized', candidates: [{ letter: 'A' }] },
    ]);
    await recognizer.recognize({ attemptNumber: 1 });
    recognizer.reset();

    await expect(recognizer.recognize({ attemptNumber: 1 })).resolves.toMatchObject({
      kind: 'recognized',
    });
  });
});
