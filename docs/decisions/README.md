# Architecture decision records

ADRs capture decisions that would otherwise be repeatedly rediscovered. They are
immutable in outcome: if a decision changes, add a superseding ADR and mark the
old one superseded instead of rewriting its history.

| ADR | Decision | Status |
| --- | --- | --- |
| [ADR-001](ADR-001-native-ios-validation.md) | Use a native SwiftUI application for voice validation | Accepted |
| [ADR-002](ADR-002-isolated-letter-input.md) | Validate isolated letters before continuous spelling | Accepted |
| [ADR-003](ADR-003-local-only-phase-zero.md) | Keep Phase 0 local with no backend or database | Accepted |

Use [`ADR-TEMPLATE.md`](ADR-TEMPLATE.md) for new decisions. Dependencies,
providers, persistence, remote APIs, retained audio, minimum OS changes, and
architecture conventions always require an ADR.
