# Playlexi

Playlexi is being rebuilt from first principles as a cross-platform spelling
experience for web, iOS, and Android. Its defining interaction is spelling aloud
one letter at a time with immediate, fair recovery when speech recognition is
uncertain.

The general-audience product serves people improving their spelling, preparing
for spelling-bee competition, and playing with friends or family locally or
online. Development begins with one small individual experience because all of
those modes depend on the same trustworthy voice foundation. Voice is the
primary interaction; typing and touch are the fallback.

The repository is intentionally small. Phase 1 builds only the deterministic
universal application foundation. There is no backend, database, authentication
system, microphone capture, or selected production speech engine yet. Those are
gated decisions, not assumed infrastructure.

## Start here

Read these documents in order before making changes:

1. [`AGENTS.md`](AGENTS.md) — repository rules.
2. [`docs/PRD.md`](docs/PRD.md) — agent-ready product requirements and context.
3. [`docs/DESIGN-BRIEF.md`](docs/DESIGN-BRIEF.md) — visual direction and design
   exploration brief.
4. [`docs/PRODUCT.md`](docs/PRODUCT.md) — product definition and boundaries.
5. [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — accepted technical shape.
6. [`docs/VOICE-VALIDATION.md`](docs/VOICE-VALIDATION.md) — speech evaluation
   and data protocol.
7. [`docs/ROADMAP.md`](docs/ROADMAP.md) — gated delivery sequence.
8. [`docs/decisions/README.md`](docs/decisions/README.md) — architecture
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
- Phase 1 implementation: complete; final iOS release verification and the
  first GitHub CI run remain before the phase gate closes.

## Local development

Use Node.js 24.22.1 and Corepack so the repository selects pnpm 11.25.0. Then:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm web
```

Use `pnpm ios` or `pnpm android` for a generated native development build. The
iOS command prepares the temporary framework cache required by this checkout's
macOS Documents location. Do not hand-edit the ignored generated `ios/` or
`android/` directories.

## Legacy repositories

Previous Playlexi repositories are read-only evidence. No legacy code,
configuration, skills, prompts, or documentation is inherited automatically.
See [`docs/LEGACY-INVENTORY.md`](docs/LEGACY-INVENTORY.md).

## License

Private repository. No license is granted for redistribution.
