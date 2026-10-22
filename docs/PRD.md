# Playlexi product requirements document

**Version:** 0.4
**Last reviewed:** 2026-10-22
**Status:** Working product brief; accepted requirements and unresolved decisions
are labeled explicitly

## 1. Purpose and authority

This document gives a product, design, or engineering agent enough context to
understand Playlexi without reconstructing the vision from conversation history.
It synthesizes the canonical documents; it does not replace them.

Before implementing anything, an agent must also read `AGENTS.md` and the
governing documents in this order:

1. accepted ADRs for a specific technical decision;
2. `ARCHITECTURE.md` for technical structure;
3. `PRODUCT.md` for product boundaries;
4. `VOICE-VALIDATION.md` for speech evidence and safety; and
5. `ROADMAP.md` for the currently authorized phase.

If this PRD conflicts with one of those sources, stop and resolve the conflict
before implementation. A future requirement in this document is not permission
to build ahead of the active roadmap phase.

## 2. Product summary

Playlexi is a voice-first spelling product for web, iOS, and Android. A player
hears a word, spells it aloud one letter at a time, sees what the application
heard, and can recover when recognition is uncertain. Typing and touch are
accessible fallback and correction paths.

The product begins with a small individual practice game. Over time, the same
spelling engine may support:

- multiple solo improvement and challenge modes;
- spelling-bee preparation for school-aged learners and other competitors;
- one-phone party play with friends and family; and
- online spelling-bee competition after demand and safety requirements are
  validated.

The core product risk is not ordinary application architecture. It is whether
short spoken letter names can be captured, recognized, rejected when invalid,
and corrected fairly across children, adults, accents, devices, and noisy
environments.

## 3. Product vision

Create the most approachable way to practice and compete at spelling aloud:
fast to try, fair when speech technology is uncertain, useful for improvement,
and enjoyable enough to play again.

### Product promise

A player should be able to demonstrate spelling knowledge without fighting the
microphone. The application should help the player understand what happened and
what to improve.

### Product principles

1. **Value before commitment.** Let a player experience the game before asking
   for an account.
2. **Voice first, never voice only.** Speaking is the defining interaction;
   touch and typing preserve accessibility and recovery.
3. **Recognition is not truth.** Show uncertainty and let the player correct it.
4. **Measure spelling, not accent or microphone quality.** Recognition failures
   must not masquerade as spelling failures.
5. **Fun without deception.** Scores, skill levels, and rankings must mean what
   their labels claim.
6. **One trusted engine, multiple experiences.** Practice, competition, and
   party play reuse the same validated spelling domain and recognition boundary.
7. **Safety before growth.** Child data, accounts, social play, and online
   competition require explicit privacy and safety decisions.

## 4. Intended audiences

### Primary audience

Motivated spellers who want to improve or challenge themselves, especially
people preparing for spelling-bee season. Playlexi uses a general-audience brand
rather than speaking primarily to parents or very young children.

### Intended future audiences

- School-aged learners and teenagers actively improving or preparing for a bee.
- Older players seeking difficult or competitive spelling practice.
- Families and friends playing together locally.
- Remote players competing online after the required safeguards exist.

Very young children are not the primary audience of the main Playlexi brand. A
separate, more childlike experience may be explored later, but it must not make
the primary product feel juvenile.

### Research and data boundary

The exact minimum age is unresolved. Until the child-data gate passes, speech
experiments use consenting adults or appropriately licensed datasets only.
Playlexi must not infer a person's accent, ethnicity, nationality, identity, or
age from their voice.

## 5. Initial experience hypothesis

The first playable-product onboarding should test this sequence:

1. The player opens Playlexi without an account.
2. Playlexi briefly explains how to spell one letter at a time.
3. An unscored microphone check confirms that capture and recovery are
   understandable.
4. The player completes a short individual spelling game.
5. Playlexi shows the completed spelling results, useful feedback, and a clearly
   labeled provisional starting level.
6. Playlexi offers account creation or sign-in to save progress and continue on
   another device.
7. The player may decline and continue directly into solo play or leave without
   being told that an account was required to try the product.

This sequence is a hypothesis to validate during the minimal playable-product
phase. It is not authorization to add authentication in the current phase.

### Solo play family

Solo play is the first product family and may eventually contain several modes:

- a short placement-style first game;
- focused practice that helps a player improve;
- spelling-bee preparation using authentic information requests and turn flow;
- personal-best or increasing-difficulty challenges; and
- other modes accepted after user research.

The initial implementation remains one small mode. Mode names, exact rules,
progression, and order are unresolved.

### One-phone party family

The first local multiplayer concept is pass-and-play on one shared phone. It
should reproduce the social tension and ceremony of taking turns in a spelling
bee without requiring every player to install the app or create an account.
Round structure, elimination, scoring, privacy between turns, tie-breaks, and
how the phone acts as pronouncer and judge remain product-design questions. The
first competition rule is one miss eliminates the active player.

### Online competition family

Online play should feel like participating in a spelling bee, not like answering
a generic multiple-choice quiz. It should translate the important roles and
moments of a bee—pronouncer, active speller, waiting players, information
requests, a committed answer, judgment, advancement, and final results—while
adapting them for fair remote play. Its format and infrastructure are future
scope. An online lobby may offer optional unranked solo practice while players
wait, provided practice never delays match entry or affects the live result.

## 6. Experience requirements

The requirement identifiers remain stable even when wording is refined.

| ID | Requirement | Priority | Delivery status |
| --- | --- | --- | --- |
| CORE-001 | One shared product must target web, iOS, and Android. | Must | Phase 1 complete |
| CORE-002 | The deterministic spelling session must behave consistently across platforms. | Must | Phase 1 complete |
| VOICE-001 | Voice must be the primary intended spelling input. | Must | Accepted; capture deferred |
| VOICE-002 | The default validated interaction must capture one deliberate letter attempt at a time. | Must | Accepted |
| VOICE-003 | Recognition must return uncertainty or rejection instead of forcing every input into A–Z. | Must | Accepted; engine unselected |
| VOICE-004 | Recognition must never receive the expected letter or target word. | Must | Accepted |
| RECOVERY-001 | A player must be able to retry, inspect candidates, correct, delete, or cancel. | Must | Phase 1 complete |
| RECOVERY-002 | Recognition uncertainty must not automatically count as a spelling error. | Must | Accepted |
| ACCESS-001 | The primary flow must support touch, keyboard, screen readers, text scaling, adequate targets, and non-color-only status. | Must | Accepted |
| ONBOARD-001 | A new player should be able to try the initial game as a guest. | Must for playable product | Hypothesis; Phase 7 |
| ONBOARD-002 | The microphone tutorial/check must be separate from scored play. | Must for playable product | Hypothesis; later validation |
| ONBOARD-003 | The first session should reach meaningful play quickly and avoid unnecessary questions. | Must for playable product | Hypothesis; duration TBD |
| RESULT-001 | The first result must explain performance and give a useful next step. | Must for playable product | Hypothesis; Phase 7 |
| RESULT-002 | The first result may show a provisional level but must not claim a global rank or percentile without adequate evidence. | Must | Accepted constraint |
| FEEDBACK-001 | A misspelling during active play must receive a brief recognizable failure sound plus an equivalent visual state, then advance without a long interruption; optional haptics may reinforce it. | Must for playable product | Accepted product behavior; sound unselected |
| INFO-001 | Bee-style play must make pronunciation replay, definition, sentence, origin, and part of speech available. | Must for bee modes | Accepted product behavior; interaction TBD |
| CONTENT-001 | Production lexical content must have documented source, license, attribution, revision, and commercial-use rights. | Must | Accepted constraint; provider unselected |
| CONTENT-002 | Definitions and example sentences must be curated and versioned before play rather than generated live. | Must | Accepted constraint |
| NARRATE-001 | Competitive target-word pronunciation must have provenance and human review; synthetic narration is a candidate, not assumed authority. | Must | Accepted constraint; provider unselected |
| DISPLAY-001 | Active-turn text must not expose the target spelling; sentence text must blank unsafe forms and other fields require spoiler review. | Must | Accepted product behavior |
| ACCOUNT-001 | The first account prompt should explain its value as saving and synchronizing progress. | Should | Hypothesis; implementation requires Phase 8 decisions |
| ACCOUNT-002 | Account creation and sign-in must not be implemented before identity, privacy, and minor-safety requirements are accepted. | Must | Accepted constraint |
| SOCIAL-001 | Local party play should use one-phone pass-and-play, reuse the validated core spelling engine, and initially eliminate a player after one miss. | Future | Accepted direction; not active |
| SOCIAL-002 | Online play requires explicit identity, synchronization, matchmaking, moderation, minor-safety, privacy, abuse-prevention, and competitive-integrity requirements. | Future | Not active |
| SOCIAL-003 | An online waiting room may offer unranked solo practice that cannot affect the match or delay entry. | Future | Accepted concept; not active |

## 7. Scoring and progression principles

The first game is a placement-style experience, not a certified assessment.

- Its output should be labeled a **provisional starting level**, **skill band**,
  or another tested term.
- A global rank, percentile, or leaderboard position requires a defined
  comparison population and validated scoring model.
- Recognition confidence is technical evidence and is never the player's score.
- Microphone quality, accent, noise, or an engine's uncertainty must not be
  treated as lack of spelling knowledge.
- The final scoring formula must document how word difficulty, correctness,
  retries, manual correction, hints, and time affect the result.
- Speed must not affect scoring until the product owner explicitly chooses a
  timed competitive experience and accessibility implications are reviewed.
- Progression should help the player choose what to practice next, not merely
  manufacture engagement.

Exact scoring, level names, difficulty calibration, and rank rules remain open
product decisions. An agent must not invent them in production code.

## 8. Initial content requirements

- Use a small, reviewed, locally bundled word fixture during validation.
- Every word entry must pass schema validation.
- Word selection must eventually support difficulty, spelling patterns, locale,
  pronunciation prompt provenance, and age appropriateness, but the schema is
  expanded only when an active requirement needs those fields.
- English is the initial language. Initial evaluation cohorts include US
  English, Filipino English, and relevant Tagalog-English bilingual speakers.
- Support for another language or dialect policy requires explicit product and
  voice-validation decisions.
- Each production lexical item must retain source, license, attribution,
  revision, and editorial-review provenance outside of presentation text.
- A commercial content agreement must address display, narration, caching or
  offline use, redaction and modification, volume, termination, and transfer or
  change-of-control rights.
- Publisher definitions, examples, pronunciations, or database entries must not
  be copied or paraphrased into Playlexi-owned content without documented rights
  and an approved editorial process.

### Narration and non-spoiling display

- Approved content is curated and versioned before play; an AI model does not
  generate definitions or sentences live during a game.
- A synthetic voice may narrate approved text, but it remains a candidate until
  pronunciation, latency, licensing, platform behavior, and accessibility are
  validated.
- Target-word and alternate-pronunciation audio require source provenance and
  human review for rare or competitive words. A verified recorded pronunciation
  and synthetic narration may be combined if licensing permits it.
- During an active turn, the target spelling is never displayed.
- Safe definitions, parts of speech, and origins may appear as text only after
  automated and editorial spoiler checks.
- A visible example sentence replaces the target word and unsafe variants with
  a blank. If the sentence is audio-only, the screen displays a status such as
  "Sentence playing" rather than its spoiling transcript.
- Full content may be displayed after the answer is committed.
- Headphones may be recommended but not required. Speaker, wired, Bluetooth,
  microphone, and accessibility behavior must be validated independently.
- Hearing accommodations must provide equivalent non-spoiling information where
  possible. Any accommodation that changes competitive information or scoring
  must be explicit rather than silently mixed into the same ranking.

## 9. Non-functional requirements

### Fairness and quality

- Report recognition by letter, cohort, platform, device, and environment;
  never rely on one aggregate accuracy number.
- Test whole words, multiple letters, unrelated speech, silence, and noise as
  required negative inputs.
- Preserve a fast, understandable recovery path when recognition is uncertain.

### Privacy and safety

- Ordinary play retains no raw audio.
- Raw audio, private datasets, participant records, and secrets never enter Git.
- Child voice collection is prohibited until an accepted privacy, consent,
  retention, deletion, and data-governance decision exists.
- Social features involving minors require product-specific safety and
  moderation requirements before implementation.

### Maintainability

- Domain behavior stays independent of frameworks and speech providers.
- Capture, recognition, storage, and networking use narrow typed contracts.
- External inputs are validated at boundaries.
- Code favors explicit, junior-readable states and events over cleverness.
- Every behavior change receives tests proportional to risk.

## 10. Success measures

### Voice feasibility

Use the metrics and provisional gates in `VOICE-VALIDATION.md`, including
capture health, per-letter recognition, rejection, latency, correction,
completion, and cohort-specific results.

### Initial experience

The playable-product study should measure:

- percentage of guests who start and complete the first game;
- time from opening the app to the first meaningful spelling attempt;
- microphone-check completion and failure reasons;
- whether players understand uncertainty, retry, and correction;
- whether players understand what their provisional result means;
- intent to play another round;
- intent to save progress after seeing value; and
- accessibility failures and abandonment reasons.

Numeric product thresholds are intentionally unset until a baseline exists.
Record the baseline before selecting targets.

## 11. Explicit non-goals for the current phase

- Microphone capture or a production speech engine.
- Accounts, authentication, profiles, or cloud synchronization.
- A backend, API, remote database, or production telemetry.
- Global rankings, leaderboards, XP, streak economies, or monetization.
- Local or online multiplayer.
- Chat, friends, notifications, or sharing.
- Collection or training on child voice recordings.
- Claims of universal accuracy, accent fairness, or competitive-grade anti-cheat.

The roadmap, not this PRD, activates later work.

## 12. Product horizons

### Horizon 1 — trustworthy individual play

Prove the deterministic flow, capture, recognition candidates, recovery, and a
small guest-first playable experience.

### Horizon 2 — local social play

Test pass-and-play on one shared phone as the first party-game format. Do not
add nearby-device or internet-room architecture until evidence requires it.

### Horizon 3 — online competition

Translate the recognizable spelling-bee experience to remote play. Add
production identity and infrastructure only after demonstrated demand and
accepted safety, moderation, privacy, synchronization, fairness, and cost
decisions.

## 13. Brand strategy brief

Branding can be explored while engineering validates the foundation. Brand work
must not imply unsupported technical or educational claims.

### Brand challenge

Playlexi must speak to a general audience. It should feel inviting for
school-aged spelling-bee learners and family play while remaining credible and
challenging for teenagers and older players. It should not look like a preschool
worksheet, a formal school portal, or a high-pressure gambling game.

### Accepted brand decisions

- **Name:** Playlexi is permanent.
- **Audience:** The main brand is general-audience, not early-childhood-first.
- **Category:** Voice-first spelling improvement and spelling-bee play.
- **Character:** Lexi is a candidate host or mascot, not yet a requirement.

### Working visual direction

Explore **elegant playfulness**: warmer and more expressive than a minimal word
grid, more restrained and age-flexible than a heavily childlike learning world,
and more dramatic than a study utility. A possible Lexi character should work as
pronouncer, host, coach, and celebratory presence without occupying every screen
or making the experience feel intended only for children.

The leading character direction is an abstract or creature-like bee associated
with the sound and name of the letter B, but no literal bee design is accepted
yet. The visual exploration should test whether this idea feels distinctive or
too predictable within the spelling category.

### Brand qualities to explore

- playful, but not babyish;
- intelligent, but not academic or cold;
- competitive, but not humiliating;
- energetic, but not chaotic;
- encouraging when the player struggles;
- fair and transparent when voice recognition is uncertain;
- inclusive across accents and language backgrounds; and
- distinctive at small mobile sizes and in audio-led interaction.

### Brand work that can proceed now

- visual moodboards and competitive references;
- color, type, illustration, icon, and motion directions;
- product voice and feedback-tone exploration;
- provisional skill-level naming systems;
- logo and app-icon exploration;
- accessibility checks for proposed colors and typography; and
- lightweight screen concepts for guest entry, spelling play, results, and the
  save-progress prompt.

### Brand work that should wait for product decisions

- claims about learning outcomes or recognition accuracy;
- rank, league, or leaderboard identity;
- final Lexi character design and how prominently the character appears;
- social or multiplayer identity systems.

## 14. Market and interaction references

**Research reviewed:** 2026-10-22

These products are references, not templates to copy:

- [Duolingo onboarding on Mobbin](https://mobbin.com/flows/b0b4f93f-5637-46ec-9d77-49ecda6b991d)
  demonstrates guided choices, visible onboarding progress, a character host,
  and an assigned starting point.
- [Kahoot live-game joining on Mobbin](https://mobbin.com/flows/56c2927d-5188-4ceb-9843-e7123b15715b)
  demonstrates low-friction PIN/QR entry, clear solo-versus-live modes, live
  tension, and podium-style results.
- [Quizlet quiz completion on Mobbin](https://mobbin.com/flows/a345d2c0-08d4-4111-b1a2-cc4a3761329f)
  demonstrates a restrained, general-audience study interface and a direct
  continue-practicing loop.
- [Scripps Word Club](https://spellingbee.com/node/435) represents official
  spelling-bee word-list study.
- [SpellPundit](https://spellpundit.spellpundit.com/faq.php) represents deep
  browser-based competition preparation and word-origin study.
- [Bizzing Bee](https://www.bizzingbee.com/) represents child-focused bee
  practice with pronunciation, definition, sentence, and origin.
- [Scripps rules](https://www.spellingbee.com/rules) document the recognizable
  competition roles and information a speller may request.

### Visual reference shortlist

- [Brilliant learning screen](https://mobbin.com/screens/55f382ff-2f1e-4e2d-88d2-4a0b469056bc)
  is the closest overall reference for confident typography, whitespace,
  progression, strong color, and playful illustration without a young-child
  presentation.
- [Gentler Streak home screen](https://mobbin.com/screens/c991401a-cc03-4eb2-9143-e775e8b15865)
  shows how a friendly character can provide warmth and emotional context while
  the surrounding product remains restrained and adult-capable.
- [Headspace onboarding](https://mobbin.com/screens/7dba3826-1195-4066-a96d-a894870048ec)
  shows an abstract, memorable character language built from simple shapes.
- [The New Yorker games screen](https://mobbin.com/screens/fc8bb6e8-d6f1-45be-885d-93dfa96511c4)
  shows elegant editorial typography paired with small playful illustrations.
- [Partiful event screen](https://mobbin.com/screens/d4e3b2a7-69c9-4776-be64-7f952d5bcaf3)
  is a reference for expressive social and party energy, not for the focused
  spelling surface.
- [Finch character-led home](https://mobbin.com/screens/d8ce4c68-ad5c-4400-a957-10a4d8befa2f)
  illustrates the more immersive character-world direction that the main
  Playlexi brand should avoid unless later research supports a younger variant.

The opportunity is not merely to add another spelling list or imitate a daily
word grid. Playlexi can combine authentic spelling-bee interaction, dependable
letter-by-letter voice input, transparent recovery, and consistent solo, local,
and online forms. Playlexi must not imply official affiliation with Scripps or
use protected word lists or media without appropriate permission.

## 15. Open product decisions

These questions require product-owner input before they affect implementation:

1. What is the minimum intended player age at launch?
2. Where should the working elegant-playfulness direction sit between minimal
   word game, energetic competition, and character-led learning?
3. Should Lexi be a visible bee-like host and pronouncer, a subtle abstract
   brand mark, or both at different moments?
4. Should missed words be reviewed after a round, and should that review be
   automatic or player-initiated?
5. Which solo modes should follow initial practice, and which one should be the
   primary spelling-bee preparation mode?
6. Should the first practice choose difficulty automatically, let the player
   choose, or combine both?
7. Should a corrected recognition error preserve a perfect result, and how
   should a player-requested spelling hint affect scoring?
8. What should the first result be called: starting level, skill band,
   provisional rating, or something else?
9. Beyond one-miss elimination, what turn order, revival, tie-break, and final
   championship rules should the one-phone party mode use?
10. Which countries are intended for the first public release?
11. Should Playlexi license a commercial dictionary, build an owned editorial
    lexicon, use compatible open data, or phase from one approach to another?
12. Which hearing-access accommodations belong in ordinary practice, and which
    require a separate competitive category because they change available clues?

## 16. Instructions for receiving agents

When given this PRD, an agent must:

1. Identify the active roadmap phase before proposing work.
2. Separate accepted requirements, hypotheses, candidates, and open questions.
3. Ask rather than invent when an open decision materially changes the result.
4. Create or supersede an ADR before a decision-shaped architecture change.
5. Never select a speech engine from reputation or convenience alone.
6. Never add accounts, rankings, multiplayer, a backend, or child-data handling
   merely because they appear in the long-term vision.
7. Keep documentation and tests aligned with implemented behavior.
