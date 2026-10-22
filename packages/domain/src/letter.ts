export const LETTERS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
] as const;

export type Letter = (typeof LETTERS)[number];

export function isLetter(value: unknown): value is Letter {
  return typeof value === 'string' && LETTERS.includes(value as Letter);
}
