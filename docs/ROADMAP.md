# Gated roadmap

**Last reviewed:** 2026-09-16
**Active phase:** Phase 0A — documentation and deterministic foundation

Dates are recorded only when a phase exits. Later phases are not permission to
build ahead.

| Phase | Objective | Entry gate | Exit gate | Status |
| --- | --- | --- | --- | --- |
| 0A | Canonical context and deterministic spelling flow | New repository | Docs reviewed; mock flow and tests green | Active |
| 0B | Native audio capture | 0A complete | Real-device capture lifecycle passes without recognition | Pending |
| 0C | Isolated-letter recognition baseline | 0B complete | Baseline protocol completed and results recorded | Pending |
| 0D | Recovery UX and candidate tuning | 0C evidence | Provisional validation gates pass or product is reconsidered | Pending |
| 1 | Minimal playable spelling session | Phase 0 gate passed | Small local game usable end-to-end | Pending |
| 2 | Production architecture decision | Evidence of real product need | Client/backend/provider ADRs accepted | Pending |

## Phase 0A scope

- Establish repository rules and canonical documents.
- Generate the iOS project using the installed, verified toolchain.
- Implement framework-independent domain types.
- Implement the spelling-session state machine.
- Implement deterministic mock recognition.
- Build the accessible retry/correction flow.
- Add unit and UI tests plus continuous integration.

### Current blocker

Application generation is blocked until the local Apple developer toolchain
passes the checks in `ENVIRONMENT.md`. Xcode project files and deployment targets
must not be generated from the currently broken toolchain.

### 0A out of scope

Microphone access, Speech framework integration, retained audio, provider APIs,
networking, persistence beyond fixtures, accounts, and all legacy platform
features.

## Phase transition procedure

1. Record verification commands and real-device evidence where applicable.
2. Resolve documentation contradictions.
3. Update the active phase and date this roadmap row.
4. Accept any ADR required for the next phase.
5. Begin the next phase in a separate, reviewable change.
