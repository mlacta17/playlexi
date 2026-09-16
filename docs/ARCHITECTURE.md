# Technical architecture

**Version:** 0.1
**Last reviewed:** 2026-09-16
**Status:** Accepted for Phase 0

## 1. Architectural objective

Build the smallest system that can independently validate native iPhone audio
capture and isolated-letter recognition. Optimize for trustworthy evidence,
clear ownership, replaceable external boundaries, and code a junior developer
can follow without knowing the legacy system.

## 2. System boundary

Phase 0 is one native iOS application. It has no server, remote API, account,
cloud database, or production telemetry pipeline.

```text
┌─────────────────────────────────────────────────────┐
│ iOS application                                     │
│                                                     │
│  SpellingSession state machine                      │
│       │                  │                          │
│       ▼                  ▼                          │
│  WordRepository      LetterRecognizer protocol     │
│  (bundled JSON)          │                          │
│                          ├── Mock recognizer        │
│                          └── Apple recognizer       │
│                                   │                 │
│                            AudioCapture protocol    │
│                                   │                 │
│                           AVAudioEngine/session     │
│                                                     │
│  Sanitized local diagnostics ── explicit export    │
└─────────────────────────────────────────────────────┘
```

The correct word belongs to the spelling session. The recognition adapter does
not receive it. This prevents answer leakage from inflating measured accuracy.

## 3. Technology decisions

Accepted decisions are recorded in `docs/decisions/`:

- Native SwiftUI validation application: ADR-001.
- One-letter-at-a-time recognition first: ADR-002.
- Local-only Phase 0 with no backend or database: ADR-003.

The precise minimum iOS version, Xcode/Swift versions, dependency policy beyond
“none by default,” and production client architecture must be recorded when the
project is generated and verified against the installed toolchain.

## 4. Source layout

The planned initial layout is intentionally shallow:

```text
Playlexi/
├── App/                   # App entry and dependency composition
├── Domain/                # Framework-independent value types and rules
├── Features/
│   └── SpellingSession/   # State, actions, view model, and views
├── Audio/                 # Audio capture boundary and native adapter
├── Speech/                # Recognition boundary, mock, and Apple adapter
└── Resources/             # Validated bundled fixtures
PlaylexiTests/             # Unit and contract tests
docs/                      # Canonical context and decisions
```

Folders are created when their first real file is added. Avoid empty architecture
and generic `Helpers`, `Managers`, `Services`, or `Utils` directories.

## 5. Dependency direction

Permitted dependencies:

```text
App → Features → Domain
App → Audio adapter → Audio protocol
App → Speech adapter → Speech protocol → Domain
Features → Speech protocol / Audio protocol / Domain
```

Domain code must not import SwiftUI, AVFAudio, Speech, networking, or persistence
frameworks. Native adapters may depend inward on domain contracts. Features do
not instantiate concrete infrastructure.

## 6. Core contracts

Names may be refined during implementation, but responsibilities must remain
separate:

- `WordRepository`: returns validated local spelling words.
- `AudioCapturing`: owns microphone permission, audio-session lifecycle, capture,
  interruption handling, and ephemeral buffers.
- `LetterRecognizing`: turns captured audio into ranked letter candidates plus
  provider-neutral evidence.
- `DiagnosticRecording`: records sanitized measurements and produces an explicit
  export file.
- `SpellingSession`: deterministic state transitions and answer comparison.

Concrete adapters never expose provider response objects to views.

## 7. State model

The spelling session is an explicit state machine. A provisional state set is:

```text
loadingWord
ready
playingPrompt
readyForLetter(index)
requestingPermission(index)
recording(index)
recognizing(index)
reviewing(index, candidates)
completed(result)
failed(recoverableError)
```

Events, not arbitrary property mutation, transition the state. Tests cover every
valid transition and representative invalid events. Audio interruption,
permission denial, cancellation, no-speech, timeout, and app-backgrounding are
first-class outcomes.

## 8. Concurrency and lifecycle

- UI-observable state is isolated to `@MainActor`.
- Audio callbacks never perform blocking work or update SwiftUI directly.
- Recognition is asynchronous and cancellable.
- Starting a new attempt cancels or rejects an existing attempt deterministically.
- Every acquired audio-session, tap, stream, and task has one visible owner and a
  tested cleanup path.
- App backgrounding and audio interruption must leave the session recoverable.

## 9. Data and persistence

There is no database in Phase 0.

- Word fixtures are versioned read-only JSON decoded through `Codable` and
  validated at load time.
- Session state is in memory.
- Preferences, if needed, use a typed wrapper over platform storage and contain
  no sensitive speech data.
- Diagnostics remain local until an explicit export action.
- Audio buffers are released after recognition. They are neither logged nor
  written to files in ordinary use.

A database, synchronization protocol, or backend requires a new ADR based on a
real activated requirement.

## 10. Error model

Errors use a small domain vocabulary with a user-safe message and recoverability:

- permission denied
- input unavailable
- audio interrupted
- no speech detected
- recognition unavailable
- recognition timed out
- ambiguous result
- invalid bundled data
- unexpected internal failure

Provider details belong in sanitized diagnostics, not user-facing copy. Errors
must never expose secrets, file paths, internal endpoints, or raw transcripts.

## 11. Security and privacy

- Request only microphone and speech permissions actually required.
- Explain permission purpose before the system prompt.
- No API secrets in the application bundle.
- No remote speech provider may be added until transport, authentication, abuse
  prevention, retention, regional processing, and cost controls are documented.
- No raw audio retention without explicit informed consent and ADR approval.
- Diagnostic exports exclude stable device identifiers and use randomized run IDs.

## 12. Testing strategy

1. **Unit tests:** domain values, word validation, state transitions, metrics.
2. **Contract tests:** every recognizer satisfies the same success, ambiguity,
   cancellation, timeout, and error semantics.
3. **Fixture tests:** known audio fixtures, where consent permits repository-safe
   samples; private benchmark audio is never committed.
4. **UI tests:** the primary session, permission denial, retry, correction, and
   Dynamic Type/VoiceOver-critical paths.
5. **Real-device validation:** the protocol in `VOICE-VALIDATION.md`. Simulator
   success is not evidence of microphone behavior.

The deterministic mock is the default for UI tests. Network availability must
never determine whether unit tests pass.

## 13. Scalability

Phase 0 scales through boundaries and evidence, not infrastructure:

- The domain is independent of the client framework.
- Recognition adapters are replaceable.
- Diagnostics have an explicit versioned schema.
- Backend and persistence decisions are deferred until their access patterns,
  privacy requirements, and scale are known.

Premature queues, service layers, remote databases, and generic repositories
would increase maintenance without solving the current risk.

## 14. External facts verified for this phase

Checked 2026-09-16 against primary sources:

- Apple documents `AVAudioEngine` input nodes and audio taps for captured audio:
  <https://developer.apple.com/documentation/avfaudio/avaudioengine>
- Apple documents `SpeechAnalyzer` and `SpeechTranscriber` for asynchronous
  speech analysis on supported systems:
  <https://developer.apple.com/documentation/speech/speechanalyzer>
- Availability and quality for isolated letters and target locales remain
  unverified and are experiment questions, not architecture facts.

## 15. Open architecture questions

- Minimum supported iOS version after installed-toolchain verification.
- Whether Apple transcription exposes useful ranked alternatives and confidence
  for isolated letters in the selected API path.
- Whether a custom language model improves letters without answer leakage.
- Whether the permanent application should remain native or become cross-platform.
- Whether future recognition should remain on-device or use a remote provider.
