import type { Letter } from './letter';
import type { SpellingWord } from './word';

export type RecognitionRejection =
  | 'ambiguous'
  | 'nonLetterSpeech'
  | 'noSpeech'
  | 'poorAudioQuality'
  | 'unavailable';

export type SessionStatus =
  | 'ready'
  | 'recognizing'
  | 'reviewing'
  | 'manualEntry'
  | 'completed';

export interface SpellingSession {
  readonly word: SpellingWord;
  readonly acceptedLetters: readonly Letter[];
  readonly status: SessionStatus;
  readonly attemptNumber: number;
  readonly candidates: readonly Letter[];
  readonly correctionIndex: number | null;
  readonly result: 'correct' | 'incorrect' | null;
  readonly notice: string | null;
  readonly lastError: string | null;
}

export type SpellingSessionEvent =
  | { readonly type: 'BEGIN_RECOGNITION' }
  | {
      readonly type: 'RECEIVE_CANDIDATES';
      readonly attemptNumber: number;
      readonly candidates: readonly Letter[];
    }
  | {
      readonly type: 'RECEIVE_REJECTION';
      readonly attemptNumber: number;
      readonly reason: RecognitionRejection;
    }
  | { readonly type: 'ACCEPT_CANDIDATE'; readonly letter: Letter }
  | { readonly type: 'RETRY' }
  | { readonly type: 'START_MANUAL_ENTRY' }
  | { readonly type: 'START_CORRECTION'; readonly index: number }
  | { readonly type: 'CHOOSE_MANUAL_LETTER'; readonly letter: Letter }
  | { readonly type: 'CANCEL_MANUAL_ENTRY' }
  | { readonly type: 'DELETE_LETTER'; readonly index: number }
  | { readonly type: 'SUBMIT' }
  | { readonly type: 'RESET' };

export function createSpellingSession(word: SpellingWord): SpellingSession {
  return {
    word,
    acceptedLetters: [],
    status: 'ready',
    attemptNumber: 0,
    candidates: [],
    correctionIndex: null,
    result: null,
    notice: null,
    lastError: null,
  };
}

export function transitionSpellingSession(
  state: SpellingSession,
  event: SpellingSessionEvent,
): SpellingSession {
  switch (event.type) {
    case 'BEGIN_RECOGNITION':
      if (state.status !== 'ready' || isWordFull(state)) {
        return reject(state, 'Recognition can start only when another letter is needed.');
      }
      return {
        ...state,
        status: 'recognizing',
        attemptNumber: state.attemptNumber + 1,
        candidates: [],
        notice: null,
        lastError: null,
      };
    case 'RECEIVE_CANDIDATES':
      if (!isCurrentAttempt(state, event.attemptNumber)) {
        return reject(state, 'Ignored a recognition result from an inactive attempt.');
      }
      if (event.candidates.length === 0) {
        return reject(state, 'Recognition must provide at least one candidate.');
      }
      return {
        ...state,
        status: 'reviewing',
        candidates: uniqueLetters(event.candidates),
        notice: 'Choose the letter you said.',
        lastError: null,
      };
    case 'RECEIVE_REJECTION':
      if (!isCurrentAttempt(state, event.attemptNumber)) {
        return reject(state, 'Ignored a recognition result from an inactive attempt.');
      }
      return {
        ...state,
        status: 'ready',
        candidates: [],
        notice: rejectionMessage(event.reason),
        lastError: null,
      };
    case 'ACCEPT_CANDIDATE':
      if (state.status !== 'reviewing' || !state.candidates.includes(event.letter)) {
        return reject(state, 'Only a displayed candidate can be accepted.');
      }
      return appendLetter(state, event.letter);
    case 'RETRY':
      if (state.status !== 'reviewing') {
        return reject(state, 'Retry is available while reviewing candidates.');
      }
      return ready(state, 'Try the letter again when you are ready.');
    case 'START_MANUAL_ENTRY':
      if ((state.status !== 'ready' && state.status !== 'reviewing') || isWordFull(state)) {
        return reject(state, 'Manual entry is available only when another letter is needed.');
      }
      return {
        ...state,
        status: 'manualEntry',
        correctionIndex: null,
        candidates: [],
        notice: 'Choose one letter.',
        lastError: null,
      };
    case 'START_CORRECTION':
      if (state.status !== 'ready' || state.acceptedLetters[event.index] === undefined) {
        return reject(state, 'Choose an accepted letter to correct.');
      }
      return {
        ...state,
        status: 'manualEntry',
        correctionIndex: event.index,
        notice: `Replace letter ${event.index + 1}.`,
        lastError: null,
      };
    case 'CHOOSE_MANUAL_LETTER':
      if (state.status !== 'manualEntry') {
        return reject(state, 'Open manual entry before choosing a letter.');
      }
      return state.correctionIndex === null
        ? appendLetter(state, event.letter)
        : replaceLetter(state, state.correctionIndex, event.letter);
    case 'CANCEL_MANUAL_ENTRY':
      if (state.status !== 'manualEntry') {
        return reject(state, 'There is no manual entry to cancel.');
      }
      return ready(state, null);
    case 'DELETE_LETTER':
      if (state.status !== 'ready' || state.acceptedLetters[event.index] === undefined) {
        return reject(state, 'Choose an accepted letter to delete.');
      }
      return {
        ...state,
        acceptedLetters: state.acceptedLetters.filter((_, index) => index !== event.index),
        notice: `Deleted letter ${event.index + 1}.`,
        lastError: null,
      };
    case 'SUBMIT':
      if (state.status !== 'ready' || !isWordFull(state)) {
        return reject(state, 'Enter every letter before submitting.');
      }
      return {
        ...state,
        status: 'completed',
        result: arraysMatch(state.acceptedLetters, state.word.letters) ? 'correct' : 'incorrect',
        notice: null,
        lastError: null,
      };
    case 'RESET':
      return createSpellingSession(state.word);
  }
}

function appendLetter(state: SpellingSession, letter: Letter): SpellingSession {
  if (isWordFull(state)) {
    return reject(state, 'The spelling already has the expected number of letters.');
  }
  return {
    ...state,
    acceptedLetters: [...state.acceptedLetters, letter],
    status: 'ready',
    candidates: [],
    correctionIndex: null,
    notice: `Added ${letter}.`,
    lastError: null,
  };
}

function replaceLetter(state: SpellingSession, index: number, letter: Letter): SpellingSession {
  return {
    ...state,
    acceptedLetters: state.acceptedLetters.map((current, currentIndex) =>
      currentIndex === index ? letter : current,
    ),
    status: 'ready',
    correctionIndex: null,
    notice: `Changed letter ${index + 1} to ${letter}.`,
    lastError: null,
  };
}

function ready(state: SpellingSession, notice: string | null): SpellingSession {
  return {
    ...state,
    status: 'ready',
    candidates: [],
    correctionIndex: null,
    notice,
    lastError: null,
  };
}

function reject(state: SpellingSession, lastError: string): SpellingSession {
  return { ...state, lastError };
}

function isWordFull(state: SpellingSession): boolean {
  return state.acceptedLetters.length >= state.word.letters.length;
}

function isCurrentAttempt(state: SpellingSession, attemptNumber: number): boolean {
  return state.status === 'recognizing' && state.attemptNumber === attemptNumber;
}

function uniqueLetters(letters: readonly Letter[]): readonly Letter[] {
  return [...new Set(letters)];
}

function arraysMatch(left: readonly Letter[], right: readonly Letter[]): boolean {
  return left.length === right.length && left.every((letter, index) => letter === right[index]);
}

function rejectionMessage(reason: RecognitionRejection): string {
  switch (reason) {
    case 'ambiguous':
      return "I couldn't hear one clear letter. Try again or enter it manually.";
    case 'nonLetterSpeech':
      return 'Please say one letter at a time.';
    case 'noSpeech':
      return "I didn't hear a letter. Try again or enter it manually.";
    case 'poorAudioQuality':
      return 'The sound was unclear. Try again somewhere quieter or enter the letter manually.';
    case 'unavailable':
      return 'Letter recognition is unavailable. Enter the letter manually.';
  }
}
