# Architecture decision records

ADRs preserve why a decision was made. When direction changes, add a superseding
ADR and mark the earlier record superseded instead of deleting history.

| ADR | Decision | Status |
| --- | --- | --- |
| [ADR-001](ADR-001-native-ios-validation.md) | Use native SwiftUI for the original validation baseline | Superseded by ADR-004 |
| [ADR-002](ADR-002-isolated-letter-input.md) | Validate isolated letters before continuous spelling | Accepted |
| [ADR-003](ADR-003-local-only-phase-zero.md) | Keep the original Phase 0 local | Superseded by ADR-006 |
| [ADR-004](ADR-004-universal-expo-client.md) | Use an Expo universal validation client | Accepted |
| [ADR-005](ADR-005-evidence-first-speech-selection.md) | Keep recognition provider-neutral and select through benchmarks | Accepted |
| [ADR-006](ADR-006-local-only-validation.md) | Keep validation phases local with no backend or database | Accepted |
| [ADR-007](ADR-007-phase-one-toolchain.md) | Pin the Phase 1 universal toolchain | Accepted |
| [ADR-008](ADR-008-github-actions-ci.md) | Use GitHub Actions for foundation CI | Accepted |

Use [`ADR-TEMPLATE.md`](ADR-TEMPLATE.md) for new decisions. Dependencies,
providers, model runtimes, persistence, remote APIs, raw-audio retention,
child-data collection, minimum platform versions, and architecture conventions
require an ADR before implementation.
