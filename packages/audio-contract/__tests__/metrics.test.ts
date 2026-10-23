import {
  createCaptureHealthAccumulator,
  finalizeCaptureHealth,
  reducePcmBuffer,
} from '../src';

describe('capture health metrics', () => {
  it('reduces PCM without retaining raw samples', () => {
    let state = createCaptureHealthAccumulator();
    state = reducePcmBuffer(state, {
      samples: new Int16Array([0, 16_384, -16_384, 32_767]),
      sampleRate: 4,
      channels: 1,
      timestampSeconds: 0,
    });
    const metrics = finalizeCaptureHealth(state);

    expect(metrics).not.toBeNull();
    expect(metrics).toMatchObject({
      sampleRate: 4,
      channels: 1,
      bufferCount: 1,
      frameCount: 4,
      durationSeconds: 1,
    });
    expect(metrics?.peak).toBeCloseTo(32_767 / 32_768);
    expect(metrics?.rms).toBeCloseTo(Math.sqrt((0 + 0.25 + 0.25 + (32_767 / 32_768) ** 2) / 4));
  });

  it('records positive gaps between buffers', () => {
    let state = createCaptureHealthAccumulator();
    state = reducePcmBuffer(state, {
      samples: new Int16Array(100),
      sampleRate: 100,
      channels: 1,
      timestampSeconds: 0,
    });
    state = reducePcmBuffer(state, {
      samples: new Int16Array(100),
      sampleRate: 100,
      channels: 1,
      timestampSeconds: 1.25,
    });

    expect(finalizeCaptureHealth(state)?.maximumBufferGapSeconds).toBeCloseTo(0.25);
  });

  it('rejects incomplete frames and mid-capture format changes', () => {
    expect(() =>
      reducePcmBuffer(createCaptureHealthAccumulator(), {
        samples: new Int16Array(3),
        sampleRate: 16_000,
        channels: 2,
        timestampSeconds: 0,
      }),
    ).toThrow(/complete interleaved frames/i);

    const state = reducePcmBuffer(createCaptureHealthAccumulator(), {
      samples: new Int16Array(4),
      sampleRate: 16_000,
      channels: 1,
      timestampSeconds: 0,
    });
    expect(() =>
      reducePcmBuffer(state, {
        samples: new Int16Array(4),
        sampleRate: 48_000,
        channels: 1,
        timestampSeconds: 0.001,
      }),
    ).toThrow(/format changed/i);
  });
});
