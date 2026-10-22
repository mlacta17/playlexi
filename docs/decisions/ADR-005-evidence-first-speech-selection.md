# ADR-005: Evidence-first speech-engine selection

- **Status:** Accepted
- **Date:** 2026-10-21
- **Deciders:** Product owner and engineering
- **Supersedes:** None
- **Superseded by:** None

## Context

General dictation engines may normalize spelled letters into words. Closed
grammars constrain decoder output but do not prove that whole words or unrelated
speech reliably become an unknown token. Children, accents, noise, devices, and
platform capture behavior introduce acoustic differences that cannot be solved
by vocabulary bias alone.

The legacy implementations do not contain reproducible evidence sufficient to
select Apple, Google, Wispr, or another provider. Vosk is a credible offline
candidate, but its grammar behavior and cross-platform wrappers must be measured.
A dedicated A–Z audio classifier with rejection classes may fit the bounded
problem better than open-ended transcription.

Vosk's core API documents grammars, alternatives, and word timing, while its
adaptation documentation distinguishes vocabulary/language-model work from
acoustic-model fine-tuning:

- <https://github.com/alphacep/vosk-api/blob/master/src/vosk_api.h>
- <https://github.com/alphacep/vosk-space/blob/master/adaptation.md>

## Decision

Do not select a production speech engine yet. Define a provider-neutral
`LetterRecognizer` contract and compare at least:

1. Vosk with a letters-only grammar and explicit unknown/rejection tests; and
2. a transfer-learned on-device short-audio classifier with A–Z plus negative
   classes.

Recognition receives no target word or expected letter. One capture represents
one attempted letter. Whole words, multiple letters, unrelated speech, silence,
and noise are required benchmark inputs.

No candidate is promoted based on marketing, wrapper availability, aggregate
accuracy, or the owner's voice. Promotion requires the protocol and cohort gates
in `VOICE-VALIDATION.md`.

## Consequences

- Product and UI work can proceed with a deterministic fake.
- Engine replacement does not rewrite domain or feature code.
- The project carries benchmark and adapter work before selecting production.
- Vosk may require wrapper extensions or a first-party native module.
- A custom classifier introduces dataset, training, deployment, and model-lineage
  responsibilities.
- A remote provider is not forbidden, but privacy, cost, credentials, retention,
  abuse controls, and network behavior require a later ADR.

## Alternatives considered

- **Select Vosk immediately:** rejected because `[unk]` is not validated as a
  semantic cheat detector and wrapper capabilities differ by platform.
- **Use Apple/Google dictation with phrase bias:** rejected as a cross-platform
  commitment because bias does not constrain output and platform behavior differs.
- **Select Picovoice Rhino immediately:** rejected because its command-intent
  model, context workflow, credentials, licensing, and variable-length behavior
  require the same empirical validation.
- **Train Vosk/Kaldi immediately:** rejected because acoustic fine-tuning is
  operationally complex and no baseline shows it is necessary.
- **Train a model before capture validation:** rejected because bad capture and
  segmentation would contaminate both data and conclusions.

## Validation

Record immutable baselines before tuning. Use speaker-disjoint datasets, required
negative inputs, representative cohorts and noise, per-platform latency, and
false-acceptance metrics. Select or reject candidates in a later ADR containing
the benchmark result and model/runtime operational cost.
