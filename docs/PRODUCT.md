# Product definition

**Version:** 0.6
**Last reviewed:** 2026-10-22
**Status:** Accepted for validation phases

## Product statement

Playlexi is a voice-first, cross-platform spelling product in which a player
hears a word and spells it aloud. The product must make voice input accurate
enough to be useful, transparent when uncertain, and easy to correct without
restarting. Typing and touch remain available as a fallback when voice is
unavailable, inaccessible, or repeatedly uncertain.

The same core spelling engine is intended to support three product experiences
over time:

1. guided individual practice for children and teenagers who want to improve;
2. focused competitive practice for high-school-aged players and adults; and
3. social play with friends or family, first locally and eventually online.

These are product horizons, not simultaneous launch commitments. The first
release must prove the individual voice-first experience before social or
online systems are activated.

Web, iOS, and Android are supported product surfaces. Cross-platform support
does not imply identical audio implementations or recognition quality; each
platform must pass its own validation gate.

## Intended users

Playlexi's primary brand addresses a general audience rather than very young
children. Its first audience is motivated spellers who want to improve,
especially people preparing for spelling-bee competition or looking for a
meaningful spelling challenge.

The intended audiences are:

- school-aged learners and teenagers who actively want to improve or prepare
  for spelling-bee season;
- older players who want challenging or competitive spelling practice; and
- friends and families who may later use Playlexi as a local or online party
  game.

The main Playlexi brand is not an early-childhood product. A separate, more
childlike Playlexi experience may be considered later, but it is not current
scope. The exact minimum age remains unresolved. Any experience involving
minors is subject to a formal child-data privacy and safety decision. Parents,
guardians, educators, and consenting adult testers may also use the product.

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

For improvement-oriented play, the experience should make progress and errors
understandable. For competitive play, it should feel fair and challenging.
Those supporting jobs must not weaken the primary requirement: reliably
capturing a player spelling one letter at a time.

During active play, a misspelling receives a short, recognizable failure sound
with an equivalent brief visual state, and the game moves on without a long
interruption. Optional haptics may reinforce the result on supported devices.
Whether and how missed words are reviewed after a round remains a separate
learning-design decision.

## Product horizons

### Horizon 1 — individual voice-first play

Validate the shared spelling engine through a small, single-player experience.
Voice is the primary input. Typing and touch provide recovery and an accessible
fallback, not a separate product direction. The long-term solo experience may
offer multiple practice and challenge modes, but the initial mode remains small.

### Horizon 2 — local social play

Explore a pass-and-play party game on one shared device after the core voice and
recovery experience is demonstrably usable. Other local-device models remain
possible later, but they are not required for the first local concept. The
initial competition rule is one miss eliminates the active player.

### Horizon 3 — online competitive play

Explore a remote spelling-bee competition after the individual and local
experiences establish real demand. It should translate the understandable
roles, turns, information requests, tension, judgment, advancement, and results
of an oral spelling bee rather than behaving like a generic quiz with spelling
added. Online play introduces identity, matchmaking, synchronization,
moderation, minor safety, abuse prevention, ranking integrity, and operating
costs. Each requires explicit product requirements and architecture decisions
before implementation. Waiting players may receive optional unranked practice
while a lobby or match is preparing, provided it does not delay entry or affect
the live result.

## Onboarding hypothesis to validate

The initial playable product should test a value-before-account onboarding
sequence:

1. Let a new player begin as a guest without creating an account.
2. Explain and verify the voice interaction before scoring begins.
3. Run a short individual spelling game using calibrated difficulty.
4. Show useful feedback and a clearly labeled provisional starting level.
5. Offer account creation as the way to save the result, continue progress, and
   use another device.
6. Allow the player to decline without falsely claiming that an account was
   required to try the product.

The first result must not be presented as a global rank or percentile until the
scoring model, comparison population, recognition quality, and minimum evidence
are defined and validated. Account creation for minors also requires the
applicable age, consent, privacy, and safety flow before implementation.

This is a product hypothesis, not authorization to add authentication during
the current phase. It should be tested during the minimal playable-product phase
before backend architecture is selected.

## Lexical content and narration

Playlexi may use dictionary definitions, example sentences, parts of speech,
origins, pronunciations, and alternate pronunciations only when their source and
product-use rights are documented. Facts about a word do not grant permission to
copy a publisher's wording, recordings, examples, or database.

The product may evaluate a licensed dictionary provider, properly attributed
open data, or Playlexi-owned editorial content. No provider is selected. Before
production use, the accepted terms must cover the intended commercial model,
display, narration, caching or offline delivery, permitted modification and
redaction, attribution, volume, termination, and transfer or change of control.

Narration is audio-first during an active spelling turn:

- the target word, pronunciation, and alternate pronunciations are not shown as
  ordinary spelling text before the answer is committed;
- a definition, part of speech, or origin may be displayed only after an
  automated and editorial check confirms that it does not expose the answer;
- an example sentence shown during the turn replaces the target word and unsafe
  variants with a clear blank;
- the interface identifies what is playing, such as "Definition playing" or
  "Sentence playing," without displaying a spoiling transcript; and
- complete educational content may be revealed after the spelling is committed.

Synthetic narration is a candidate, not automatically an authoritative
pronouncer. Rare-word and alternate pronunciations require source provenance,
phonetic control where supported, and human review before competitive use.
Live generative text is not used for definitions or example sentences during a
game.

Headphones may be recommended for personal play but are not required. Speakers,
wired audio, Bluetooth routes, and device microphones require separate capture
and playback validation. Hearing-access accommodations must preserve equivalent
information where possible; an accommodation that exposes the answer may need a
separate, clearly labeled scoring category rather than silently changing a
ranked result.

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

## Future vision that is out of the current validation scope

- Accounts, profiles, authentication, and cloud synchronization.
- Server APIs, remote databases, and administrative systems.
- Local multiplayer, online multiplayer, matchmaking, rankings, XP, streak
  economies, or leaderboards.
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
- Which solo modes follow the initial individual practice game, and in what
  order?
- Which formal spelling-bee conventions should each competitive mode preserve,
  simplify, or deliberately change?
- What result language motivates players without overstating certainty:
  starting level, provisional rating, skill band, or another label?
- What round, elimination, scoring, and tie-break rules make one-phone party
  play fair and enjoyable?
- Which browser/device versions define initial support?
- What identity, moderation, minor-safety, fairness, and anti-cheat requirements
  would online competition need?
- What launch cohorts and languages follow English?

These questions are resolved before they affect collection, architecture, or
launch claims; they are not silently assumed.
