# ADR-006: Local-only validation with no backend

- **Status:** Accepted
- **Date:** 2026-10-21
- **Deciders:** Product owner and engineering
- **Supersedes:** ADR-003
- **Superseded by:** None

## Context

ADR-003 correctly avoided backend work for the original native Phase 0. The new
roadmap has several cross-platform validation phases, but the underlying reason
has not changed: accounts, synchronization, databases, and server APIs do not
reduce capture or recognition risk.

Extending the boundary explicitly prevents the new phase numbering from being
misread as authorization to add infrastructure.

## Decision

Keep Phases 0–7 local-first with no product backend, remote database, accounts,
or cloud synchronization. Bundle validated word fixtures, keep session state in
memory, process audio on-device where candidate runtimes permit, and export
sanitized diagnostics only through an explicit user action.

Private model development may use separately governed training infrastructure;
it is not part of the application and requires its own ADR before participant
data is uploaded.

Reconsider product backend architecture only in Phase 8 after a demonstrated
product requirement.

## Consequences

- Validation remains deterministic and has a smaller privacy/security surface.
- The same application can work without connectivity.
- Participant benchmark transfer is deliberate rather than automatic.
- There is no cross-device progress, account continuity, remote content
  management, or centralized telemetry during validation.
- A remote speech candidate would require a superseding or scoped ADR before use.

## Alternatives considered

- **Reuse a legacy backend:** rejected because it encodes obsolete product scope.
- **Add a minimal metrics API:** rejected because explicit export is sufficient
  for the initial controlled cohorts.
- **Create accounts early for future scale:** rejected because no validated
  requirement offsets the security and maintenance cost.

## Validation

Ordinary development, tests, and the minimal playable product must operate
without network services. Any proposed server call must identify the activated
requirement and the ADR authorizing it.
