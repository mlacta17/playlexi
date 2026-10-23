import type { CaptureHealthMetrics } from './metrics';

export type CapturePermission =
  | 'undetermined'
  | 'granted'
  | 'denied'
  | 'blocked'
  | 'unavailable';

export type CaptureStatus =
  | 'checkingPermission'
  | 'permissionRequired'
  | 'ready'
  | 'starting'
  | 'capturing'
  | 'stopping'
  | 'completed'
  | 'cancelled'
  | 'failed';

export type CaptureCancellationReason =
  | 'backgrounded'
  | 'interrupted'
  | 'navigatedAway'
  | 'userCancelled';

export type CaptureFailure =
  | 'permissionDenied'
  | 'permissionBlocked'
  | 'captureUnavailable'
  | 'startFailed'
  | 'stopFailed'
  | 'invalidAudio';

export interface CaptureSession {
  readonly status: CaptureStatus;
  readonly permission: CapturePermission;
  readonly metrics: CaptureHealthMetrics | null;
  readonly cancellationReason: CaptureCancellationReason | null;
  readonly failure: CaptureFailure | null;
  readonly lastError: string | null;
}

export type CaptureSessionEvent =
  | { readonly type: 'PERMISSION_RESOLVED'; readonly permission: CapturePermission }
  | { readonly type: 'PERMISSION_REQUESTED' }
  | { readonly type: 'START_REQUESTED' }
  | { readonly type: 'CAPTURE_STARTED' }
  | { readonly type: 'STOP_REQUESTED' }
  | { readonly type: 'CAPTURE_COMPLETED'; readonly metrics: CaptureHealthMetrics }
  | { readonly type: 'CAPTURE_CANCELLED'; readonly reason: CaptureCancellationReason }
  | { readonly type: 'CAPTURE_FAILED'; readonly failure: CaptureFailure }
  | { readonly type: 'RESET' };

export function createCaptureSession(): CaptureSession {
  return {
    status: 'checkingPermission',
    permission: 'undetermined',
    metrics: null,
    cancellationReason: null,
    failure: null,
    lastError: null,
  };
}

export function transitionCaptureSession(
  state: CaptureSession,
  event: CaptureSessionEvent,
): CaptureSession {
  switch (event.type) {
    case 'PERMISSION_RESOLVED':
      if (state.status !== 'checkingPermission' && state.status !== 'permissionRequired') {
        return reject(state, 'Permission can be resolved only while checking or requesting it.');
      }
      return permissionState(event.permission);
    case 'PERMISSION_REQUESTED':
      if (state.status !== 'permissionRequired') {
        return reject(state, 'Permission can be requested only when it is required.');
      }
      return { ...state, status: 'checkingPermission', lastError: null };
    case 'START_REQUESTED':
      if (state.status !== 'ready' || state.permission !== 'granted') {
        return reject(state, 'Capture can start only after microphone permission is granted.');
      }
      return clearOutcome({ ...state, status: 'starting' });
    case 'CAPTURE_STARTED':
      if (state.status !== 'starting') {
        return reject(state, 'Capture must be starting before it can become active.');
      }
      return { ...state, status: 'capturing', lastError: null };
    case 'STOP_REQUESTED':
      if (state.status !== 'capturing') {
        return reject(state, 'Only an active capture can be stopped.');
      }
      return { ...state, status: 'stopping', lastError: null };
    case 'CAPTURE_COMPLETED':
      if (state.status !== 'stopping') {
        return reject(state, 'Capture must be stopping before results can be completed.');
      }
      return {
        ...state,
        status: 'completed',
        metrics: event.metrics,
        cancellationReason: null,
        failure: null,
        lastError: null,
      };
    case 'CAPTURE_CANCELLED':
      if (!isCaptureInProgress(state)) {
        return reject(state, 'Only an active capture operation can be cancelled.');
      }
      return {
        ...state,
        status: 'cancelled',
        metrics: null,
        cancellationReason: event.reason,
        failure: null,
        lastError: null,
      };
    case 'CAPTURE_FAILED':
      if (!isCaptureInProgress(state) && state.status !== 'checkingPermission') {
        return reject(state, 'There is no active capture operation to fail.');
      }
      return {
        ...state,
        status: 'failed',
        metrics: null,
        cancellationReason: null,
        failure: event.failure,
        lastError: null,
      };
    case 'RESET':
      return state.permission === 'granted'
        ? { ...createCaptureSession(), status: 'ready', permission: 'granted' }
        : createCaptureSession();
  }
}

function permissionState(permission: CapturePermission): CaptureSession {
  const failure =
    permission === 'blocked'
      ? 'permissionBlocked'
      : permission === 'unavailable'
        ? 'captureUnavailable'
        : null;
  return {
    status:
      permission === 'granted'
        ? 'ready'
        : failure === null
          ? 'permissionRequired'
          : 'failed',
    permission,
    metrics: null,
    cancellationReason: null,
    failure,
    lastError: null,
  };
}

function clearOutcome(state: CaptureSession): CaptureSession {
  return { ...state, metrics: null, cancellationReason: null, failure: null, lastError: null };
}

function isCaptureInProgress(state: CaptureSession): boolean {
  return state.status === 'starting' || state.status === 'capturing' || state.status === 'stopping';
}

function reject(state: CaptureSession, lastError: string): CaptureSession {
  return { ...state, lastError };
}
