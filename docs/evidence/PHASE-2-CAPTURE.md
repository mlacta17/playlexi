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
| iOS simulator compile and launch | Pass with Xcode 27.1 for arm64 and fresh DerivedData |
| Android debug compile | Pass: 488 Gradle tasks; APK generated |
| Android emulator permission and capture | Pass: API 37 prompt, grant, and three-second capture lifecycle |

The Android build included `expo-audio` 58.0.10. Product configuration requests
only `android.permission.RECORD_AUDIO`; it does not declare a microphone
foreground service or notification permission. On API 37, React Native's debug
manifest also requests `ACCESS_LOCAL_NETWORK` so the development build can reach
Metro. That debug-only permission is not part of a release build.

Generated iOS configuration contains the following permission explanation:

> Allow Playlexi to check your microphone for voice spelling.

It does not declare a background-audio mode.

## Resolved iOS local-build blocker

A clean official Expo SDK 58 application compiled successfully with Xcode 27.1,
first without and then with the same Expo Audio 58.0.10 dependency used by
Playlexi. That isolated the failure to Playlexi's local cache preparation rather
than Xcode, Expo SDK 58, or Expo Audio.

The previous workaround replaced ExpoModulesJSI's entire `Products` directory
with a symlink to a temporary cache. CocoaPods did not discover the vendored
XCFramework through that directory-level symlink, so downstream Expo modules
could not resolve `ExpoModulesJSI`. A normal `Products` directory containing an
XCFramework-level symlink preserves CocoaPods discovery while keeping generated
framework data outside the file-provider-managed checkout.

After regenerating CocoaPods integration and using fresh DerivedData, Playlexi
compiled successfully for an arm64 iOS simulator with Xcode 27.1. It then
installed and launched on an iPhone 16 Pro simulator and rendered the practice
screen. No generated native source or installed package source was patched.
Microphone permission and lifecycle behavior remain separate runtime evidence.

## Runtime evidence still required

The phase is not complete. Record each row without adding raw audio or personal
identifiers to this repository.

| Platform | Target | Status | Required evidence |
| --- | --- | --- | --- |
| Web | Current Safari on localhost/HTTPS | Pending | Permission, signal metrics, background/visibility, cleanup, 20 cycles |
| Web | Current Chrome on localhost/HTTPS | Pending | Permission, signal metrics, background/visibility, cleanup, 20 cycles |
| iOS | iPhone 16 Pro simulator, iOS 18.3 | Install and launch passed | Permission and lifecycle-only evidence |
| iOS | Physical iPhone | Pending | Permission, real signal, interruption/routes, cleanup, 20 cycles |
| Android | API 37 emulator | Permission and capture lifecycle passed | Background/route checks and repeated-cycle evidence |
| Android | Physical device | Pending device | Permission, real signal, interruption/routes, cleanup, 20 cycles |

The API 37 emulator cold-booted, installed the debug APK, rendered the practice
and microphone-check screens, displayed the operating-system microphone prompt,
accepted the grant, and completed a 2.90-second capture at 16 kHz mono. The
virtual microphone produced zero-level samples, so this proves permission and
capture lifecycle only; it is not evidence of real-device signal quality.

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
