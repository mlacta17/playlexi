# ADR-009: Use Expo Audio PCM streaming for Phase 2 capture

- **Status:** Accepted
- **Date:** 2026-10-22
- **Deciders:** Product owner and engineering
- **Supersedes:** None
- **Superseded by:** None

## Context

Phase 2 must measure cross-platform microphone behavior without coupling capture
to a speech engine. The application already uses Expo SDK 58 and Continuous
Native Generation. A capture dependency must expose raw samples and actual
format metadata, work on web, iOS, and Android, and permit explicit cleanup.

Expo SDK 58's official `expo-audio` package provides `useAudioStream` on web,
iOS, and Android. It delivers real-time PCM buffers plus actual sample rate and
channel count, and its stream `stop()` releases native audio resources. Its
config plugin owns the native microphone permission declarations. The official
SDK 58 recommendation is `expo-audio` 58.0.10, released more than 24 hours
before this decision.

Primary sources checked on 2026-10-22:

- <https://docs.expo.dev/versions/v58.0.0/sdk/audio/>
- <https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia>

## Decision

Use exact version `expo-audio` 58.0.10 as the Phase 2 capture adapter. Request
mono, 16 kHz, signed 16-bit PCM through `useAudioStream`, but treat requested
format as a preference and record the actual delivered format.

Wrap Expo objects behind a project-owned `AudioCapture` contract. Product and
domain code must not import Expo Audio directly. Ordinary capture is explicit,
foreground-only, and limited to three seconds. Background recording remains
disabled. App backgrounding, navigation away, interruption, cancellation,
failure, or unmount must stop capture and release resources.

Reduce PCM buffers into health metrics in memory, then discard the samples.
Do not create audio files, replay audio, upload samples, or log sample contents.
Recognition remains out of scope.

## Consequences

- One official Expo dependency can exercise a comparable PCM path across all
  three clients.
- Raw PCM supports honest signal-health metrics and later provider-neutral
  recognition adapters.
- Actual device formats may differ and must be measured rather than assumed.
- Platform lifecycle behavior still requires separate physical-device and
  browser evidence.
- The project depends on a relatively new streaming API and must keep the
  adapter boundary narrow enough to replace it.
- Background recording permissions, services, battery cost, and persistent
  notifications are avoided.

## Alternatives considered

- **Encoded recordings through `useAudioRecorder`:** rejected for the primary
  path because browser containers differ and encoded files obscure live PCM
  health. It remains a possible time-boxed diagnostic fallback if streaming
  fails on a required platform.
- **Direct browser `getUserMedia` plus separate native libraries:** viable but
  rejected initially because it creates three lifecycle implementations before
  the official Expo path is tested.
- **A custom Swift/Kotlin Expo module:** deferred until evidence shows the
  official API cannot expose required data or cleanup behavior.
- **React Native Audio API:** more powerful than required for the bounded
  capture experiment and would add an unnecessary second abstraction now.
- **Add a recognizer at the same time:** rejected because recognition failures
  would conceal capture defects.

## Validation

Validate through contract and metric tests, a deterministic fake adapter,
production web/native builds, and the device/browser matrix in
`docs/PHASE-2-CAPTURE.md`. Revisit this decision if any required platform cannot
deliver buffers, report actual format, stop reliably, or pass 20 consecutive
start/stop cycles.
