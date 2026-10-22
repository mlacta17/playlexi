# Documentation map

**Last reviewed:** 2026-10-21
**Status:** Canonical

This directory is the durable context for Playlexi. It describes accepted
scope, verified evidence, decisions, and explicitly labeled open questions. Git
history is the document change log.

## Authority

| Document | Governs | Does not govern |
| --- | --- | --- |
| [`PRODUCT.md`](PRODUCT.md) | Users, problems, experience, scope | Framework or engine selection |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | System structure and engineering boundaries | Future feature promises |
| [`VOICE-VALIDATION.md`](VOICE-VALIDATION.md) | Speech experiments, datasets, metrics, and gates | Product expansion |
| [`ROADMAP.md`](ROADMAP.md) | Work order and phase entry/exit gates | Detailed implementation |
| [`ENVIRONMENT.md`](ENVIRONMENT.md) | Observed local prerequisites | Product or architecture decisions |
| [`LEGACY-INVENTORY.md`](LEGACY-INVENTORY.md) | Legacy provenance and promotion policy | Permission to copy legacy work |
| [`GLOSSARY.md`](GLOSSARY.md) | Shared terminology | Product or architecture decisions |
| [`decisions/`](decisions/README.md) | One specific accepted decision per ADR | General status reporting |

For a specific technical decision, an accepted ADR wins. Otherwise,
`ARCHITECTURE.md` wins over `PRODUCT.md`; the active roadmap phase limits both.
Conflicts are defects and must be resolved before implementation.

## Evidence labels

- **Verified:** observed in a reproducible test or stated by an authoritative
  primary source.
- **Decision:** deliberately selected in an accepted ADR.
- **Hypothesis:** plausible but not demonstrated for Playlexi.
- **Candidate:** permitted to enter a benchmark but not selected for production.
- **Open question:** information required before a decision can be made.

Dates identify when volatile external facts were last checked. Link to primary
documentation whenever possible.

## Update rules

1. Update the governing document in the same change as behavior.
2. Add or supersede an ADR before implementing a decision-shaped change.
3. Update the roadmap only when scope or a phase gate actually changes.
4. Preserve failed experiments and cohort-specific failures.
5. Keep examples compilable after application code exists.
6. Never place private benchmark recordings or participant data in this
   repository.
