import { isLetter, type Letter } from './letter';

export interface SpellingWord {
  readonly id: string;
  readonly prompt: string;
  readonly letters: readonly Letter[];
}

export type WordValidationResult =
  | { readonly ok: true; readonly value: SpellingWord }
  | { readonly ok: false; readonly message: string };

export function parseSpellingWord(value: unknown): WordValidationResult {
  if (!isRecord(value)) {
    return invalid('Word fixture must be an object.');
  }
  if (typeof value.id !== 'string' || !/^[a-z0-9-]+$/.test(value.id)) {
    return invalid('Word fixture id must use lowercase letters, numbers, or hyphens.');
  }
  if (typeof value.prompt !== 'string' || value.prompt.trim().length === 0) {
    return invalid('Word fixture prompt must be a non-empty string.');
  }
  if (typeof value.answer !== 'string' || !/^[A-Z]+$/.test(value.answer)) {
    return invalid('Word fixture answer must contain uppercase A-Z letters only.');
  }

  const letters = [...value.answer];
  if (!letters.every(isLetter)) {
    return invalid('Word fixture answer contains an unsupported letter.');
  }

  return {
    ok: true,
    value: { id: value.id, prompt: value.prompt.trim(), letters },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function invalid(message: string): WordValidationResult {
  return { ok: false, message };
}
