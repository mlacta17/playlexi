import { DeterministicFakeAudioCapture } from '../src';

describe('deterministic fake audio capture', () => {
  it('emits scripted buffers and requires one active capture', async () => {
    const buffer = {
      samples: new Int16Array([1, 2, 3]),
      sampleRate: 16_000,
      channels: 1,
      timestampSeconds: 0,
    } as const;
    const capture = new DeterministicFakeAudioCapture('granted', [buffer]);
    const received = [];

    await capture.start(
      { requestedSampleRate: 16_000, requestedChannels: 1, maximumDurationMilliseconds: 3_000 },
      (value) => received.push(value),
    );

    expect(received).toEqual([buffer]);
    await expect(
      capture.start(
        { requestedSampleRate: 16_000, requestedChannels: 1, maximumDurationMilliseconds: 3_000 },
        () => undefined,
      ),
    ).rejects.toThrow(/already active/i);
    await expect(capture.stop()).resolves.toEqual({ kind: 'completed' });
    await expect(capture.stop()).resolves.toMatchObject({ kind: 'failed' });
  });
});
