# Gated roadmap

**Last reviewed:** 2026-10-22
**Active phase:** Phase 2 — cross-platform capture

The phases are gates, not calendar promises. Later rows do not authorize work
ahead of the active phase.

| Phase | Objective | Entry gate | Exit gate | Status |
| --- | --- | --- | --- | --- |
| 0 | Align product, architecture, privacy boundaries, and roadmap | Clean repository | Canonical documents agree; superseding ADRs accepted; environment gaps recorded | Complete — 2026-10-22 |
| 1 | Deterministic universal foundation | Phase 0 complete | Same tested spelling flow works on web, iOS, and Android without microphone or recognition | Complete — 2026-10-22 |
| 2 | Cross-platform capture | Phase 1 complete and native tools verified | Permission, lifecycle, interruption, cleanup, and audio-health evidence pass on all platforms | Active — 2026-10-22 |
| 3 | Speech-engine baseline | Phase 2 complete | Vosk and custom-classifier baselines compared on speaker-disjoint adult data and required negatives | Not started |
| 4 | Data and model readiness | Phase 3 evidence | Training pipeline is reproducible; child-data/privacy gate is accepted before any child collection | Not started |
| 5 | Representative recognition | Phase 4 complete | Frozen candidate passes cohort, rejection, latency, device, and noise gates or product direction is reconsidered | Not started |
| 6 | Recovery UX validation | Phase 5 candidate | Representative users complete words and recover from ambiguity within documented gates | Not started |
| 7 | Minimal playable product | Phase 6 complete | Small local game and guest-first onboarding are accessible and usable end-to-end on supported platforms | Not started |
| 8 | Production architecture | Demonstrated product need | Backend, identity, persistence, hosting, observability, and release ADRs accepted | Not started |

## Product sequencing beyond the active roadmap

The long-term product vision includes individual improvement, serious
competitive practice, local party play, and online multiplayer. They share the
same voice-first spelling engine, but they are not built in parallel.

1. Prove individual voice-first spelling and recovery through Phases 1–7.
2. Test pass-and-play on one shared phone as the first local party format after
   the minimal playable product works. Add another device or connectivity model
   only when evidence justifies it and an ADR accepts it.
3. Activate production architecture only when validated usage requires it.
4. Treat online multiplayer as a separately gated expansion. Before code, it
   needs requirements and ADRs for accounts, real-time synchronization,
   matchmaking, moderation, minor safety, ranking integrity, abuse prevention,
   privacy, and operating cost.

No social-play work is authorized by this section during the active phase.

Phase 7 should validate whether a guest can complete a short individual game,
understand a provisional result, and see enough value to choose to save progress.
It does not authorize authentication: the save-progress prompt may be tested as
a prototype until Phase 8 accepts the required identity and privacy decisions.

## Phase 0 deliverables

- Rewrite canonical documents for web, iOS, and Android.
- Accept an ADR superseding the native-iOS-only validation client.
- Accept a provider-neutral speech-evaluation ADR.
- Preserve isolated-letter and local-only decisions.
- Record the verified local web, iOS, and Android toolchain state.
- Define the repository layout without scaffolding empty architecture.
- Keep legacy repositories read-only and disconnected.

### Phase 0 exit checklist

- [x] Product definition targets web, iOS, and Android.
- [x] Architecture defines universal shared code and platform adapters.
- [x] Voice protocol includes accents, children, noise, and negative speech.
- [x] Child-data collection is gated by privacy/consent approval.
- [x] Roadmap has measurable entry and exit gates.
- [x] Obsolete ADR is superseded rather than silently rewritten.
- [x] Environment blockers are documented.
- [x] Product owner reviews and accepts the updated direction.

## Phase 1 scope

- Scaffold the Expo/React Native application with strict TypeScript.
- Pin Node, package-manager, Expo, React Native, and test-tool versions.
- Add pnpm workspace boundaries.
- Implement framework-independent letter and word types.
- Implement the spelling-session state machine.
- Add a deterministic fake recognizer.
- Build accessible accept, retry, correction, deletion, and submit flows.
- Add schema-validated local word fixtures.
- Run unit/component tests and CI.
- Build and smoke-test web, iOS, and Android.

### Phase 1 exclusions

- Microphone permissions or capture.
- Vosk, Rhino, Apple, Google, or model-runtime dependencies.
- Private audio or participant data.
- Backend, database, accounts, synchronization, or telemetry.
- Training or child-data collection.

## Phase 2 scope

- Implement the provider-neutral audio-capture contract and deterministic fake.
- Implement sanitized PCM health metrics.
- Add the Expo Audio adapter accepted by ADR-009.
- Add a separate, accessible microphone health-check screen.
- Prove permission, foreground lifecycle, interruption, cancellation, retry,
  and cleanup behavior on web, iOS, and Android.
- Record physical-device and real-browser evidence using the matrix in
  `PHASE-2-CAPTURE.md`.

### Phase 2 exclusions

- Recognition engines or letter-accuracy claims.
- Raw-audio persistence, replay, export, upload, or telemetry.
- Background recording.
- Child voice collection or model training.
- Backend, database, accounts, ranking, or multiplayer.

## Later-phase safeguards

- Phase 2 uses the capture API accepted by ADR-009 after toolchain verification.
- Phase 3 may time-box candidate dependencies; it does not choose production by
  preference.
- Phase 4 cannot collect child voices until an accepted privacy/consent ADR.
- Phase 5 freezes a held-out test set before final model selection.
- Local party play must reuse the validated spelling engine and may not create
  a second recognition path without evidence and an ADR.
- Online competition requires accepted safety, identity, synchronization, and
  competitive-integrity requirements before implementation.
- Phase 8 remains optional; a successful local product does not automatically
  require a backend.

## Phase transition procedure

1. Record commands, tests, devices, platforms, and evidence.
2. Preserve failures and resolve document contradictions.
3. Update the completed phase row and date.
4. Accept required ADRs for the next phase.
5. Activate only the next phase in a separate reviewable change.
