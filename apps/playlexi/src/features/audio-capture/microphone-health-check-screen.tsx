import {
  createCaptureHealthAccumulator,
  createCaptureSession,
  finalizeCaptureHealth,
  reducePcmBuffer,
  transitionCaptureSession,
  type AudioCapture,
  type CaptureCancellationReason,
  type CaptureFailure,
  type CaptureSession,
  type PcmBuffer,
} from '@playlexi/audio-contract';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { AppState, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MAXIMUM_CAPTURE_MILLISECONDS = 3_000;

interface Props {
  readonly capture: AudioCapture;
  readonly onExit?: () => void;
}

export function MicrophoneHealthCheckScreen({ capture, onExit }: Props) {
  const [session, dispatch] = useReducer(
    transitionCaptureSession,
    undefined,
    createCaptureSession,
  );
  const [liveLevel, setLiveLevel] = useState(0);
  const accumulatorRef = useRef(createCaptureHealthAccumulator());
  const lastLevelTimestampRef = useRef(-1);
  const stopInFlightRef = useRef(false);
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionRef = useRef(session);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  const clearStopTimer = useCallback(() => {
    if (stopTimerRef.current !== null) clearTimeout(stopTimerRef.current);
    stopTimerRef.current = null;
  }, []);

  const stopCapture = useCallback(async () => {
    if (stopInFlightRef.current || sessionRef.current.status !== 'capturing') return;
    stopInFlightRef.current = true;
    clearStopTimer();
    dispatch({ type: 'STOP_REQUESTED' });
    try {
      const result = await capture.stop();
      if (result.kind === 'failed') {
        dispatch({ type: 'CAPTURE_FAILED', failure: 'stopFailed' });
        return;
      }
      if (result.kind === 'cancelled') {
        dispatch({ type: 'CAPTURE_CANCELLED', reason: 'userCancelled' });
        return;
      }
      const metrics = finalizeCaptureHealth(accumulatorRef.current);
      dispatch(
        metrics === null
          ? { type: 'CAPTURE_FAILED', failure: 'invalidAudio' }
          : { type: 'CAPTURE_COMPLETED', metrics },
      );
    } catch {
      dispatch({ type: 'CAPTURE_FAILED', failure: 'stopFailed' });
    } finally {
      stopInFlightRef.current = false;
    }
  }, [capture, clearStopTimer]);

  const cancelCapture = useCallback(
    async (reason: CaptureCancellationReason) => {
      clearStopTimer();
      try {
        await capture.cancel();
      } finally {
        stopInFlightRef.current = false;
        dispatch({ type: 'CAPTURE_CANCELLED', reason });
      }
    },
    [capture, clearStopTimer],
  );

  useEffect(() => {
    let mounted = true;
    capture
      .getPermission()
      .then((permission) => {
        if (mounted) dispatch({ type: 'PERMISSION_RESOLVED', permission });
      })
      .catch(() => {
        if (mounted) dispatch({ type: 'CAPTURE_FAILED', failure: 'captureUnavailable' });
      });
    return () => {
      mounted = false;
      clearStopTimer();
      void capture.cancel();
    };
  }, [capture, clearStopTimer]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (
        nextState !== 'active' &&
        (sessionRef.current.status === 'starting' || sessionRef.current.status === 'capturing')
      ) {
        void cancelCapture('backgrounded');
      }
    });
    return () => subscription.remove();
  }, [cancelCapture]);

  async function requestPermission() {
    dispatch({ type: 'PERMISSION_REQUESTED' });
    try {
      const permission = await capture.requestPermission();
      dispatch({ type: 'PERMISSION_RESOLVED', permission });
    } catch {
      dispatch({ type: 'CAPTURE_FAILED', failure: 'captureUnavailable' });
    }
  }

  async function startCapture() {
    dispatch({ type: 'START_REQUESTED' });
    accumulatorRef.current = createCaptureHealthAccumulator();
    lastLevelTimestampRef.current = -1;
    setLiveLevel(0);
    try {
      await capture.start(
        {
          requestedSampleRate: 16_000,
          requestedChannels: 1,
          maximumDurationMilliseconds: MAXIMUM_CAPTURE_MILLISECONDS,
        },
        receiveBuffer,
      );
      dispatch({ type: 'CAPTURE_STARTED' });
      stopTimerRef.current = setTimeout(() => void stopCapture(), MAXIMUM_CAPTURE_MILLISECONDS);
    } catch {
      dispatch({ type: 'CAPTURE_FAILED', failure: 'startFailed' });
    }
  }

  function receiveBuffer(buffer: PcmBuffer) {
    try {
      accumulatorRef.current = reducePcmBuffer(accumulatorRef.current, buffer);
      if (
        lastLevelTimestampRef.current < 0 ||
        buffer.timestampSeconds - lastLevelTimestampRef.current >= 0.1
      ) {
        lastLevelTimestampRef.current = buffer.timestampSeconds;
        setLiveLevel(bufferPeak(buffer));
      }
    } catch {
      clearStopTimer();
      void capture.cancel();
      dispatch({ type: 'CAPTURE_FAILED', failure: 'invalidAudio' });
    }
  }

  function reset() {
    clearStopTimer();
    accumulatorRef.current = createCaptureHealthAccumulator();
    lastLevelTimestampRef.current = -1;
    setLiveLevel(0);
    const shouldRefreshPermission = sessionRef.current.permission !== 'granted';
    dispatch({ type: 'RESET' });
    if (shouldRefreshPermission) {
      capture
        .getPermission()
        .then((permission) => dispatch({ type: 'PERMISSION_RESOLVED', permission }))
        .catch(() => dispatch({ type: 'CAPTURE_FAILED', failure: 'captureUnavailable' }));
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.content}>
          <Text style={styles.eyebrow}>PHASE 2 · MICROPHONE CHECK</Text>
          <Text accessibilityRole="header" style={styles.title}>
            Check your microphone
          </Text>
          <Text style={styles.body}>
            Playlexi will listen for up to three seconds to measure sound quality. It will not
            recognize, save, replay, or upload what you say.
          </Text>

          <StatusCard session={session} liveLevel={liveLevel} />

          {session.status === 'permissionRequired' ? (
            <PrimaryButton label="Allow microphone check" onPress={() => void requestPermission()} />
          ) : null}
          {session.status === 'ready' ? (
            <PrimaryButton label="Start microphone check" onPress={() => void startCapture()} />
          ) : null}
          {session.status === 'capturing' ? (
            <PrimaryButton label="Stop microphone check" onPress={() => void stopCapture()} />
          ) : null}
          {session.status === 'completed' ||
          session.status === 'cancelled' ||
          session.status === 'failed' ? (
            <SecondaryButton label="Try again" onPress={reset} />
          ) : null}
          {onExit !== undefined ? (
            <SecondaryButton label="Back to spelling practice" onPress={onExit} />
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatusCard({
  liveLevel,
  session,
}: {
  readonly liveLevel: number;
  readonly session: CaptureSession;
}) {
  if (session.status === 'checkingPermission') {
    return <Text style={styles.notice}>Checking microphone availability…</Text>;
  }
  if (session.status === 'permissionRequired') {
    return <Text style={styles.notice}>Your device will ask before Playlexi uses the microphone.</Text>;
  }
  if (session.status === 'starting' || session.status === 'stopping') {
    return <Text style={styles.notice}>{session.status === 'starting' ? 'Starting…' : 'Stopping…'}</Text>;
  }
  if (session.status === 'capturing') {
    return (
      <View accessibilityLabel={`Input level ${Math.round(liveLevel * 100)} percent`} style={styles.card}>
        <Text style={styles.cardTitle}>Listening now</Text>
        <View style={styles.meterTrack}>
          <View style={[styles.meterFill, { width: `${Math.max(2, liveLevel * 100)}%` }]} />
        </View>
        <Text style={styles.body}>Say one letter in your normal voice.</Text>
      </View>
    );
  }
  if (session.status === 'completed' && session.metrics !== null) {
    return (
      <View accessibilityLiveRegion="polite" style={styles.successCard}>
        <Text style={styles.cardTitle}>Microphone signal received</Text>
        <Metric label="Duration" value={`${session.metrics.durationSeconds.toFixed(2)} s`} />
        <Metric label="Sample rate" value={`${session.metrics.sampleRate} Hz`} />
        <Metric label="Channels" value={String(session.metrics.channels)} />
        <Metric label="Peak level" value={`${Math.round(session.metrics.peak * 100)}%`} />
        <Metric label="Average level" value={`${Math.round(session.metrics.rms * 100)}%`} />
        <Metric label="Clipped samples" value={`${(session.metrics.clippedSampleRatio * 100).toFixed(2)}%`} />
      </View>
    );
  }
  if (session.status === 'cancelled') {
    return <Text style={styles.notice}>{cancellationMessage(session.cancellationReason)}</Text>;
  }
  if (session.status === 'failed') {
    return (
      <Text accessibilityLiveRegion="assertive" style={styles.error}>
        {failureMessage(session.failure)}
      </Text>
    );
  }
  return <Text style={styles.notice}>Ready for a short microphone check.</Text>;
}

function Metric({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <View style={styles.metricRow}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

function PrimaryButton({ label, onPress }: { readonly label: string; readonly onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.primaryButton}>
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}

function SecondaryButton({ label, onPress }: { readonly label: string; readonly onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.secondaryButton}>
      <Text style={styles.secondaryButtonText}>{label}</Text>
    </Pressable>
  );
}

function bufferPeak(buffer: PcmBuffer): number {
  let peak = 0;
  for (const sample of buffer.samples) peak = Math.max(peak, Math.abs(sample) / 32_768);
  return peak;
}

function cancellationMessage(reason: CaptureCancellationReason | null): string {
  if (reason === 'backgrounded') return 'The check stopped when Playlexi left the foreground.';
  if (reason === 'interrupted') return 'Another audio activity interrupted the check.';
  return 'The microphone check was cancelled safely.';
}

function failureMessage(failure: CaptureFailure | null): string {
  switch (failure) {
    case 'permissionDenied':
      return 'Microphone access was denied. You can try again.';
    case 'permissionBlocked':
      return 'Microphone access is blocked. Enable it in your device or browser settings.';
    case 'invalidAudio':
      return 'No usable microphone signal arrived. Check the input and try again.';
    case 'startFailed':
      return 'The microphone could not start. Check whether another app is using it.';
    case 'stopFailed':
      return 'The microphone did not stop cleanly. Playlexi released what it could; try again.';
    default:
      return 'Microphone capture is unavailable on this device or browser.';
  }
}

const colors = {
  background: '#FFF8EE',
  card: '#FFFFFF',
  ink: '#17223B',
  muted: '#586174',
  primary: '#5B3FD0',
  primaryDark: '#3E2998',
  soft: '#EEE9FF',
  success: '#DCF7E8',
  warning: '#FFF1C2',
  error: '#9F1D2F',
  border: '#D8D3C8',
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  page: { flexGrow: 1, alignItems: 'center', padding: 20 },
  content: { width: '100%', maxWidth: 620, gap: 18 },
  eyebrow: { color: colors.primaryDark, fontSize: 13, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: colors.ink, fontSize: 36, fontWeight: '800', lineHeight: 42 },
  body: { color: colors.muted, fontSize: 17, lineHeight: 25 },
  notice: { backgroundColor: colors.warning, borderRadius: 14, color: colors.ink, fontSize: 16, padding: 16 },
  error: { backgroundColor: '#FDE7EA', borderRadius: 14, color: colors.error, fontSize: 16, fontWeight: '700', padding: 16 },
  card: { backgroundColor: colors.card, borderColor: colors.border, borderRadius: 18, borderWidth: 1, gap: 14, padding: 18 },
  successCard: { backgroundColor: colors.success, borderRadius: 18, gap: 10, padding: 18 },
  cardTitle: { color: colors.ink, fontSize: 22, fontWeight: '800' },
  meterTrack: { backgroundColor: colors.soft, borderRadius: 12, height: 24, overflow: 'hidden' },
  meterFill: { backgroundColor: colors.primary, borderRadius: 12, height: 24 },
  metricRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 16 },
  metricLabel: { color: colors.muted, fontSize: 15 },
  metricValue: { color: colors.ink, fontSize: 15, fontWeight: '700' },
  primaryButton: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 14, minHeight: 54, justifyContent: 'center', padding: 14 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  secondaryButton: { alignItems: 'center', backgroundColor: colors.card, borderColor: colors.primary, borderRadius: 14, borderWidth: 2, minHeight: 50, justifyContent: 'center', padding: 12 },
  secondaryButtonText: { color: colors.primaryDark, fontSize: 16, fontWeight: '700' },
});
