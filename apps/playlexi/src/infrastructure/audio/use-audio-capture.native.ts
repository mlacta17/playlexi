import type {
  AudioCapture,
  AudioCaptureOptions,
  AudioCaptureResult,
  PcmBuffer,
} from '@playlexi/audio-contract';
import {
  getRecordingPermissionsAsync,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioStream,
} from 'expo-audio';
import { useMemo, useRef } from 'react';

import { mapExpoPermission } from './permission';

const CAPTURE_AUDIO_MODE = {
  allowsRecording: true,
  allowsBackgroundRecording: false,
  interruptionMode: 'doNotMix',
  playsInSilentMode: true,
  shouldPlayInBackground: false,
  shouldRouteThroughEarpiece: false,
} as const;

const IDLE_AUDIO_MODE = {
  ...CAPTURE_AUDIO_MODE,
  allowsRecording: false,
  interruptionMode: 'mixWithOthers',
} as const;

export function useAudioCapture(): AudioCapture {
  const onBufferRef = useRef<((buffer: PcmBuffer) => void) | null>(null);
  const activeRef = useRef(false);
  const generationRef = useRef(0);
  const { stream } = useAudioStream({
    sampleRate: 16_000,
    channels: 1,
    encoding: 'int16',
    onBuffer: (buffer) => {
      onBufferRef.current?.({
        samples: new Int16Array(buffer.data),
        sampleRate: buffer.sampleRate,
        channels: buffer.channels,
        timestampSeconds: buffer.timestamp,
      });
    },
  });

  return useMemo(
    () => ({
      async getPermission() {
        return mapExpoPermission(await getRecordingPermissionsAsync());
      },
      async requestPermission() {
        return mapExpoPermission(await requestRecordingPermissionsAsync());
      },
      async start(
        _options: AudioCaptureOptions,
        onBuffer: (buffer: PcmBuffer) => void,
      ) {
        if (activeRef.current) throw new Error('Audio capture is already active.');
        const generation = generationRef.current + 1;
        generationRef.current = generation;
        onBufferRef.current = onBuffer;
        await setAudioModeAsync(CAPTURE_AUDIO_MODE);
        try {
          await stream.start();
          if (generation !== generationRef.current) {
            stream.stop();
            throw new Error('Audio capture start was cancelled.');
          }
          activeRef.current = true;
        } catch (error) {
          onBufferRef.current = null;
          await setAudioModeAsync(IDLE_AUDIO_MODE);
          throw error;
        }
      },
      async stop(): Promise<AudioCaptureResult> {
        if (!activeRef.current) {
          return { kind: 'failed', message: 'Audio capture is not active.' };
        }
        stream.stop();
        activeRef.current = false;
        onBufferRef.current = null;
        await setAudioModeAsync(IDLE_AUDIO_MODE);
        return { kind: 'completed' };
      },
      async cancel() {
        generationRef.current += 1;
        if (activeRef.current) stream.stop();
        activeRef.current = false;
        onBufferRef.current = null;
        await setAudioModeAsync(IDLE_AUDIO_MODE);
      },
    }),
    [stream],
  );
}
