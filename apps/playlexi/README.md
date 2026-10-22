# Playlexi application

This Expo application composes shared Playlexi packages into one web, iOS, and
Android interface. Product behavior stays in `packages/domain`; route files
remain thin composition boundaries.

From the repository root, use `pnpm lint`, `pnpm typecheck`, `pnpm test`, and
`pnpm build:web`. Use the root `pnpm ios` and `pnpm android` commands for native
development builds. Native projects are generated and ignored rather than
edited by hand.
