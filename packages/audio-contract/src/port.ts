import type { PcmBuffer } from './metrics';
import type { CapturePermission } from './session';

export interface AudioCaptureOptions {
  readonly requestedSampleRate: number;
  readonly requestedChannels: number;
  readonly maximumDurationMilliseconds: number;
}

export type AudioCaptureResult =
  | { readonly kind: 'completed' }
  | { readonly kind: 'cancelled' }
  | { readonly kind: 'failed'; readonly message: string };

export interface AudioCapture {
  getPermission(): Promise<CapturePermission>;
  requestPermission(): Promise<CapturePermission>;
  start(options: AudioCaptureOptions, onBuffer: (buffer: PcmBuffer) => void): Promise<void>;
  stop(): Promise<AudioCaptureResult>;
  cancel(): Promise<void>;
}

export class DeterministicFakeAudioCapture implements AudioCapture {
  private active = false;

  public constructor(
    private permission: CapturePermission,
    private readonly buffers: readonly PcmBuffer[],
    private readonly stopResult: AudioCaptureResult = { kind: 'completed' },
  ) {}

  public async getPermission(): Promise<CapturePermission> {
    return this.permission;
  }

  public async requestPermission(): Promise<CapturePermission> {
    return this.permission;
  }

  public setPermission(permission: CapturePermission): void {
    this.permission = permission;
  }

  public async start(
    _options: AudioCaptureOptions,
    onBuffer: (buffer: PcmBuffer) => void,
  ): Promise<void> {
    if (this.active) throw new Error('Fake capture is already active.');
    if (this.permission !== 'granted') throw new Error('Microphone permission is not granted.');
    this.active = true;
    for (const buffer of this.buffers) onBuffer(buffer);
  }

  public async stop(): Promise<AudioCaptureResult> {
    if (!this.active) return { kind: 'failed', message: 'Fake capture is not active.' };
    this.active = false;
    return this.stopResult;
  }

  public async cancel(): Promise<void> {
    this.active = false;
  }
}
