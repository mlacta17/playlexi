# Playlexi

Playlexi is being rebuilt from first principles as a cross-platform spelling
experience for web, iOS, and Android. Its defining interaction is spelling aloud
one letter at a time with immediate, fair recovery when speech recognition is
uncertain.

The repository is intentionally small. Phase 1 builds only the deterministic
universal application foundation. There is no backend, database, authentication
system, microphone capture, or selected production speech engine yet. Those are
gated decisions, not assumed infrastructure.

## Start here

Read these documents in order before making changes:

1. [`AGENTS.md`](AGENTS.md) — repository rules.
2. [`docs/PRODUCT.md`](docs/PRODUCT.md) — product definition and boundaries.
3. [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — accepted technical shape.
4. [`docs/VOICE-VALIDATION.md`](docs/VOICE-VALIDATION.md) — speech evaluation
   and data protocol.
5. [`docs/ROADMAP.md`](docs/ROADMAP.md) — gated delivery sequence.
6. [`docs/decisions/README.md`](docs/decisions/README.md) — architecture
   decisions and their status.

## Current status

- Active phase: 1 — deterministic universal foundation.
- Product clients: web, iOS, and Android.
- Client foundation: Expo, React Native, Expo Router, and strict TypeScript.
- Recognition: provider-neutral; Vosk and a custom letter classifier are
  benchmark candidates, not commitments.
- Interaction baseline: one deliberate capture per letter.
- Backend and database: absent by design.
- Local environment: web, iOS simulator, and Android emulator prerequisites are
  available. See [`docs/ENVIRONMENT.md`](docs/ENVIRONMENT.md).
- Next gate: scaffold and prove the same deterministic spelling flow on web,
  iOS, and Android before microphone or model integration.

## Legacy repositories

Previous Playlexi repositories are read-only evidence. No legacy code,
configuration, skills, prompts, or documentation is inherited automatically.
See [`docs/LEGACY-INVENTORY.md`](docs/LEGACY-INVENTORY.md).

## License

Private repository. No license is granted for redistribution.
