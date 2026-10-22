# ADR-004: Universal Expo validation client

- **Status:** Accepted
- **Date:** 2026-10-21
- **Deciders:** Product owner and engineering
- **Supersedes:** ADR-001
- **Superseded by:** None

## Context

The product owner intends Playlexi to serve web, iOS, and Android. The prior
native-SwiftUI decision was intentionally limited to an iPhone validation
baseline, but no application code was generated and the product direction
changed before implementation.

Shared product behavior is desirable, while microphone lifecycle, browser
constraints, native recognition libraries, and model delivery differ by
platform. A “single codebase” must not erase those differences.

Expo documents Expo Router as a universal Android/iOS/web router and development
builds as the path for custom native code:

- <https://docs.expo.dev/router/introduction/>
- <https://docs.expo.dev/workflow/customizing/>

## Decision

Build the validation client with Expo, React Native, Expo Router, and strict
TypeScript. Use React Native Web for the initial web application.

Use Expo development builds, not Expo Go, because speech candidates may require
custom native code. Use pnpm workspaces initially without Turborepo, Nx, or
another orchestration layer.

Share domain behavior, contracts, and proven UI. Implement capture and
recognition behind platform-specific adapters. Keep generated native application
projects reproducible through Expo Prebuild unless a later ADR accepts committed
native projects.

This decision governs the validation client, not every possible future product
surface. Review it after cross-platform capture and model benchmarks.

## Consequences

- Web, iOS, and Android evolve from one product foundation.
- TypeScript domain and state-machine code can be tested without platform APIs.
- Native Swift/Kotlin and browser-specific code remain available where required.
- Expo Go cannot run the full development application.
- Native dependency changes require rebuilding development clients.
- Universal UI does not guarantee universal speech behavior; each platform has
  separate validation gates.
- Xcode and Android toolchains are both required before Phase 1 can exit.

## Alternatives considered

- **Native SwiftUI plus native Android plus separate web:** strongest native
  control but triples early product work before feasibility is known.
- **Continue native iOS only:** no longer matches the accepted product surfaces.
- **Reuse the legacy Next.js application:** rejected because it carries obsolete
  capture, provider, backend, and product assumptions.
- **Flutter:** viable cross-platform option, but TypeScript/React aligns better
  with existing owner context and candidate library investigation; no measured
  advantage justified changing ecosystems.
- **Separate React web and React Native mobile applications:** deferred because
  the initial product is small enough to test Expo's universal surface first.

## Validation

The decision passes its first review only when the same deterministic spelling
flow builds and works on web, an iOS target, and an Android target. Phase 2 then
tests capture lifecycle independently on each platform. Revisit the decision if
the web surface requires extensive platform forks or a required model runtime
cannot be maintained safely through Expo/native modules.
