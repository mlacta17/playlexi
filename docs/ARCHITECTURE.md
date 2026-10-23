# Technical architecture

**Version:** 0.4
**Last reviewed:** 2026-10-22
**Status:** Accepted for validation phases

## 1. Objective

Build the smallest maintainable system that can validate a fair voice-spelling
experience on web, iOS, and Android. Share domain behavior and ordinary UI where
that reduces complexity; isolate audio and recognition where platforms differ.

Scalability means replaceable boundaries, reproducible evidence, and clear code.
It does not mean adding infrastructure before a validated requirement exists.

## 2. System boundary

The validation system is one universal client with platform adapters. It has no
backend, remote database, accounts, or production telemetry.

```text
┌──────────────── Expo application ────────────────┐
│                                                  │
│  Routes and views                                │
│          │                                       │
│          ▼                                       │
│  SpellingSession state machine ── WordRepository │
│          │                                       │
│          ▼                                       │
│  LetterRecognizer contract                       │
│      ├── deterministic fake                      │
│      ├── Vosk candidate adapter                  │
│      └── custom-classifier candidate adapter     │
│          │                                       │
│  AudioCapture contract                           │
│      ├── web capture adapter                     │
│      ├── iOS capture adapter                     │
│      └── Android capture adapter                 │
│                                                  │
│  Sanitized diagnostics ── explicit export        │
└──────────────────────────────────────────────────┘
```

The spelling session owns the expected word. Recognition adapters never receive
the expected letter or target spelling.

## 3. Accepted technology direction

ADR-004 accepts:

- Expo and React Native for the universal client;
- Expo Router for navigation;
- strict TypeScript for application and shared packages;
- React Native Web for the initial web surface;
- Expo development builds rather than Expo Go; and
- pnpm workspaces without an additional monorepo orchestrator initially.

ADR-005 accepts provider-neutral, evidence-first speech selection. Vosk and a
custom on-device letter classifier are candidates, not production selections.
ADR-006 keeps validation phases local-first without a product backend.

ADR-007 pins the Phase 1 baseline to Node.js 24.22.1 LTS, pnpm 11.25.0,
Expo SDK 58, React Native 0.88, React 19.3.0, React Native Web 0.21.0, Jest 30,
and React Native Testing Library 14 or newer. Exact compatible package releases
are fixed in manifests and the committed lockfile. “Latest” is not a version
policy.

ADR-008 uses GitHub Actions for fast Linux CI checks, with official actions
pinned to immutable commits. Native builds remain documented local evidence
until capture work or release cadence justifies hosted native CI.

ADR-009 uses Expo Audio 58.0.10 on iOS and Android and browser
`getUserMedia` plus `AudioWorklet` on web, both behind the provider-neutral
`AudioCapture` contract. Adapters request short, foreground-only PCM streams;
health metrics are reduced in memory and sample buffers are immediately
discarded. Background recording and audio-file creation remain disabled.

Primary references checked 2026-10-21:

- Expo describes Expo Router as universal across Android, iOS, and web:
  <https://docs.expo.dev/router/introduction/>.
- Expo requires development builds for third-party custom native code:
  <https://docs.expo.dev/workflow/customizing/>.
- Vosk documents runtime grammar and acoustic-model adaptation separately:
  <https://github.com/alphacep/vosk-space/blob/master/adaptation.md>.

## 4. Planned repository layout

```text
apps/
└── playlexi/                 # Expo application and route composition
packages/
├── audio-contract/           # Provider-neutral capture lifecycle and metrics
├── domain/                   # Framework-independent spelling behavior
├── speech-contract/          # Audio/recognition types and contracts
├── test-fixtures/            # Non-sensitive deterministic fixtures
└── ui/                       # Proven reusable presentation primitives
modules/
└── letter-recognizer/        # Local Swift/Kotlin module only if required
tools/
├── benchmark/                # Sanitized evaluation and reporting tools
└── ios/                      # Reproducible local iOS build preparation
docs/                         # Canonical context and decisions
```

Directories are created only with their first real file. Avoid generic
`helpers`, `managers`, `services`, and `utils` directories. Each
non-obvious directory gets a short README.

Generated `ios/` and `android/` directories remain reproducible through Expo
Prebuild unless a later ADR accepts committed native projects. First-party
native source belongs in `modules/`, not in generated output.

## 5. Dependency direction

```text
Expo routes/views ────────┐
                         ▼
Feature orchestration → Domain
           │             ▲
           ▼             │
Speech contract ─────────┘
     ▲
     ├── fake adapter
     ├── Vosk adapter
     └── classifier adapter

Audio contract
     ▲
     ├── web adapter
     ├── iOS adapter
     └── Android adapter
```

- Domain imports no React, Expo, browser, native, storage, or provider code.
- Contracts expose provider-neutral values and errors.
- Adapters depend inward on contracts; shared features do not import concrete
  adapters.
- Platform selection occurs in one composition boundary.

## 6. Core contracts

- `WordRepository`: returns validated bundled words.
- `AudioCapture`: owns permission, lifecycle, interruption, and ephemeral audio.
- `LetterRecognizer`: returns ranked A–Z candidates or a typed rejection.
- `DiagnosticRecorder`: records sanitized measurements and explicit exports.
- `SpellingSession`: applies deterministic events and compares final spelling.

A provisional recognition result is:

```ts
type LetterRecognitionResult =
  | { kind: "recognized"; candidates: readonly LetterCandidate[] }
  | { kind: "ambiguous" }
  | { kind: "nonLetterSpeech" }
  | { kind: "noSpeech" }
  | { kind: "poorAudioQuality" }
  | { kind: "unavailable" };
```

Provider objects never escape adapters. Confidence is optional evidence, not a
universal probability.

## 7. State and lifecycle

The spelling session uses explicit states and events. A provisional state set:

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

Invalid transitions are rejected and tested. Permission denial, cancellation,
timeouts, interruptions, backgrounding, page visibility changes, audio-route
changes, and browser suspension are first-class outcomes.

## 8. Platform adapters

### Web

- Use standards-based microphone capture.
- Perform processing off the main UI path.
- Use `AudioWorklet`; do not introduce deprecated `ScriptProcessorNode`.
- Test browser permission and suspension behavior independently.

### iOS and Android

- Use Expo development builds.
- Prefer maintained modules with adequate APIs.
- Add a local Expo Module in Swift/Kotlin when a community wrapper cannot expose
  required alternatives, timing, lifecycle, or model behavior.
- A native library is not accepted merely because a JavaScript wrapper exists.

## 9. Speech-engine strategy

The first comparison has two tracks:

1. Vosk with a letters-only grammar and explicit unknown/reject tests.
2. A transfer-learned, on-device short-audio classifier with A–Z plus negative
   classes.

Neither engine may receive the answer. A grammar constrains decoder output; it
does not prove that out-of-grammar speech becomes `[unk]`. Whole-word speech,
multiple letters, unrelated speech, noise, and silence are required negatives.

Production selection requires the gates in `VOICE-VALIDATION.md`. Adding
Rhino, Apple, Google, a remote provider, or another runtime requires an ADR or a
time-boxed spike explicitly authorized by the roadmap.

## 10. Data and persistence

There is no application database in validation phases.

- Bundled word fixtures are versioned, read-only, and schema-validated.
- Session state is in memory.
- Diagnostics are local and explicitly exported.
- Audio is ephemeral during ordinary use.
- Private benchmark audio and participant records live outside Git.
- Training manifests use randomized participant IDs and contain no direct
  identifiers.

Any backend, synchronization, retained audio, or model-training service requires
a new ADR based on a real activated requirement.

## 11. Security, privacy, and accessibility

- Request only permissions required by the active feature.
- Explain microphone use before the system prompt.
- Store no API secrets in client bundles.
- Do not collect child audio before an accepted consent and data-governance ADR.
- Do not infer accent, ethnicity, nationality, age, or identity from voice.
- Exports exclude raw transcripts, stable identifiers, and precise personal
  metadata unless separately approved.
- Primary flows support keyboard/touch correction, screen readers, text scaling,
  adequate targets, and non-color-only status.

## 12. Testing

1. **Domain tests:** values, fixtures, state transitions, comparison, metrics.
2. **Contract tests:** every recognizer and capture adapter satisfies the same
   success, rejection, cancellation, timeout, and cleanup semantics.
3. **Component tests:** primary, retry, correction, and failure flows.
4. **Platform integration tests:** permissions and lifecycle on each platform.
5. **Benchmark tests:** private, speaker-disjoint datasets and negative speech.
6. **Real-device/browser validation:** recorded evidence, not simulator claims.

Network access and private audio never determine whether ordinary unit tests pass.

## 13. Deferred architecture

The following remain deliberately undecided:

- production speech engine and model runtime;
- training infrastructure;
- backend, API, database, and authentication;
- cloud synchronization;
- production hosting;
- supported device/browser version matrix;
- telemetry and crash reporting; and
- continuous spelling and competitive integrity.

Each is selected when evidence and active product scope justify its cost.
