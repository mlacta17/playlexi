# Documentation map

**Last reviewed:** 2026-09-16
**Status:** Canonical

This directory is the durable context for Playlexi. Documents describe only
accepted scope, verified evidence, and clearly labeled proposals. Git history
is the document change log.

## Authority

| Document | Governs | Does not govern |
| --- | --- | --- |
| [`PRODUCT.md`](PRODUCT.md) | User, problem, current experience, scope | Framework or provider selection |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | System boundaries and engineering constraints | Future feature promises |
| [`VOICE-VALIDATION.md`](VOICE-VALIDATION.md) | Speech experiment, metrics, datasets, pass/fail gate | Product expansion |
| [`ROADMAP.md`](ROADMAP.md) | Work order and phase entry/exit gates | Detailed implementation |
| [`ENVIRONMENT.md`](ENVIRONMENT.md) | Verified local toolchain and device prerequisites | Product or framework decisions |
| [`LEGACY-INVENTORY.md`](LEGACY-INVENTORY.md) | Provenance of possible legacy inputs | Permission to copy them |
| [`GLOSSARY.md`](GLOSSARY.md) | Shared terminology | Product or architecture decisions |
| [`decisions/`](decisions/README.md) | One specific accepted decision per ADR | General status reporting |

For a specific architectural decision, an accepted ADR wins. Otherwise,
`ARCHITECTURE.md` wins over `PRODUCT.md`; the active roadmap phase limits both.
Conflicts are defects and must be resolved before code is written.

## Evidence labels

Use these labels when documenting uncertain behavior:

- **Verified:** observed in a recorded test or stated in an authoritative
  primary source.
- **Decision:** deliberately selected and recorded in an accepted ADR.
- **Hypothesis:** plausible but not yet demonstrated.
- **Open question:** information required before a decision can be made.

Dates identify when volatile external facts were last checked. Links should
point to primary documentation whenever possible.

## Updating documentation

1. Update the governing document in the same change as the behavior.
2. Add or amend an ADR for decision-shaped changes.
3. Update the roadmap only when a phase gate actually changes.
4. Preserve failed experiments in `VOICE-VALIDATION.md`; do not rewrite history.
5. Keep examples compilable once application code exists.
