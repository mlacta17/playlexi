# Voice validation protocol

**Version:** 0.2
**Last reviewed:** 2026-10-21
**Status:** Accepted protocol; numeric production gates remain provisional

## 1. Questions

Playlexi must answer these separately:

1. Can each platform capture short letter utterances reliably?
2. Can a candidate engine classify isolated English letter names accurately
   across intended speakers and environments?
3. Can it reject whole words, multiple letters, unrelated speech, silence, and
   noise instead of forcing them into A–Z?
4. Can users recover from ambiguity without restarting the word?
5. Are latency, model size, startup, memory, battery, and browser delivery
   practical on target devices?

Changing engines without separating capture, segmentation, classification,
rejection, and recovery does not answer these questions.

## 2. Non-goals

- Selecting a permanent engine before comparative evidence.
- Training a full general-purpose dictation model.
- Claiming universal accent, age, device, or noise fairness.
- Competitive-grade anti-cheat.
- Passing the target word or expected letter into recognition.
- Collecting child audio before privacy and consent approval.
- Treating synthetic or adult-shifted audio as a replacement for real child
  speech.

## 3. Evaluation stages

### Stage A — deterministic experience

Use a fake recognizer to validate state transitions, correction, accessibility,
diagnostics, and consistent behavior on web, iOS, and Android.

### Stage B — capture health

Capture audio without recognition. Record sample rate, channel count, duration,
clipping, RMS/peak ranges, lifecycle outcomes, and sanitized timing. Test
permissions, interruption, backgrounding, route changes, browser suspension,
and cleanup.

### Stage C — adult baseline

Benchmark at least:

- Vosk with a letters-only grammar and an unknown path; and
- a custom short-audio classification prototype using transfer learning.

Use consenting adults across the initial self-described language/accent cohorts.
Do not fine-tune until the untouched baseline is preserved.

### Stage D — child-data readiness

Before collecting child voices:

1. define the intended age range and countries;
2. obtain product/privacy review appropriate to those jurisdictions;
3. accept a child-data and parental-consent ADR;
4. approve participant information, consent, withdrawal, deletion, access,
   retention, storage, and derived-model policies; and
5. verify that recordings and participant records cannot enter Git or routine
   diagnostics.

### Stage E — representative training and evaluation

Collect approved, representative data; train candidates; freeze a model; and
evaluate once against speaker-disjoint test data. Failed models and cohort gaps
remain in the evidence log.

## 4. Data design

### Participants

The adult baseline begins with at least eight consenting adults and includes US
English, Filipino English, and Tagalog-English bilingual speakers where relevant.
This small cohort detects obvious failure; it is not production evidence.

A custom-classifier feasibility dataset should target roughly 30–50 speakers,
at least ten repetitions per letter, multiple sessions, and a comparable volume
of negative examples. These are planning estimates, not sufficiency claims.
Production sample size is set after baseline variance and the intended child age
range are known.

Participants self-describe relevant language context. Playlexi does not infer
accent, ethnicity, nationality, age, or identity from audio.

### Positive prompts

- all 26 letter names;
- at least three repetitions per letter in the first baseline;
- randomized order;
- separate sessions where practical;
- deliberate coverage of B/D/E/G/P/T/V/Z, M/N, and F/S; and
- documented valid variants such as “zee” and “zed” where product policy accepts
  both.

### Required negatives

- the complete target word spoken normally;
- multiple letter names in one capture;
- unrelated words and sentences;
- speech from another person or media;
- coughs, breaths, taps, music, and non-speech sounds;
- silence and low-energy input;
- clipped or overlong speech; and
- confusing real words such as “bee,” “tea,” and “why.”

Negative inputs are first-class ground truth, not discarded failures.

### Conditions

- quiet indoor;
- ordinary indoor background noise;
- competing speech or television;
- fan/air-conditioner hum;
- traffic or outdoor noise;
- several documented phone-to-mouth distances;
- representative device microphones; and
- exact browser, OS, device, input route, and application build.

Do not aggregate conditions without retaining the condition dimension.

## 5. Ground truth and partitioning

The application generates the prompted class before capture. Ground truth comes
from that prompt or an independently verified negative-input script, never from
the recognizer.

Dataset partitions are speaker-disjoint:

- one participant appears in exactly one of train, validation, or test;
- keep household members in one partition where practical;
- keep a recording device in one partition where practical or explicitly report
  cross-device leakage risk; and
- never move failed test clips into training and rerun the same “test.”

Participant-invalidated stumbles or interruptions remain counted separately and
cannot be removed after viewing recognition output.

## 6. Training policy

Training begins only after an unmodified baseline is recorded.

- Prefer transfer learning from a suitable pretrained acoustic/audio encoder to
  training general-purpose ASR from scratch.
- Include A–Z plus explicit non-letter, multiple-letter, background-speech, and
  silence/noise outcomes.
- Add real noise and controlled augmentation such as noise mixing, reverberation,
  gain, mild speed/pitch changes, clipping, and time/frequency masking.
- Preserve an unaugmented, real-world test set.
- Do not use test speakers or test conditions for threshold tuning.
- Version training code, manifests, model artifacts, features, label policy,
  augmentation policy, and random seeds.
- A user correction becomes training data only with appropriate consent and an
  explicit verified label.

Fine-tuning Vosk's acoustic model is not the default path. Vosk documents Kaldi
fine-tuning as possible but difficult and incompletely documented. It is
considered only if the baseline and the simpler classifier track justify it:
<https://github.com/alphacep/vosk-space/blob/master/adaptation.md>.

## 7. Metrics

### Capture

- permission denial and capture-start failure;
- interruption, cancellation, and cleanup failure;
- zero-length, clipped, or overlong capture;
- sample rate, channel count, duration, and peak/RMS;
- crashes, hangs, memory, and battery observations.

### Classification

- top-1 accuracy and macro F1;
- top-3 coverage where ranked candidates exist;
- per-letter precision, recall, and confusion matrix;
- exact spelling-sequence completion after correction;
- insertion, deletion, and substitution rates;
- ambiguity and no-result rates;
- confidence calibration where scores exist.

### Rejection

- whole-word false-acceptance rate;
- multiple-letter false-acceptance rate;
- unrelated-speech false-acceptance rate;
- silence/noise false-acceptance rate; and
- legitimate-letter false-rejection rate.

### Experience and operations

- capture-stop-to-result latency: median, p95, maximum;
- cold and warm model initialization;
- model download and installed size;
- corrections and retries per completed word;
- completion time and abandonment;
- participant understanding of retry/correction; and
- results by letter, participant, cohort, age band, platform, device, OS/browser,
  input route, and condition.

Never report only an overall average.

## 8. Provisional gates

The first baseline validates or replaces these gates:

- no cohort top-1 accuracy more than three percentage points below overall;
- top-3 coverage at least 99% where ranked candidates exist;
- p95 result latency below 800 ms after capture stops;
- at least 90% exact completion for representative 5–8-letter sequences after
  normal in-flow correction;
- whole-word and unrelated-speech false acceptance explicitly measured and low
  enough to avoid a misleading interaction;
- zero hangs, crashes, leaked audio files, or unrecoverable capture states; and
- at least 90% of participants understand correction after one demonstration.

No arbitrary top-1 or false-acceptance production threshold is declared before
the baseline distribution exists. A gate revision preserves the prior result,
date, rationale, and cohort impact.

## 9. Result record

Every run records:

- run date and randomized ID;
- application commit and build configuration;
- platform, device, OS/browser, input route, and locale;
- engine, model, adapter, grammar, and threshold versions;
- anonymized participant ID, cohort labels, and consent version;
- prompt/negative category and ground truth;
- ranked candidates and provider evidence if supplied;
- correction, retry, or rejection outcome;
- timing and capture-health measurements; and
- invalidation reason.

Missing confidence or alternatives are absent, never fabricated.

## 10. Privacy

- Ordinary sessions do not retain raw audio.
- Benchmark retention requires separate, explicit consent.
- Private audio and participant records remain outside Git.
- Consent states purpose, storage, access, retention, deletion, model-training
  use, and withdrawal procedure.
- Revoked samples are removed from future training/evaluation, with affected
  model lineage reviewed.
- Aggregate reporting must not make a participant identifiable.

## 11. Evidence log

No new-repository engine, real-device, real-browser, child-speech, or noisy-room
benchmark has been completed. Legacy claims are not imported because their
datasets, cohorts, negative tests, and reproducibility are insufficient.
