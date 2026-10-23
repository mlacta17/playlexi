import {
  createCaptureSession,
  transitionCaptureSession,
  type CaptureHealthMetrics,
} from '../src';

const metrics: CaptureHealthMetrics = {
  sampleRate: 16_000,
  channels: 1,
  bufferCount: 2,
  frameCount: 16_000,
  durationSeconds: 1,
  rms: 0.2,
  peak: 0.8,
  clippedSampleRatio: 0,
  maximumBufferGapSeconds: 0,
};

describe('capture session', () => {
  it('moves through permission, capture, stop, and completion explicitly', () => {
    let state = createCaptureSession();
    state = transitionCaptureSession(state, {
      type: 'PERMISSION_RESOLVED',
      permission: 'granted',
    });
    state = transitionCaptureSession(state, { type: 'START_REQUESTED' });
    state = transitionCaptureSession(state, { type: 'CAPTURE_STARTED' });
    state = transitionCaptureSession(state, { type: 'STOP_REQUESTED' });
    state = transitionCaptureSession(state, { type: 'CAPTURE_COMPLETED', metrics });

    expect(state.status).toBe('completed');
    expect(state.metrics).toEqual(metrics);
  });

  it('records a recoverable background cancellation', () => {
    let state = createCaptureSession();
    state = transitionCaptureSession(state, {
      type: 'PERMISSION_RESOLVED',
      permission: 'granted',
    });
    state = transitionCaptureSession(state, { type: 'START_REQUESTED' });
    state = transitionCaptureSession(state, { type: 'CAPTURE_STARTED' });
    state = transitionCaptureSession(state, {
      type: 'CAPTURE_CANCELLED',
      reason: 'backgrounded',
    });

    expect(state.status).toBe('cancelled');
    expect(state.cancellationReason).toBe('backgrounded');
    expect(transitionCaptureSession(state, { type: 'RESET' }).status).toBe('ready');
  });

  it('rejects invalid transitions visibly', () => {
    const state = transitionCaptureSession(createCaptureSession(), {
      type: 'START_REQUESTED',
    });

    expect(state.status).toBe('checkingPermission');
    expect(state.lastError).toMatch(/permission is granted/i);
  });
});
