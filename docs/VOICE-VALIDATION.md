# Voice validation protocol

**Version:** 0.1
**Last reviewed:** 2026-09-16
**Status:** Accepted protocol; numeric release gates provisional until baseline

## 1. Question

Can Playlexi recognize isolated English letter names on a real iPhone accurately
and quickly enough that representative users can complete spelling attempts with
cheap, understandable recovery from ambiguity?

This protocol distinguishes four failure sources:

1. microphone/audio capture;
2. speech segmentation;
3. recognition/classification;
4. interaction design and recovery.

Changing providers without separating these sources does not answer the question.

## 2. Non-goals

- Selecting a permanent production provider before evidence exists.
- Demonstrating competitive anti-cheat.
- Training a custom acoustic model.
- Claiming universal accent fairness.
- Measuring only the repository owner's voice.
- Using the target spelling as recognition context.

## 3. Test matrix

### Speakers

Baseline target: at least eight consenting adults, with at least four speakers
from each initially identified cohort:

- US English speakers;
- Filipino English speakers.

Record self-described language/accent context only when the participant consents.
Do not infer ethnicity, nationality, or accent from audio. Expand the cohort
before launch based on the actual intended audience.

### Utterances

Each participant records:

- all 26 isolated letter names, three repetitions each;
- a balanced set of short spelling sequences, without providing the recognizer
  the target sequence;
- designated confusable-letter sets such as B/D/E/G/P/T/V/Z and M/N;
- one retry set after the participant sees an ambiguous result.

The baseline therefore contains at least 624 isolated-letter attempts
(8 speakers × 26 letters × 3 repetitions), plus sequence attempts.

### Conditions

- quiet room;
- ordinary indoor background noise;
- phone held at a documented comfortable distance;
- supported target iPhone models and exact iOS versions;
- built-in microphone first; Bluetooth and wired inputs are later matrices.

Do not mix conditions in a metric without retaining the condition dimension.

## 4. Ground truth

The application generates a randomized prompt identifying which letter the
participant should say. Ground truth comes from that prompt, not from a transcript
or inferred spelling. The recognizer receives audio and locale, never the prompt.

Participants may mark a capture invalid immediately for a stumble, interruption,
or failure to follow the prompt. Invalid captures are reported separately and
cannot be silently removed after seeing recognition output.

## 5. Metrics

### Capture health

- permission-denial rate;
- capture-start failure rate;
- interruption rate;
- zero-length and clipped-buffer rate;
- measured sample rate, channel count, duration, and peak/RMS ranges;
- application hangs or crashes.

### Recognition quality

- top-1 letter accuracy;
- top-3 candidate coverage, when candidates exist;
- no-result rate;
- per-letter precision/recall;
- confusion matrix;
- exact sequence accuracy;
- insertion, deletion, and substitution rates;
- results by speaker, cohort, device, OS, and condition.

### Experience quality

- capture-stop to result latency (median, p95, maximum);
- corrections and retries per completed word;
- time to complete a word;
- abandonment rate;
- participant-reported clarity of uncertainty and recovery.

Never report only the overall average. A high aggregate result can hide a cohort
or letter that fails consistently.

## 6. Provisional gates

The baseline run validates or replaces these gates before product expansion:

- no cohort top-1 accuracy more than 3 percentage points below overall accuracy;
- top-3 coverage at least 99% when ranked candidates are available;
- no-result rate below 1%;
- p95 result latency below 800 ms after capture stops;
- at least 90% exact completion for representative 5–8-letter sequences after
  normal in-flow correction;
- zero hangs, crashes, leaked audio files, or unrecoverable audio-session states;
- at least 90% of participants can explain how to retry or correct a letter
  without instruction after the first demonstrated attempt.

Top-1 accuracy has no arbitrary release number yet. An isolated-letter baseline
must be measured first because sequence reliability compounds letter errors. For
reference, 95% independent per-letter accuracy yields only about 66% exact
accuracy for an eight-letter sequence; 99% yields about 92%.

Any gate revision must preserve the original result, date, rationale, and cohort
impact in this document.

## 7. Experiment order

1. Validate deterministic UI and correction flow with a mock recognizer.
2. Validate audio capture without recognition.
3. Run Apple recognition on isolated letters without custom context.
4. Evaluate supported Apple contextual/custom-language features without passing
   the answer itself.
5. Compare additional providers only if Apple fails a documented gate.
6. Evaluate continuous spelling only after isolated-letter completion succeeds.

This order ensures that provider cost and network behavior are introduced only
when the native baseline shows why they are necessary.

## 8. Result record

Every run records:

- run ID and date;
- app commit and build configuration;
- device model and OS version;
- recognizer implementation and configuration version;
- locale;
- anonymized participant ID and consent version;
- condition and input route;
- prompted letter/sequence;
- ranked candidates and confidence if supplied;
- selected correction/retry outcome;
- timing and capture-health measurements;
- invalidation reason, if any.

The export schema is versioned. Missing provider confidence is represented as
absent, never fabricated as zero or a constant.

## 9. Privacy

- Ordinary sessions do not retain audio.
- Benchmark audio retention is opt-in and separate from app use.
- Consent states purpose, storage location, access, retention period, and deletion
  process before recording.
- Private audio lives outside Git and outside ordinary diagnostic exports.
- Revoked samples are removed from future analysis and documented by run ID.
- Derived aggregate statistics must not make a speaker identifiable.

## 10. Evidence log

No Playlexi Phase 0 device run has been recorded yet. Legacy claims of Chrome,
Safari, Google, or Wispr accuracy are not imported because their datasets,
cohorts, and reproducible raw evidence are incomplete.
