# ADR-001: Native iOS application for voice validation

- **Status:** Superseded by ADR-004
- **Date:** 2026-09-16
- **Deciders:** Product owner and engineering
- **Superseded by:** ADR-004

## Context

The legacy browser application mixes Safari/WebKit capture behavior, JavaScript
audio processing, provider behavior, and product logic. The immediate question
is whether reliable letter recognition is possible on the owner's priority
platform. A cross-platform framework would add bridge and runtime variables
before native capability is understood.

## Decision

Build Phase 0 as a native SwiftUI iPhone application using Apple audio APIs.
This is a validation architecture, not a permanent iOS-only product commitment.

## Consequences

- Audio lifecycle and Speech-framework behavior can be measured directly.
- The prototype requires Swift/iOS expertise but avoids a JavaScript audio bridge.
- Android and web receive no Phase 0 implementation.
- A production-client decision will be made later using validation and product
  distribution evidence.

## Alternatives considered

- **Repair the web application:** rejected for the baseline because WebKit and
  deprecated browser audio code obscure the native question.
- **Expo/React Native first:** deferred because native speech integration would
  still require a development build and potentially custom native code.
- **Backend-only recognizer benchmark:** rejected because it cannot validate
  real iPhone capture lifecycle or recovery UX.
