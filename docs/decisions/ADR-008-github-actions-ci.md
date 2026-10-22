# ADR-008: Use GitHub Actions for foundation CI

- **Status:** Accepted
- **Date:** 2026-10-22
- **Deciders:** Product owner and engineering
- **Supersedes:** None
- **Superseded by:** None

## Context

Phase 1 requires reproducible automated checks, but native simulator builds are
slow, host-specific, and already verified locally. The repository is hosted on
GitHub, so a second CI service would add credentials and maintenance without a
current benefit.

GitHub's official release API was checked on 2026-10-22. The selected actions
are `actions/checkout` 7.0.1 and `actions/setup-node` 7.1.0.

## Decision

Use one GitHub Actions workflow on Ubuntu for install integrity, Expo dependency
compatibility, lint, strict typechecking, tests, and the static web export.
Pin official actions to immutable commit hashes with release comments. Use the
Node and pnpm versions already pinned by ADR-007 and install with the frozen
lockfile.

iOS and Android builds remain explicit local Phase 1 evidence. Native CI is not
added until release frequency or regression history demonstrates that its cost
is justified.

## Consequences

- Every push and pull request receives the same fast deterministic checks.
- Compromised or retagged action releases cannot silently change the workflow.
- Native regressions are not detected by hosted CI yet, so documented local
  smoke builds remain required when native dependencies or configuration change.

## Alternatives considered

- **No CI:** rejected because local-only checks are easy to skip.
- **Hosted iOS and Android builds on every change:** rejected for Phase 1 due to
  cost and complexity; the application has no native feature yet.
- **A separate CI provider:** rejected because it adds no demonstrated value.

## Validation

The first pushed workflow must complete successfully. Revisit native CI when
Phase 2 adds capture code or when the project begins shipping releases.
