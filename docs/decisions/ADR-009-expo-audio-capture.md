# ADR-009: Use native and web PCM adapters for Phase 2 capture

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

Expo SDK 58's official `expo-audio` documentation labels `useAudioStream` for
web, iOS, and Android. Inspection of the installed 58.0.10 package found that
the native implementation delivers PCM buffers, actual format metadata, and
explicit stop behavior, while `AudioStream.web.ts` currently returns a null
stream. The documented web support therefore cannot be relied on.

Browsers provide standards-based microphone access through `getUserMedia` and
off-main-thread PCM processing through `AudioWorklet`. Both require a secure
context; localhost qualifies for development. The Expo config plugin owns the
native microphone permission declarations. Version 58.0.10 was released more
than 24 hours before this decision.

Primary sources checked on 2026-10-22:

- <https://docs.expo.dev/versions/v58.0.0/sdk/audio/>
- <https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia>
- <https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor>

## Decision

Use exact version `expo-audio` 58.0.10 for the iOS and Android Phase 2 capture
adapter. Request mono, 16 kHz, signed 16-bit PCM through `useAudioStream`, but
treat requested format as a preference and record the actual delivered format.

Use `getUserMedia`, `MediaStreamAudioSourceNode`, and `AudioWorklet` for the web
adapter. Request mono audio as a preference, process the browser's actual
floating-point samples off the main UI thread, and record the actual audio
context sample rate. Do not use deprecated `ScriptProcessorNode`.

Wrap Expo objects behind a project-owned `AudioCapture` contract. Product and
domain code must not import Expo Audio directly. Ordinary capture is explicit,
foreground-only, and limited to three seconds. Background recording remains
disabled. App backgrounding, navigation away, interruption, cancellation,
failure, or unmount must stop capture and release resources.

Reduce PCM buffers into health metrics in memory, then discard the samples.
Do not create audio files, replay audio, upload samples, or log sample contents.
Recognition remains out of scope.

## Consequences

- Native clients use one official Expo dependency; web uses stable browser
  standards without another package.
- Raw PCM supports honest signal-health metrics and later provider-neutral
  recognition adapters.
- Actual device formats may differ and must be measured rather than assumed.
- Platform lifecycle behavior still requires separate physical-device and
  browser evidence.
- The project has two adapter implementations and must prove their contract
  semantics independently.
- Expo's documented web support did not match its installed implementation;
  provider claims remain untrusted until source and runtime evidence agree.
- Background recording permissions, services, battery cost, and persistent
  notifications are avoided.

## Alternatives considered

- **Encoded recordings through `useAudioRecorder`:** rejected for the primary
  path because browser containers differ and encoded files obscure live PCM
  health. It remains a possible time-boxed diagnostic fallback if streaming
  fails on a required platform.
- **Expo Audio streaming on web:** rejected because the installed SDK 58 web
  implementation returns no usable stream despite the platform label in the
  official API reference.
- **Encoded browser `MediaRecorder`:** retained only as a diagnostic fallback;
  container and codec differences make it a poor source for comparable live PCM
  health metrics.
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
