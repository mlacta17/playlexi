# Glossary

**Last reviewed:** 2026-09-16

- **Attempt:** One capture submitted for recognition, normally containing one
  isolated letter in Phase 0.
- **Candidate:** A possible recognized letter with optional provider evidence.
- **Capture:** The lifecycle and audio buffer produced between a deliberate start
  and stop.
- **Cohort:** A consented analysis grouping. It is reported without assuming that
  every member speaks alike.
- **Correction:** A player-selected replacement for a recognition candidate.
- **Diagnostic:** Sanitized technical metadata used to understand performance;
  it excludes raw audio and stable personal identifiers by default.
- **Ground truth:** The letter or sequence the experiment asked the participant
  to say, recorded before recognition.
- **Provider:** An implementation performing recognition, whether Apple on-device
  or a later remote service.
- **Recognizer:** The provider-neutral component that returns ranked letter
  candidates from captured audio.
- **Recovery:** Retry, candidate selection, correction, or cancellation after an
  uncertain or failed recognition result.
- **Session:** A sequence of words or validation prompts completed in one run.
- **Spelling sequence:** Ordered letters assembled into a proposed spelling.
- **Top-1 accuracy:** Fraction of valid attempts whose first candidate equals
  ground truth.
- **Top-3 coverage:** Fraction whose ground truth occurs among the first three
  candidates.
