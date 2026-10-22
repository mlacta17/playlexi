import type { Letter } from '@playlexi/domain';

export interface LetterCandidate {
  readonly letter: Letter;
  readonly confidence?: number;
}

export type LetterRecognitionResult =
  | { readonly kind: 'recognized'; readonly candidates: readonly LetterCandidate[] }
  | { readonly kind: 'ambiguous' }
  | { readonly kind: 'nonLetterSpeech' }
  | { readonly kind: 'noSpeech' }
  | { readonly kind: 'poorAudioQuality' }
  | { readonly kind: 'unavailable' };

export interface LetterRecognitionRequest {
  readonly attemptNumber: number;
}

export interface LetterRecognizer<Input = LetterRecognitionRequest> {
  recognize(input: Input): Promise<LetterRecognitionResult>;
}

export class DeterministicFakeLetterRecognizer
  implements LetterRecognizer<LetterRecognitionRequest>
{
  private cursor = 0;

  public constructor(private readonly script: readonly LetterRecognitionResult[]) {}

  public async recognize(
    _input: LetterRecognitionRequest,
  ): Promise<LetterRecognitionResult> {
    const result = this.script[this.cursor];
    this.cursor += 1;
    return result ?? { kind: 'unavailable' };
  }

  public reset(): void {
    this.cursor = 0;
  }
}
