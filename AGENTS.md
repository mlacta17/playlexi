# Playlexi — repository instructions

This is the canonical rules file for every coding agent and contributor working
in this repository. Detailed product and technical context belongs in `docs/`.

## Required reading and authority

Before changing code or documentation, read:

1. `docs/PRODUCT.md` for the product and its boundaries.
2. `docs/ARCHITECTURE.md` for system structure and dependency rules.
3. `docs/VOICE-VALIDATION.md` for the active speech experiment.
4. `docs/ROADMAP.md` for the current phase and its exit gate.
5. Relevant accepted ADRs in `docs/decisions/`.

Precedence is: accepted ADRs for a specific decision, then
`ARCHITECTURE.md`, then `PRODUCT.md`, then the active roadmap phase. Resolve
conflicts in documentation before implementing code.

## Current direction

Playlexi is a new cross-platform spelling product targeting web, iOS, and
Android. The client foundation is Expo, React Native, Expo Router, and strict
TypeScript. Shared product behavior is cross-platform; capture and recognition
remain replaceable platform adapters.

Phase 1's documentation alignment and deterministic universal spelling flow are
complete. Phase 2 is not yet active. Do not add microphone capture, speech
engines, accounts, a backend, a database, multiplayer, rankings, monetization,
or production analytics before the roadmap activates that work.

## Evidence and speech rules

- A speech engine is a candidate until a recorded benchmark proves it.
- Do not assume Vosk, Apple, Google, Rhino, or a custom model is the winner.
- Recognition receives audio and capture metadata, never the expected letter or
  target spelling. Expected length may belong to the spelling session.
- Capture one letter per attempt until an accepted ADR and evidence authorize a
  continuous-spelling mode.
- Do not treat `[unk]`, confidence, duration, or timestamps as proof of cheating.
- Report per-letter, per-cohort, per-platform, per-device, and per-condition
  results; an overall average is insufficient.
- Dataset partitions are speaker-disjoint. Keep a participant, household, and
  preferably recording device in only one train/validation/test partition.
- Never tune against only the repository owner's voice.
- Raw audio is not committed to Git. Child voice collection is prohibited until
  an accepted privacy/consent ADR and approved collection protocol exist.

## Engineering rules

- Junior-readable code wins over cleverness.
- Keep domain models independent of React, React Native, Expo, browsers, native
  modules, and recognition providers.
- Put audio capture, recognition runtimes, storage, and network systems behind
  narrow typed contracts with deterministic fakes.
- Model spelling sessions as explicit states and events. Reject invalid
  transitions visibly.
- Validate external data at boundaries. Avoid unsafe casts and unvalidated
  provider payloads.
- No global mutable state or singleton service locators.
- Do not log raw audio, transcripts, secrets, stable device identifiers, or
  personal data.
- Every behavior change needs tests proportional to its risk. Real-device
  evidence is separate from unit and integration tests.
- Add a short `README.md` to every non-obvious directory.
- Pin runtime and dependency versions when the application is scaffolded. Do
  not select packages merely because they are newest.

## Architecture changes

Create or supersede an ADR before implementing a decision-shaped change,
including a new dependency, speech engine, model runtime, backend, database,
remote API, persistence model, audio-retention policy, supported-platform
change, or convention deviation. Use `docs/decisions/ADR-TEMPLATE.md`.

## Legacy boundary

Legacy Playlexi repositories are read-only evidence. They are not dependencies,
and their code, configuration, Markdown, prompts, skills, or architecture are
not imported by default. Follow `docs/LEGACY-INVENTORY.md` before promoting any
specific asset.

## Completion

A task is complete only when relevant automated checks pass, documentation
matches behavior, no roadmap boundary is crossed, and device/provider claims
are supported by recorded evidence.
