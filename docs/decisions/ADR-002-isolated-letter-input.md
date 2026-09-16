# ADR-002: Validate isolated letters before continuous spelling

- **Status:** Accepted
- **Date:** 2026-09-16
- **Deciders:** Product owner and engineering

## Context

General transcription models may normalize sequences of spoken letter names into
whole words. Several English letters are acoustically confusable, and the legacy
implementation cannot distinguish a normalized spelling transcript from a spoken
word. Whole-sequence failure also gives the user poor recovery options.

## Decision

Phase 0 captures and recognizes one letter per attempt. The interface presents
ranked candidates where available and makes acceptance, retry, deletion, and
manual correction explicit. Continuous spelling is a later experiment.

The recognizer may receive locale and capture metadata but not the correct letter
or target spelling. The spelling session may use expected word length.

## Consequences

- Ground truth and failure location are clear.
- Confusion matrices and per-user corrections are measurable.
- Interaction may be slower than continuous spelling and must be measured.
- The architecture must not assume providers expose confidence or alternatives.

## Alternatives considered

- **Continuous transcription with phrase boosting:** deferred because it can
  normalize spelled sequences and can bias results toward expected answers.
- **Hardcoded phonetic mappings:** rejected as the primary solution because they
  post-process text rather than fix capture or acoustic ambiguity.
- **Automatic per-user learning from wrong answers:** rejected until explicit
  corrections provide trustworthy supervised labels.
