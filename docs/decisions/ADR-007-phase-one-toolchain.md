# ADR-007: Pin the Phase 1 universal toolchain

- **Status:** Accepted
- **Date:** 2026-10-22
- **Deciders:** Product owner and engineering
- **Supersedes:** None
- **Superseded by:** None

## Context

Phase 1 needs a reproducible web, iOS, and Android foundation before any audio
or recognition work. The host currently has Node.js 23.11.0, which is an
end-of-life release and should not become the project runtime.

Expo SDK 58 is the current stable Expo release. Expo's compatibility table maps
SDK 58 to React Native 0.88, React 19.3.0, React Native Web 0.21.0, and a minimum
Node.js version of 22.13.x. Expo's SDK 58 testing documentation requires Jest
30 and React Native Testing Library 14 or newer.

Primary sources checked on 2026-10-22:

- <https://docs.expo.dev/versions/v58.0.0/>
- <https://docs.expo.dev/develop/unit-testing/>
- <https://docs.expo.dev/router/reference/testing/>
- <https://nodejs.org/en/about/previous-releases>
- <https://nodejs.org/en/blog/release/v24.22.1>

## Decision

For Phase 1:

- pin Node.js 24.22.1 LTS in repository version files;
- pin pnpm 11.25.0 in the root `packageManager` field;
- scaffold from Expo's official `default@sdk-58` template;
- retain the template's compatible exact Expo, React Native, React, React Native
  Web, Expo Router, and TypeScript versions in the lockfile;
- use Expo Router and strict TypeScript as accepted by ADR-004;
- use Jest 30 with `jest-expo` and React Native Testing Library 14 or newer for
  domain and component tests; and
- use ordinary workspace scripts without Turborepo, Nx, or another build
  orchestrator.

All direct dependencies use exact versions. Transitive versions are fixed by
the committed pnpm lockfile. Expo-managed package versions are installed with
`expo install` so they remain compatible with SDK 58.

## Consequences

- A supported LTS runtime replaces the host's end-of-life Node version for
  project work.
- One test stack covers pure TypeScript behavior and React Native components,
  reducing configuration and contributor overhead.
- The repository has fewer moving parts and no orchestration cache initially.
- SDK 58 is new, so native and web builds must be proved locally rather than
  inferred from its compatibility table.
- Node and dependency upgrades are deliberate changes with verification, not
  floating updates.

## Alternatives considered

- **Keep Node.js 23.11.0:** rejected because it is end-of-life.
- **Use Node.js 26 Current:** rejected for now because the latest Active LTS is
  the more conservative project baseline.
- **Use Expo SDK 57:** viable but rejected because the available Xcode and
  Android SDKs satisfy SDK 58's published requirements and no compatibility
  blocker is known.
- **Use separate Vitest and Jest stacks:** rejected for Phase 1 because the
  extra runner and configuration do not yet buy enough value.
- **Add a monorepo orchestrator:** rejected until task volume demonstrates a
  real need.

## Validation

The decision is validated when a clean install, lint, strict typecheck, domain
and component tests, production web export, iOS simulator build, and Android
emulator build succeed using the pinned versions. Revisit when upgrading Expo,
when Node 24 approaches end of support, or when the workspace becomes large
enough that orchestration solves a measured problem.
