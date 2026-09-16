# Legacy inventory and provenance

**Last reviewed:** 2026-09-16
**Status:** Reference only

## Source repositories inspected

| Local path | Branch / state observed | Latest observed commit | Role |
| --- | --- | --- | --- |
| `/Users/mariaciannelactao/Documents/shadcn-create-app.playlexi-wispr-flow` | `feature/wispr-flow-speech`, clean, three commits ahead of remote | `5de55af` — 2026-04-18 | Newest legacy implementation and primary evidence source |
| `/Users/mariaciannelactao/Documents/shadcn-create-app.playlexi-google-api` | `main`, local uncommitted UI/package changes | `0fa2ee7` — 2026-02-20 | Older main worktree; do not overwrite |
| `/Users/mariaciannelactao/Documents/shadcn-create-app.playlexi` | `feature/google-speech-api` | `851ab7a` — 2026-01-17 | Google speech experiment |
| `/Users/mariaciannelactao/Documents/app.playlexi` | `main` | `e3b57f1` — 2025-12-12 | Early UI prototype |

These paths are developer-machine references, not build dependencies.

## Verified legacy findings

- The newest implementation is a Next.js/Cloudflare application with Wispr HTTP
  and WebSocket recognition paths, D1/Drizzle data, Better Auth, and broad game
  scope.
- The streaming capture path uses deprecated `ScriptProcessorNode`.
- Its server packet size is fixed for 16 kHz while Safari may provide 44.1 kHz,
  making the documented packet duration inconsistent with actual audio duration.
- Wispr does not provide the word timing expected by the earlier anti-cheat design.
- Validation defaults to trusting matching whole-word output, so the implementation
  cannot reliably distinguish saying a word from spelling it.
- The phonetic-learning feature remaps transcript tokens; it does not adapt an
  acoustic model to a speaker's accent.
- The HTTP speech proxy and WebSocket server lack production-grade authentication,
  origin enforcement, quotas, and rate controls.
- Architecture, PRD, roadmap, ADR, setup, README, and source comments disagree
  about the primary provider and active anti-cheat behavior.
- At the time of review, 112 tests passed and 29 database tests failed due to a
  native Node ABI mismatch; TypeScript and ESLint also reported errors.

These findings explain the reset. They are not a complete security or product
audit of the legacy application.

## Promotion policy

Nothing is copied automatically. A legacy item may be promoted only when:

1. its source commit and license/provenance are recorded;
2. it serves active scope;
3. behavior is understood independently of legacy documentation;
4. tests are added in the new repository;
5. secrets, personal data, generated files, and obsolete dependencies are absent;
6. the change is smaller and clearer than a fresh implementation.

## Candidate assets requiring later review

- Word fixture and dictionary attribution.
- Original sound and illustration licensing/provenance.
- Product copy and design tokens.
- Pure spelling-normalization test cases.

No candidate is approved for import yet.

## Rejected initial imports

- Provider implementations and speech server.
- Existing database schema and migrations.
- Authentication and API routes.
- Phonetic-learning database and inferred mappings.
- Multiplayer, ranking, leaderboard, and social systems.
- Legacy architecture and roadmap documents.
