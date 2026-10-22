# ADR-003: Local-only Phase 0 with no backend or database

- **Status:** Superseded by ADR-006
- **Date:** 2026-09-16
- **Deciders:** Product owner and engineering
- **Superseded by:** ADR-006

## Context

Voice feasibility is the dominant risk. Accounts, synchronization, server APIs,
and data models do not reduce that risk and would introduce security, privacy,
cost, deployment, and maintenance decisions without validated requirements.

## Decision

Phase 0 runs locally on the iPhone. Words are bundled fixtures, session state is
in memory, raw audio is ephemeral, and sanitized diagnostics leave the device
only through an explicit export action.

## Consequences

- Development and tests are deterministic and do not require cloud accounts.
- There is no account continuity or cross-device data.
- Benchmark collection requires an intentional export/import workflow.
- Backend, API, database, authentication, and telemetry decisions are deferred
  until a later activated requirement justifies them.

## Alternatives considered

- **Reuse the legacy Cloudflare/D1 backend:** rejected because its schema and APIs
  reflect features outside current scope.
- **Create a minimal metrics API now:** rejected because explicit local export is
  sufficient for the initial small cohort and has a smaller privacy surface.
