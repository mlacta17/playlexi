import {
  createSpellingSession,
  parseSpellingWord,
  transitionSpellingSession,
  type SpellingSession,
  type SpellingSessionEvent,
} from '../src';

const parsedWord = parseSpellingWord({ id: 'cat', prompt: 'cat', answer: 'CAT' });
if (!parsedWord.ok) {
  throw new Error(parsedWord.message);
}

function apply(state: SpellingSession, event: SpellingSessionEvent) {
  return transitionSpellingSession(state, event);
}

describe('spelling session', () => {
  it('accepts, corrects, deletes, and submits deterministically', () => {
    let state = createSpellingSession(parsedWord.value);
    state = apply(state, { type: 'BEGIN_RECOGNITION' });
    state = apply(state, {
      type: 'RECEIVE_CANDIDATES',
      attemptNumber: 1,
      candidates: ['C', 'K'],
    });
    state = apply(state, { type: 'ACCEPT_CANDIDATE', letter: 'C' });
    state = apply(state, { type: 'START_MANUAL_ENTRY' });
    state = apply(state, { type: 'CHOOSE_MANUAL_LETTER', letter: 'B' });
    state = apply(state, { type: 'START_CORRECTION', index: 1 });
    state = apply(state, { type: 'CHOOSE_MANUAL_LETTER', letter: 'A' });
    state = apply(state, { type: 'START_MANUAL_ENTRY' });
    state = apply(state, { type: 'CHOOSE_MANUAL_LETTER', letter: 'T' });
    state = apply(state, { type: 'DELETE_LETTER', index: 2 });
    state = apply(state, { type: 'START_MANUAL_ENTRY' });
    state = apply(state, { type: 'CHOOSE_MANUAL_LETTER', letter: 'T' });
    state = apply(state, { type: 'SUBMIT' });

    expect(state.status).toBe('completed');
    expect(state.result).toBe('correct');
    expect(state.acceptedLetters).toEqual(['C', 'A', 'T']);
  });

  it('rejects stale recognition results without changing accepted letters', () => {
    let state = createSpellingSession(parsedWord.value);
    state = apply(state, { type: 'BEGIN_RECOGNITION' });
    state = apply(state, {
      type: 'RECEIVE_CANDIDATES',
      attemptNumber: 99,
      candidates: ['C'],
    });

    expect(state.status).toBe('recognizing');
    expect(state.acceptedLetters).toEqual([]);
    expect(state.lastError).toMatch(/inactive attempt/i);
  });

  it('does not submit an incomplete spelling', () => {
    const state = apply(createSpellingSession(parsedWord.value), { type: 'SUBMIT' });

    expect(state.status).toBe('ready');
    expect(state.lastError).toMatch(/every letter/i);
  });
});
