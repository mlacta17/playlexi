# Playlexi visual design brief

**Version:** 0.1
**Last reviewed:** 2026-10-22
**Status:** Accepted design context; visual execution remains exploratory

## 1. Purpose

This brief gives a product designer or design agent enough context to explore
Playlexi's brand and mobile interface without relying on conversation history.
It translates the product requirements into visual and interaction direction.

This document does not authorize application implementation or change the
active engineering roadmap. Before proposing production behavior, read:

1. `AGENTS.md` for repository rules;
2. `PRD.md` for the complete product requirements and open decisions;
3. `PRODUCT.md` for canonical product boundaries; and
4. `ROADMAP.md` for currently authorized work.

When using this brief outside the repository, provide `PRD.md` with it. If the
receiving agent cannot open Mobbin links, attach screenshots of the references
listed below. Do not rely on temporary image URLs.

## 2. Product in one paragraph

Playlexi is a mobile-first, voice-first spelling product for a general audience.
A player hears a word and spells it aloud one letter at a time. The interface
shows what it heard, handles uncertainty fairly, and provides touch or typing as
a fallback. The first experience is a short guest placement game followed by
solo practice. The long-term product expands into spelling-bee preparation,
one-phone elimination party play, and eventually online spelling-bee
competition.

## 3. Product promise

> Demonstrate what you know, without fighting the microphone.

Playlexi should help people improve at spelling while preserving the anticipation,
ceremony, and pressure that make a spelling bee exciting.

## 4. Intended audience

The main Playlexi brand addresses motivated spellers generally, especially
school-aged learners and teenagers preparing for spelling-bee season, plus older
players who enjoy challenging word competition.

It is not an early-childhood-first brand. A younger, more character-heavy
version may be explored separately later. The primary experience must not feel
juvenile, like a preschool worksheet, or like a parent dashboard.

## 5. Accepted product and brand decisions

The following are fixed unless the product owner changes them:

- **Name:** Playlexi is permanent.
- **Platforms:** web, iOS, and Android; visual exploration is mobile-first.
- **Primary interaction:** voice, one deliberately spoken letter at a time.
- **Fallback:** touch and typing for correction, accessibility, or unavailable
  audio.
- **First use:** a guest can try a short placement-style game before creating an
  account.
- **Next destination:** solo play follows the introductory placement game.
- **First result:** a provisional level or skill band, not an unsupported global
  rank.
- **Miss response:** a brief "dun-dun"-style failure sound, equivalent visual
  state, optional haptic, then move on without a lecture.
- **Bee information:** pronunciation replay, definition, example sentence,
  language of origin, and part of speech are available.
- **Local party:** pass-and-play on one phone; one miss initially eliminates the
  active player.
- **Online direction:** reproduce the roles and tension of a spelling bee rather
  than presenting a generic quiz.
- **Waiting room:** future online lobbies may offer optional unranked solo
  practice that cannot affect the match.
- **Character:** Lexi may be an abstract or creature-like bee associated with
  the letter B; the exact design is not selected.

## 6. Working visual position

The working direction is **elegant playfulness**:

- warmer and more expressive than a minimal word grid;
- more restrained and age-flexible than a heavily childlike learning world;
- more energetic than a formal study utility;
- intelligent without feeling academic or cold;
- competitive without humiliation or casino-like pressure;
- memorable without filling every screen with a mascot; and
- trustworthy when speech recognition is uncertain.

The product should be visually calm while the player listens and spells, then
become more expressive for results, advancement, elimination, and victory.

## 7. Reference board

References communicate qualities to combine or avoid; they are not templates to
copy.

| Reference | Use for | Do not copy |
| --- | --- | --- |
| [Brilliant learning screen](https://mobbin.com/screens/55f382ff-2f1e-4e2d-88d2-4a0b469056bc) | Primary visual anchor: strong typography, whitespace, controlled color, dimensional illustration, and clear progression | Its exact purple palette, course structure, icons, or illustrations |
| [Gentler Streak home](https://mobbin.com/screens/c991401a-cc03-4eb2-9143-e775e8b15865) | A warm character living inside an otherwise mature interface | Its health metaphors, character anatomy, or dashboard structure |
| [Headspace onboarding](https://mobbin.com/screens/7dba3826-1195-4066-a96d-a894870048ec) | Abstract, memorable character language made from simple shapes | Its orange character, meditation imagery, or compositions |
| [The New Yorker games](https://mobbin.com/screens/fc8bb6e8-d6f1-45be-885d-93dfa96511c4) | Editorial typography, compact illustrations, and an intelligent game collection | Its publication identity, typefaces, game names, or artwork |
| [Kahoot live-game flow](https://mobbin.com/flows/56c2927d-5188-4ceb-9843-e7123b15715b) | Clear solo/live choices, easy joining, competition energy, and podium results | Its saturated classroom aesthetic or answer-grid conventions |
| [Partiful event screen](https://mobbin.com/screens/d4e3b2a7-69c9-4776-be64-7f952d5bcaf3) | Selective party energy for invitations and celebrations | Its visually busy surfaces during focused spelling |
| [Finch character-led home](https://mobbin.com/screens/d8ce4c68-ad5c-4400-a957-10a4d8befa2f) | Boundary reference for a future younger version | A room, wardrobe, collecting economy, or character world in primary Playlexi |
| [Duolingo incorrect state](https://mobbin.com/screens/81b520ac-e864-4e64-bc18-f16caca3b124) | Clear immediate error communication | A large instructional interruption after every competitive miss |

## 8. Required first exploration

Create three visibly distinct directions before extending one into a design
system.

### Direction A — Elegant Bee (recommended starting point)

Combine Brilliant's confident learning presentation with Gentler Streak's
mascot restraint. Explore an abstract bee or B-shaped Lexi as a host who appears
at key moments. Keep active spelling surfaces spacious and typographic.

### Direction B — Abstract Lexi

Use Headspace-like geometric character logic without copying its forms. Explore
sound waves, speech bubbles, quotation marks, wings, letter tiles, or the letter
B as ingredients. This direction may be more expressive but must remain suitable
for teenagers and older players.

### Direction C — Editorial Competition

Use stronger editorial typography, restrained illustration, scorecards, rounds,
and tournament ceremony. Lexi may be reduced to a symbol, announcer mark, or
small reaction character. This direction should feel like an intelligent word
sport rather than a school product.

For each direction, provide:

- a short rationale;
- a moodboard or style tile;
- color and neutral palette proposals with accessible contrast;
- primary and supporting typography roles;
- shape, border, elevation, and spacing language;
- illustration and icon direction;
- a Lexi or no-Lexi proposal;
- an app-icon concept;
- motion and sound principles; and
- the three key mobile screens listed in the next section.

Do not combine the directions into one compromise before the product owner
reviews them.

## 9. First three concept screens

Use a current common mobile viewport and keep layouts adaptable rather than
optimizing for one device model.

### Screen 1 — Guest entry

Purpose: communicate what Playlexi is and allow immediate play.

Required content:

- Playlexi name or working wordmark;
- one concise value statement;
- primary action: `Play now`;
- secondary action: `I already have an account`; and
- optional Lexi presence appropriate to the direction.

Do not place account creation ahead of trying the game.

### Screen 2 — Active spelling

Purpose: make listening, speaking, recognition, and bee information immediately
understandable without revealing the answer.

Required elements:

- word-audio state and replay;
- current letter position and accepted letter tiles;
- deliberate microphone action and clear listening state;
- touch/type fallback that does not dominate voice;
- access to definition, sentence, language of origin, and part of speech;
- recognition uncertainty and correction entry points; and
- no visible target spelling.

This should be the calmest and most focused surface.

### Screen 3 — Placement result

Purpose: provide a satisfying result, a useful next step, and a reason to save
progress.

Required content:

- clearly provisional starting level or skill band;
- concise performance explanation;
- one useful strength or practice area;
- primary action: `Continue practicing`;
- account-value action: `Save my progress`; and
- celebration appropriate to the direction.

Do not present a global percentile, leaderboard position, or certified score.

## 10. Follow-on screens after direction selection

After the product owner chooses a direction, extend only that direction into:

1. microphone explanation and system-permission preparation;
2. unscored microphone check;
3. definition, sentence, origin, and part-of-speech request states;
4. recognition uncertainty and candidate correction;
5. brief miss feedback and transition;
6. solo-mode home;
7. one practice-mode selection screen;
8. save-progress/account prompt; and
9. one-phone party setup, active turn, elimination, and winner concepts.

An online lobby may be explored as a future concept after these screens. It is
not part of the initial implementation scope.

## 11. Lexi exploration

Explore whether Lexi should be:

1. a visible bee-like host and pronouncer;
2. an abstract B/bee/sound symbol that occasionally becomes expressive; or
3. a character for onboarding and celebration paired with a simpler brand mark
   during gameplay.

Avoid the default school-bee combination of yellow-and-black stripes, glasses,
graduation cap, pencil, and notebook unless transformed into something genuinely
distinctive. Investigate:

- a B-shaped body or negative space;
- wings that resemble quotation marks, sound waves, or parentheses;
- a stinger or flight path that resembles a cursor or underline;
- letter-tile geometry;
- a restrained face capable of listening, anticipation, empathy, and
  celebration; and
- silhouettes that remain recognizable at app-icon size.

Lexi should not mock a misspelling. The brief miss response may be dramatic or
wry, but never shaming.

## 12. Audio-first and non-spoiling rules

During an active turn:

- never display the target spelling;
- label playback with states such as `Word playing`, `Definition playing`, or
  `Sentence playing`;
- display definitions, origins, or parts of speech only when approved spoiler
  checks confirm they do not expose the answer;
- replace the target and unsafe variants with a blank in any visible sentence;
- reveal complete educational content only after the spelling is committed;
- visually distinguish recognition uncertainty from a spelling mistake; and
- do not use microphone or recognition confidence as the player's score.

The design should make `the application is unsure` feel different from `the
player spelled the word incorrectly`.

## 13. Feedback and motion

### Miss

- short "dun-dun"-style audio cue;
- equivalent brief visual state;
- optional haptic on supported devices;
- no lengthy explanation during active play; and
- advance to the next word or player.

Whether missed words are reviewed after a round remains open.

### Recognition uncertainty

- calm rather than punitive;
- show what was heard or the available candidates;
- allow retry or correction;
- do not use the miss sound; and
- preserve the player's sense that the technology, not their knowledge, is in
  question.

### Success and advancement

- reward clarity and timing rather than visual noise;
- reserve the largest celebrations for completing a round, advancing, winning,
  or establishing a new personal best; and
- keep ordinary correct-letter feedback fast enough for spoken spelling rhythm.

## 14. Accessibility requirements

- Text and controls support platform text scaling.
- Contrast meets WCAG AA for meaningful text and controls.
- Meaning is never communicated only through color, sound, animation, or haptic
  feedback.
- Controls have generous mobile targets and clear labels.
- Focus order and screen-reader announcements follow the spelling flow.
- Motion has a reduced-motion treatment.
- Voice is primary but touch and typing remain available.
- Headphones may be recommended but cannot be required.
- Hearing-access text must remain non-spoiling; accommodations that expose more
  information may need a clearly separate competition category.

## 15. Content and licensing constraints

- Do not use copied dictionary definitions, examples, pronunciation recordings,
  logos, or word lists in mockups unless their use is authorized.
- Clearly label placeholder copy as placeholder.
- Do not imply affiliation with Merriam-Webster, Scripps, Duolingo, Wordle,
  Kahoot, or any reference product.
- Do not call a result official, certified, or nationally ranked.
- Do not make claims about recognition accuracy or educational outcomes.

## 16. What remains open

The design agent may explore but must not silently decide:

- the minimum launch age;
- final palette, typography, logo, and icon;
- Lexi's exact form and prominence;
- level or skill-band names;
- whether post-round review is automatic or optional;
- complete solo-mode set and ordering;
- party turn order, tie-breaks, revival, and championship rules;
- production dictionary and narration providers; and
- online identity, lobby, matchmaking, moderation, and ranking systems.

List assumptions and questions with every design direction.

## 17. Definition of a successful exploration

The first design exploration succeeds when the product owner can compare three
coherent directions and answer:

- Which one looks most like Playlexi?
- Which one welcomes school-aged competitors without excluding older players?
- Which one makes voice spelling feel trustworthy?
- How visible should Lexi be?
- Which elements should remain calm during play and become expressive during
  competition?

Pixel-perfect completeness is not the goal of the first pass. A clear, distinct,
and testable visual point of view is.
