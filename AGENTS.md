# Playlexi — repository instructions

This is the canonical rules file for every coding agent and contributor working
in this repository. Keep it concise; detailed context belongs in `docs/`.

## Authority and required reading

Before changing code or documentation, read:

1. `docs/PRODUCT.md` for product scope.
2. `docs/ARCHITECTURE.md` for technical boundaries.
3. `docs/VOICE-VALIDATION.md` for the active validation protocol.
4. `docs/ROADMAP.md` for the current phase gate.
5. Relevant accepted ADRs in `docs/decisions/`.

Precedence is: accepted ADRs for a specific decision, then
`ARCHITECTURE.md`, then `PRODUCT.md`, then the active phase in `ROADMAP.md`.
If documents conflict, stop and correct the documents before implementing.

## Current scope

The active milestone is an iOS voice-validation application, not the complete
Playlexi product. It contains a deterministic spelling session, native audio
capture, one-letter-at-a-time recognition, correction/retry controls, local
diagnostics, and a small bundled word list.

Do not add accounts, a backend, a database, multiplayer, rankings, XP,
leaderboards, social features, monetization, analytics SDKs, or a cloud speech
provider unless the roadmap explicitly activates that work and an ADR accepts
the decision.

## Evidence rules

- Never claim that a speech provider, Apple framework, device, accent, or audio
  configuration works without an official source and real-device evidence.
- Separate facts, hypotheses, and open questions in documentation.
- Provider marketing is not validation. Record OS version, device, build,
  locale, sample count, cohort, failures, latency, and test date.
- Never tune against only the repository owner's voice.
- Do not use the correct spelling as a hidden recognition hint. Expected word
  length may be used; the answer may not.
- A third-party dependency requires an accepted ADR before installation.

## Engineering rules

- Prefer small, explicit Swift types over frameworks and abstractions.
- Keep domain models independent of SwiftUI, audio frameworks, and providers.
- Put external systems behind narrow protocols and include deterministic fakes.
- Model the spelling session as explicit states; invalid transitions must be
  impossible or rejected visibly.
- Validate all data at boundaries, including bundled JSON and imported result
  files. Never force-cast external data.
- Use structured concurrency. UI state changes belong on `@MainActor`; audio
  work must not block the main thread.
- No singleton service locators or global mutable state.
- Do not log raw audio, transcripts, secrets, email addresses, or device
  identifiers. Debug logs must be safe to retain.
- Raw voice recordings are ephemeral by default. Retention requires explicit
  consent and an accepted privacy ADR.
- Every behavior change needs tests proportional to its risk. Recognition
  adapters require fixture and contract tests; real-device results remain a
  separate validation gate.
- New non-obvious directories require a short `README.md` explaining their
  purpose, permitted contents, and dependencies.
- Junior-readable code wins over cleverness. Name units, thresholds, states,
  and failure modes explicitly.

## Architecture change rule

Create or update an ADR before implementing any decision-shaped change,
including a new dependency, backend, database, remote API, persistence model,
speech provider, supported OS change, audio retention, or convention deviation.
Use `docs/decisions/ADR-TEMPLATE.md`.

## Completion rule

A task is complete only when relevant tests pass, documentation matches the
implemented behavior, no scope boundary is crossed, and real-device claims are
backed by recorded evidence. Do not silently weaken validation gates to finish
a task.
