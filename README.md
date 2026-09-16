# Playlexi

Playlexi is being rebuilt from first principles as a mobile-first spelling
experience. The current milestone is deliberately narrow: prove that people
with representative accents can spell reliably by voice on a real iPhone.

There is no production application, backend, database, authentication system,
or selected cloud speech provider yet. Those are later decisions, contingent
on measured evidence from the voice-validation milestone.

## Start here

Read these documents in order before changing the repository:

1. [`AGENTS.md`](AGENTS.md) — repository rules for humans and coding agents.
2. [`docs/PRODUCT.md`](docs/PRODUCT.md) — the current product and its boundaries.
3. [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — the architecture that exists
   now and the rules for extending it.
4. [`docs/VOICE-VALIDATION.md`](docs/VOICE-VALIDATION.md) — the experiment that
   must pass before the product expands.
5. [`docs/ROADMAP.md`](docs/ROADMAP.md) — gated delivery sequence.
6. [`docs/decisions/README.md`](docs/decisions/README.md) — accepted and proposed
   architecture decisions.

The documentation index at [`docs/README.md`](docs/README.md) defines which
document is authoritative when two documents appear to overlap.

## Current status

- Phase: 0 — repository and validation foundation
- Application code: not started
- Intended validation device: iPhone running iOS 26 or later
- Local toolchain: blocked pending Xcode repair/update; see
  [`docs/ENVIRONMENT.md`](docs/ENVIRONMENT.md)
- Primary risk: accurate and recoverable recognition of isolated English
  letter names across representative speakers and environments
- Next action: repair and verify the Apple toolchain, then generate the project
  and implement the deterministic mock spelling flow before adding microphone
  or speech-provider code

## Legacy project

The previous Playlexi worktrees are evidence only. They are not dependencies
and their code is not copied by default. See
[`docs/LEGACY-INVENTORY.md`](docs/LEGACY-INVENTORY.md).

## License

Private repository. No license is granted for redistribution.
