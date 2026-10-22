# Product definition

**Version:** 0.2
**Last reviewed:** 2026-10-21
**Status:** Accepted for validation phases

## Product statement

Playlexi is a cross-platform spelling experience in which a player hears a word
and spells it aloud. The product must make voice input accurate enough to be
useful, transparent when uncertain, and easy to correct without restarting.

Web, iOS, and Android are supported product surfaces. Cross-platform support
does not imply identical audio implementations or recognition quality; each
platform must pass its own validation gate.

## Intended users

Children are an intended audience, subject to an unresolved age range and a
formal child-data privacy decision. Parents, guardians, educators, and adult
testers may also use the product.

The initial speech cohorts include:

- US English speakers;
- Filipino English speakers;
- Tagalog-English bilingual speakers where relevant to intended use; and
- additional self-described language/accent groups identified before launch.

These are analysis dimensions, not claims that every member speaks alike.
Playlexi does not classify or infer a person's accent, ethnicity, or nationality.

Until the child-data privacy gate passes, speech experiments use consenting
adults or appropriately licensed datasets only.

## Job to be done

> After hearing a word, I can spell it aloud one letter at a time, see what the
> application heard, recover quickly from uncertainty, and complete the word
> without fighting the microphone.

## Validation experience

1. The application presents a locally bundled word and plays or displays its
   pronunciation prompt.
2. The player deliberately begins one letter capture.
3. The player says one letter name.
4. The application displays ranked candidates or a clear uncertainty state.
5. The player accepts, retries, or manually corrects the letter.
6. Steps 2–5 repeat until the expected number of letters is reached.
7. The application compares the assembled sequence with the spelling locally.
8. Sanitized diagnostics remain local unless explicitly exported.

The interface always provides a non-voice correction path. Recognition is an
input method, not the authority on what a person said.

## Validation scope

- A deterministic spelling-session state machine.
- A universal web/iOS/Android interface.
- Accessible retry, correction, deletion, and submission.
- Replaceable audio-capture and letter-recognition contracts.
- Platform-specific capture implementations.
- A small, reviewed, bundled word fixture.
- Local, inspectable diagnostics and explicit export.
- Engine benchmarks that include Vosk and a custom on-device classifier track.
- Adult accent/cohort evaluation before approved child-data collection.
- Real-device and real-browser evaluation under quiet and noisy conditions.

## Explicitly out of scope until activated

- Accounts, profiles, authentication, and cloud synchronization.
- Server APIs, remote databases, and administrative systems.
- Multiplayer, matchmaking, rankings, XP, streak economies, or leaderboards.
- Friends, chat, notifications, sharing, advertising, or monetization.
- Competitive-grade anti-cheat claims.
- Continuous multi-letter recognition as the default interaction.
- Automatic acceptance based on the expected answer.
- Production analytics, crash reporting, or experimentation SDKs.
- Long-term raw-audio storage.
- Collection or training on child voice recordings before the privacy gate.
- Automatic model retraining from unverified recognition results.

## Product success

Validation succeeds only when:

- the deterministic experience works consistently on web, iOS, and Android;
- each target platform passes capture-lifecycle tests;
- representative cohorts meet documented recognition and recovery gates;
- whole words and unrelated speech have an acceptably low false-acceptance rate;
- users can correct ambiguity without restarting a word; and
- privacy and accessibility requirements are satisfied.

Exact recognition thresholds remain provisional until the first reproducible
baseline. Threshold changes must retain prior results and explain cohort impact.

## Known risks

| Risk | Current response |
| --- | --- |
| Children differ acoustically from adults | Require child-specific evidence after consent approval |
| Letters are acoustically confusable | Isolated capture, ranked candidates, cheap correction |
| Accent performance varies | Representative data and cohort-specific reporting |
| Noise and microphones distort short sounds | Device/condition matrices and real plus augmented noise |
| Closed grammars force incorrect matches | Explicit unknown/reject outcomes and negative tests |
| Shared UI hides platform audio differences | Platform adapters and separate platform gates |
| Answer-aware logic inflates accuracy | Never pass the expected answer into recognition |
| Audio contains sensitive biometric information | Local processing by default and gated retention |

## Open product questions

- What exact child age range is intended?
- Is Playlexi primarily independent practice, classroom use, family play, or a
  combination?
- Which browser/device versions define initial support?
- Is voice spelling mandatory or one input method beside typing?
- Is competitive integrity ever a real requirement?
- What launch cohorts and languages follow English?

These questions are resolved before they affect collection, architecture, or
launch claims; they are not silently assumed.
