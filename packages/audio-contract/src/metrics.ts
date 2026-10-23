export interface PcmBuffer {
  readonly samples: Int16Array;
  readonly sampleRate: number;
  readonly channels: number;
  readonly timestampSeconds: number;
}

export interface CaptureHealthAccumulator {
  readonly sampleRate: number | null;
  readonly channels: number | null;
  readonly bufferCount: number;
  readonly frameCount: number;
  readonly sampleCount: number;
  readonly sumOfSquares: number;
  readonly peak: number;
  readonly clippedSampleCount: number;
  readonly maximumBufferGapSeconds: number;
  readonly expectedNextTimestampSeconds: number | null;
}

export interface CaptureHealthMetrics {
  readonly sampleRate: number;
  readonly channels: number;
  readonly bufferCount: number;
  readonly frameCount: number;
  readonly durationSeconds: number;
  readonly rms: number;
  readonly peak: number;
  readonly clippedSampleRatio: number;
  readonly maximumBufferGapSeconds: number;
}

const MAX_INT16_MAGNITUDE = 32_768;
const CLIPPED_SAMPLE_MAGNITUDE = 32_760;

export function createCaptureHealthAccumulator(): CaptureHealthAccumulator {
  return {
    sampleRate: null,
    channels: null,
    bufferCount: 0,
    frameCount: 0,
    sampleCount: 0,
    sumOfSquares: 0,
    peak: 0,
    clippedSampleCount: 0,
    maximumBufferGapSeconds: 0,
    expectedNextTimestampSeconds: null,
  };
}

export function reducePcmBuffer(
  state: CaptureHealthAccumulator,
  buffer: PcmBuffer,
): CaptureHealthAccumulator {
  assertValidBuffer(buffer);
  if (
    (state.sampleRate !== null && state.sampleRate !== buffer.sampleRate) ||
    (state.channels !== null && state.channels !== buffer.channels)
  ) {
    throw new Error('PCM format changed during one capture.');
  }

  let sumOfSquares = state.sumOfSquares;
  let peak = state.peak;
  let clippedSampleCount = state.clippedSampleCount;
  for (const sample of buffer.samples) {
    const magnitude = Math.abs(sample);
    const normalized = magnitude / MAX_INT16_MAGNITUDE;
    sumOfSquares += normalized * normalized;
    peak = Math.max(peak, normalized);
    if (magnitude >= CLIPPED_SAMPLE_MAGNITUDE) clippedSampleCount += 1;
  }

  const frameCount = buffer.samples.length / buffer.channels;
  const gap =
    state.expectedNextTimestampSeconds === null
      ? 0
      : Math.max(0, buffer.timestampSeconds - state.expectedNextTimestampSeconds);

  return {
    sampleRate: buffer.sampleRate,
    channels: buffer.channels,
    bufferCount: state.bufferCount + 1,
    frameCount: state.frameCount + frameCount,
    sampleCount: state.sampleCount + buffer.samples.length,
    sumOfSquares,
    peak,
    clippedSampleCount,
    maximumBufferGapSeconds: Math.max(state.maximumBufferGapSeconds, gap),
    expectedNextTimestampSeconds:
      buffer.timestampSeconds + frameCount / buffer.sampleRate,
  };
}

export function finalizeCaptureHealth(
  state: CaptureHealthAccumulator,
): CaptureHealthMetrics | null {
  if (
    state.sampleRate === null ||
    state.channels === null ||
    state.sampleCount === 0 ||
    state.frameCount === 0
  ) {
    return null;
  }
  return {
    sampleRate: state.sampleRate,
    channels: state.channels,
    bufferCount: state.bufferCount,
    frameCount: state.frameCount,
    durationSeconds: state.frameCount / state.sampleRate,
    rms: Math.sqrt(state.sumOfSquares / state.sampleCount),
    peak: state.peak,
    clippedSampleRatio: state.clippedSampleCount / state.sampleCount,
    maximumBufferGapSeconds: state.maximumBufferGapSeconds,
  };
}

function assertValidBuffer(buffer: PcmBuffer): void {
  if (!Number.isInteger(buffer.sampleRate) || buffer.sampleRate <= 0) {
    throw new Error('PCM sample rate must be a positive integer.');
  }
  if (!Number.isInteger(buffer.channels) || buffer.channels <= 0) {
    throw new Error('PCM channel count must be a positive integer.');
  }
  if (!Number.isFinite(buffer.timestampSeconds) || buffer.timestampSeconds < 0) {
    throw new Error('PCM timestamp must be a non-negative finite number.');
  }
  if (buffer.samples.length % buffer.channels !== 0) {
    throw new Error('PCM samples must contain complete interleaved frames.');
  }
}
