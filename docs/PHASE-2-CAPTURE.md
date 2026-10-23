# Phase 2 brief: cross-platform capture

**Status:** Active
**Started:** 2026-10-22
**Exit gate:** Permission, lifecycle, interruption, cleanup, and audio-health
evidence pass on web, iOS, and Android.

## 1. Objective

Prove that Playlexi can capture one short letter utterance reliably on each
platform before any speech engine is introduced. Phase 2 measures the microphone
path; it does not decide whether a letter was spoken correctly.

## 2. User-facing slice

Add a separate microphone health check. It must:

1. explain why microphone access is needed before showing the system prompt;
2. let the user explicitly request permission;
3. start one short foreground-only capture;
4. show a live, non-spoiling input-level indicator;
5. stop manually or automatically after three seconds;
6. show sanitized health results; and
7. let the user retry after denial, interruption, cancellation, or failure.

The existing deterministic spelling practice remains available and does not use
the microphone during this phase.

## 3. Implementation slices

### Slice A — contracts and deterministic tests

- Add a framework-independent `AudioCapture` contract.
- Model permission and capture lifecycle as explicit states and events.
- Add deterministic fake capture adapters.
- Compute duration, actual sample rate, channel count, peak amplitude, RMS,
  clipped-sample ratio, buffer gaps, and received-frame count.
- Test invalid transitions, duplicate starts/stops, late buffers, cancellation,
  cleanup, and failure recovery.

### Slice B — Expo Audio adapter and health-check UI

- Add the exact Expo SDK 58-compatible `expo-audio` version.
- Wrap `useAudioStream` behind the project contract.
- Request mono 16 kHz signed 16-bit PCM, while recording the actual format
  delivered by the device.
- Keep PCM in memory only and discard it immediately after metrics are reduced.
- Disable background recording and cancel capture when the app loses the
  foreground.
- Add accessible permission, recording, stopping, result, and retry states.

### Slice C — platform evidence

- Web: current Safari and Chrome on localhost or HTTPS.
- iOS: physical iPhone plus simulator lifecycle checks.
- Android: emulator for functional checks and a physical Android device before
  the phase can exit.
- Exercise built-in microphone and any available wired or Bluetooth route as
  separately labeled evidence; unavailable routes are recorded, not invented.

## 4. Evidence matrix

For every platform/device/browser combination, record:

- permission status before and after the request;
- grant, denial, and blocked/restricted behavior;
- first-start and repeat-start latency;
- manual stop and three-second automatic stop;
- backgrounding, interruption, and route-change outcomes;
- actual sample rate, channel count, frame count, duration, peak, RMS, clipping,
  and maximum buffer gap;
- 20 consecutive start/stop cycles without a hang or leaked capture;
- cleanup after unmount, navigation, error, and cancellation; and
- app commit, build type, OS/browser, device, and input route.

## 5. Exit criteria

Phase 2 completes only when:

- no test produces a crash, hang, unrecoverable state, or continuing microphone
  indicator after cleanup;
- permissions are understandable and recoverable on each platform;
- backgrounding and interruptions produce a documented recoverable outcome;
- captured speech produces non-zero frames and plausible health measurements;
- silence, clipping, zero-length, and overlong capture are distinguishable;
- the 20-cycle cleanup test passes on every required platform;
- no raw PCM, audio file, transcript, participant identifier, or secret enters
  Git, logs, diagnostics, or network traffic; and
- evidence is recorded in `docs/evidence/`.

## 6. Out of scope

- Letter recognition, Vosk, custom classifiers, or cloud speech APIs.
- Saving, replaying, uploading, or exporting ordinary audio.
- Background recording.
- Training data or child voice collection.
- Accounts, database, backend, telemetry, ranking, or multiplayer.
- Claiming capture quality from a simulator or emulator alone.

## 7. Owner participation

Engineering can implement contracts, metrics, UI, automated tests, builds, and
simulator/browser checks. The product owner is needed to:

- approve the operating-system microphone prompt wording;
- allow microphone access when the device prompts;
- connect and trust the physical iPhone for signing and testing;
- speak the short scripted samples and trigger interruptions/backgrounding; and
- provide access to a physical Android device before the phase exit gate.
