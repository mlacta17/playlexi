# Phase 2 capture evidence

**Status:** In progress
**Started:** 2026-10-22
**Last updated:** 2026-10-23
**Scope:** Microphone permission, foreground capture, audio health, lifecycle,
and cleanup only. No recognition claim is made here.

## Implemented slice

- Provider-neutral `AudioCapture` permission and lifecycle contract.
- Immutable PCM health reduction for actual sample rate, channels, duration,
  frames, buffer count, peak, RMS, clipping, and maximum buffer gap.
- Deterministic fake adapter and invalid-transition tests.
- Native Expo Audio adapter using `useAudioStream`.
- Browser adapter using `getUserMedia` and `AudioWorklet`.
- Separate three-second microphone health-check screen with pre-permission copy,
  live level, manual and automatic stop, retry, background cancellation, and
  sanitized results.
- In-memory reduction only: no audio file, replay, upload, transcript, raw-sample
  log, or retained recording.

## Automated evidence

Recorded on 2026-10-23 from the repository root.

| Check | Result |
| --- | --- |
| Frozen dependency install | Pass |
| Lint | Pass |
| Strict TypeScript | Pass across five workspaces |
| Unit and component tests | Pass: 9 suites, 22 tests |
| Production web export | Pass: four routes, including `/microphone-check` |
| Expo dependency compatibility check | Pass |
| Android debug compile | Pass: 488 Gradle tasks; APK generated |

The Android build included `expo-audio` 58.0.10. Generated Android configuration
requests only `android.permission.RECORD_AUDIO`; it does not declare a microphone
foreground service or notification permission.

Generated iOS configuration contains the following permission explanation:

> Allow Playlexi to check your microphone for voice spelling.

It does not declare a background-audio mode.

## iOS local-build blocker

The current source does not yet have a successful Xcode 27.1 simulator build.
After a clean Expo Prebuild, CocoaPods install, regenerated ExpoModulesJSI cache,
and clean Playlexi DerivedData, Xcode fails while compiling upstream Expo modules:

```text
Unable to resolve module dependency: 'ExpoModulesJSI'
```

The error originates in `ExpoModulesCore`, before Playlexi application source is
compiled. Expo Autolinking's supported `buildFromSource` override for
`expo-modules-core` was also tested and produced the same missing-module error,
so that ineffective override was not retained. No generated native file or
installed package was patched to conceal the failure.

This blocks iOS runtime capture evidence, not the platform-neutral contract,
metrics, component tests, web export, or Android compile. Revisit against an
Expo patch compatible with Xcode 27.1, or isolate a minimal reproduction before
changing the accepted stack.

Related upstream cache behavior checked during diagnosis:

- <https://github.com/expo/expo/issues/50365>

## Runtime evidence still required

The phase is not complete. Record each row without adding raw audio or personal
identifiers to this repository.

| Platform | Target | Status | Required evidence |
| --- | --- | --- | --- |
| Web | Current Safari on localhost/HTTPS | Pending | Permission, signal metrics, background/visibility, cleanup, 20 cycles |
| Web | Current Chrome on localhost/HTTPS | Pending | Permission, signal metrics, background/visibility, cleanup, 20 cycles |
| iOS | iPhone simulator | Blocked | Resolve upstream Xcode/Expo module build, then lifecycle-only evidence |
| iOS | Physical iPhone | Pending | Permission, real signal, interruption/routes, cleanup, 20 cycles |
| Android | API 37 emulator | Build passed; runtime pending | Permission and lifecycle functional checks |
| Android | Physical device | Pending device | Permission, real signal, interruption/routes, cleanup, 20 cycles |

The configured API 37 emulator remained in its operating-system boot animation
during this run, so the verified APK could not be installed. It was stopped
after the package service remained unavailable; no Playlexi runtime claim is
made from that attempt.

## Owner-assisted script

For each real browser or device:

1. Open **Microphone health check**.
2. Confirm the explanation appears before the operating-system prompt.
3. Grant permission and say one letter in a normal voice.
4. Confirm non-zero frames, plausible duration, and a responsive input meter.
5. Repeat with silence and with deliberately loud speech; do not record the
   spoken content in evidence.
6. Test manual stop and three-second automatic stop.
7. Start again, background the app or tab, return, and confirm recovery.
8. Trigger any available interruption or route change and record only the
   outcome and sanitized metrics.
9. Complete 20 consecutive start/stop cycles and confirm the microphone
   indicator turns off after each stop.
10. Record app commit, build type, OS/browser version, device model, and input
    route. Do not record names, account identifiers, transcripts, or audio.
