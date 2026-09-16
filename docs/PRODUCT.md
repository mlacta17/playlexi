# Product definition

**Version:** 0.1
**Last reviewed:** 2026-09-16
**Status:** Accepted for Phase 0

## Product statement

Playlexi is a mobile-first spelling experience in which a player hears a word
and spells it aloud. The immediate product is not a competitive platform. It is
a validation experience designed to determine whether voice spelling can be
accurate, fair, understandable, and recoverable on an iPhone.

## Current user

The Phase 0 test user is an English speaker using a supported iPhone. The
validation cohort must include representative US and Filipino English speakers.
This cohort is an experiment requirement, not a claim that two accent labels
fully describe how people speak.

Age range, accessibility needs, launch countries, commercial model, and account
requirements remain open questions. No child-directed-product claim is made.

## Current job to be done

> After hearing a word, I can say its letters and understand immediately what
> the application heard, correct ambiguity without losing the entire attempt,
> and finish the spelling without fighting the microphone.

## Phase 0 experience

1. The application presents one locally bundled word and plays its pronunciation.
2. The player starts a letter capture through an explicit control.
3. The player says one letter name.
4. The application shows the recognized letter or a recoverable uncertainty state.
5. The player accepts, retries, or selects a correction.
6. Steps 2–5 repeat until the expected number of letters is reached.
7. The application compares the assembled letters with the spelling locally.
8. The session records sanitized quality metrics that the player can inspect and
   explicitly export.

The interface must always offer a non-voice correction path. Recognition is a
fallible input method, not the authority on what a person said.

## Functional scope

Phase 0 includes:

- A small, reviewed, bundled English word fixture.
- Deterministic mock recognition for UI and state-machine development.
- One-letter-at-a-time native audio capture.
- A replaceable letter-recognition interface.
- Visible letter candidates, retry, correction, deletion, and submission.
- Local session diagnostics and explicit export.
- VoiceOver labels, Dynamic Type, adequate targets, and non-color-only states.
- Real-device benchmark tooling and documented results.

## Explicitly out of scope

- Accounts, profiles, authentication, and cloud synchronization.
- Server APIs, remote databases, and administrative tools.
- Multiplayer, matchmaking, rankings, XP, streak economies, or leaderboards.
- Friends, chat, notifications, sharing, or monetization.
- Placement tests and adaptive word difficulty.
- Anti-cheat suitable for competition.
- Continuous multi-letter recognition as the default interaction.
- Android, web, iPad-specific, and desktop products.
- Production analytics, crash-reporting, or experimentation SDKs.
- Long-term storage of raw audio.

Out-of-scope work requires a roadmap phase change and, where architectural, an
accepted ADR. It is not built early “for scalability.”

## Product success gate

Phase 0 succeeds only when the voice-validation protocol passes and test users
can recover from ambiguous recognition without restarting a word. Exact numeric
thresholds are provisional until the baseline run described in
`VOICE-VALIDATION.md`; changing a threshold after the baseline requires a
documented rationale and must not hide cohort-specific failures.

## Known product risks

| Risk | Current response |
| --- | --- |
| Letter names are acoustically confusable | Isolate letters; show alternatives; make correction cheap |
| Accuracy differs across speakers | Use representative cohorts and report cohort metrics |
| A correct transcript can still hide a bad interaction | Measure corrections, retries, latency, and abandonment |
| Native recognition may normalize letters into words | Evaluate candidate output; do not trust one transcript blindly |
| Per-letter capture may feel slow | Measure it before considering continuous mode |
| Audio is sensitive data | Process ephemerally; require consent for retention |

## Open product questions

- Which ages are intended at launch?
- Is voice spelling the product itself or one input option beside typing?
- Is the eventual product iOS-only, cross-platform, or web-accessible?
- What constitutes a representative launch cohort beyond US and Filipino
  English speakers?
- Is competitive integrity ever required, or is Playlexi primarily practice?

These questions do not block Phase 0 unless they alter the validation cohort or
accessibility requirements.
