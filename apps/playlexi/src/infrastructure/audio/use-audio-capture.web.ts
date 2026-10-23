import type {
  AudioCapture,
  AudioCaptureOptions,
  AudioCaptureResult,
  CapturePermission,
  PcmBuffer,
} from '@playlexi/audio-contract';
import { useMemo, useRef } from 'react';

interface WebCaptureResources {
  readonly context: AudioContext;
  readonly source: MediaStreamAudioSourceNode;
  readonly worklet: AudioWorkletNode;
  readonly mute: GainNode;
  readonly mediaStream: MediaStream;
}

interface WorkletMessage {
  readonly data: ArrayBuffer;
  readonly channels: number;
  readonly timestamp: number;
}

export function useAudioCapture(): AudioCapture {
  const resourcesRef = useRef<WebCaptureResources | null>(null);
  const generationRef = useRef(0);

  return useMemo(
    () => ({
      async getPermission() {
        if (!hasBrowserCapture()) return 'unavailable';
        if (!navigator.permissions?.query) return 'undetermined';
        try {
          const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          return mapBrowserPermission(result.state);
        } catch {
          return 'undetermined';
        }
      },
      async requestPermission() {
        if (!hasBrowserCapture()) return 'unavailable';
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stopTracks(mediaStream);
          return 'granted';
        } catch (error) {
          return mapBrowserError(error);
        }
      },
      async start(
        options: AudioCaptureOptions,
        onBuffer: (buffer: PcmBuffer) => void,
      ) {
        if (!hasBrowserCapture()) throw new Error('Browser microphone capture is unavailable.');
        if (resourcesRef.current !== null) throw new Error('Audio capture is already active.');
        const generation = generationRef.current + 1;
        generationRef.current = generation;

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            autoGainControl: false,
            channelCount: { ideal: options.requestedChannels },
            echoCancellation: false,
            noiseSuppression: false,
            sampleRate: { ideal: options.requestedSampleRate },
          },
        });
        const context = new AudioContext();
        try {
          await context.audioWorklet.addModule('/audio-capture-processor.js');
          await context.resume();
          const source = context.createMediaStreamSource(mediaStream);
          const worklet = new AudioWorkletNode(context, 'playlexi-capture-processor');
          const mute = context.createGain();
          mute.gain.value = 0;
          worklet.port.onmessage = (event: MessageEvent<unknown>) => {
            const message = parseWorkletMessage(event.data);
            if (message === null) return;
            onBuffer({
              samples: float32ToInt16(new Float32Array(message.data)),
              sampleRate: context.sampleRate,
              channels: message.channels,
              timestampSeconds: message.timestamp,
            });
          };
          source.connect(worklet);
          worklet.connect(mute);
          mute.connect(context.destination);
          const resources = { context, source, worklet, mute, mediaStream };
          if (generation !== generationRef.current) {
            await release(resources);
            throw new Error('Audio capture start was cancelled.');
          }
          resourcesRef.current = resources;
        } catch (error) {
          stopTracks(mediaStream);
          if (context.state !== 'closed') await context.close();
          throw error;
        }
      },
      async stop(): Promise<AudioCaptureResult> {
        if (resourcesRef.current === null) {
          return { kind: 'failed', message: 'Audio capture is not active.' };
        }
        await release(resourcesRef.current);
        resourcesRef.current = null;
        return { kind: 'completed' };
      },
      async cancel() {
        generationRef.current += 1;
        if (resourcesRef.current === null) return;
        await release(resourcesRef.current);
        resourcesRef.current = null;
      },
    }),
    [],
  );
}

function hasBrowserCapture(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.isSecureContext &&
    navigator.mediaDevices?.getUserMedia !== undefined &&
    typeof AudioContext !== 'undefined' &&
    typeof AudioWorkletNode !== 'undefined'
  );
}

function mapBrowserPermission(state: PermissionState): CapturePermission {
  switch (state) {
    case 'granted':
      return 'granted';
    case 'denied':
      return 'blocked';
    case 'prompt':
      return 'undetermined';
  }
}

function mapBrowserError(error: unknown): CapturePermission {
  if (error instanceof DOMException && error.name === 'NotAllowedError') return 'denied';
  return 'unavailable';
}

function parseWorkletMessage(value: unknown): WorkletMessage | null {
  if (typeof value !== 'object' || value === null) return null;
  const candidate = value as Partial<WorkletMessage>;
  if (
    !(candidate.data instanceof ArrayBuffer) ||
    !Number.isInteger(candidate.channels) ||
    (candidate.channels ?? 0) <= 0 ||
    !Number.isFinite(candidate.timestamp) ||
    (candidate.timestamp ?? -1) < 0
  ) {
    return null;
  }
  return candidate as WorkletMessage;
}

function float32ToInt16(input: Float32Array): Int16Array {
  const output = new Int16Array(input.length);
  for (let index = 0; index < input.length; index += 1) {
    const sample = Math.max(-1, Math.min(1, input[index] ?? 0));
    output[index] = sample < 0 ? Math.round(sample * 32_768) : Math.round(sample * 32_767);
  }
  return output;
}

async function release(resources: WebCaptureResources): Promise<void> {
  resources.worklet.port.onmessage = null;
  resources.source.disconnect();
  resources.worklet.disconnect();
  resources.mute.disconnect();
  stopTracks(resources.mediaStream);
  await resources.context.close();
}

function stopTracks(stream: MediaStream): void {
  for (const track of stream.getTracks()) track.stop();
}
