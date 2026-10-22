# Glossary

**Last reviewed:** 2026-10-22

- **Adapter:** Platform- or engine-specific implementation of a shared contract.
- **Attempt:** One deliberate capture submitted for one letter decision.
- **Candidate:** A possible recognized letter with optional engine evidence.
- **Capture:** Permission, lifecycle, and audio produced between a deliberate
  start and stop.
- **Classifier:** A model that selects among bounded outcomes such as A–Z and
  rejection classes rather than producing open-ended dictation.
- **Cohort:** A consented, self-described analysis grouping. It does not imply
  that all members speak alike.
- **Correction:** A player-selected replacement for a recognition candidate.
- **Diagnostic:** Sanitized technical metadata; it excludes raw audio, raw
  transcripts, and stable personal identifiers by default.
- **Engine:** A recognition implementation or model runtime under evaluation.
- **Ground truth:** The prompted class or scripted negative category recorded
  before recognition.
- **Negative input:** Audio that should not become a letter, including whole
  words, multiple letters, unrelated speech, silence, and noise.
- **Provider:** An organization or service supplying an engine. An on-device
  open-source engine may have no remote provider.
- **Recognizer:** The provider-neutral component returning ranked letter
  candidates or a typed rejection from captured audio.
- **Recovery:** Retry, candidate selection, manual correction, deletion, or
  cancellation after uncertainty or failure.
- **Rejection:** A deliberate non-letter outcome rather than forcing audio into
  A–Z.
- **Session:** A sequence of validation prompts or spelling words in one run.
- **Speaker-disjoint:** No participant appears in more than one dataset
  partition.
- **Spelling sequence:** Ordered accepted letters forming a proposed spelling.
- **Top-1 accuracy:** Fraction of valid letter attempts whose first candidate
  equals ground truth.
- **Top-3 coverage:** Fraction whose ground-truth letter appears among the first
  three candidates.
- **Universal client:** Shared Expo application targeting web, iOS, and Android;
  it does not imply identical platform adapters.
- **Voice-first:** Voice is the primary intended interaction, while typing and
  touch remain available for accessibility, recovery, or unavailable audio.
