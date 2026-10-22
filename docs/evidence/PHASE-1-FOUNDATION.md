# Phase 1 foundation evidence

**Recorded:** 2026-10-22
**Scope:** deterministic spelling flow only; no microphone or recognizer

## What was proved

- The same strict TypeScript domain state machine drives the universal client.
- A deterministic fake recognizer exercises accepted, ambiguous, retry, manual
  correction, deletion, and completed-word behavior.
- Validated local fixtures provide the words CAT, MAP, and SUN.
- The production web export succeeds.
- The native project builds install and open on an iPhone simulator and Android
  emulator, including self-contained release builds that do not require Metro.

## Automated results

| Check | Result |
| --- | --- |
| Frozen dependency install | Passed the 24-hour package-age policy; 1,028 lockfile entries verified |
| Expo dependency compatibility | All dependencies match Expo SDK 58 |
| Lint | Passed |
| Strict TypeScript | Passed across all workspaces |
| Unit and component tests | 5 suites, 13 tests passed |
| Static web export | Passed; three routes exported |
| iOS simulator | Debug build passed with 0 errors and 0 warnings; Release build, direct relaunch, and rendered-screen check passed |
| Android emulator | Debug and self-contained release builds passed; release screen rendered after install |

The iOS Release build embedded its JavaScript and assets, installed on an
iPhone 16 Pro simulator, and built with 0 errors. After the Expo command exited,
the app was terminated and launched directly through the simulator. The initial
screen rendered without Metro. Expo summarized one build warning; the detailed
log shows it came from generated bundling output and upstream Expo headers, not
first-party Playlexi source.

The Android output contains upstream deprecation warnings from Expo and React
Native packages. They do not originate in first-party Playlexi source and are
recorded for dependency-upgrade review.

The Android release build completed 566 tasks and bundled its JavaScript and
assets into the APK. The initial screen rendered correctly without Metro or
network access. A subsequent interaction attempt exposed an Android emulator
system-process hang after the resource-heavy build; no Playlexi crash appeared
in the device log. Interaction behavior remains covered by the component test,
and physical-device evidence is intentionally deferred to the capture phase.

## Reproduction boundary

Use the pinned Node and pnpm versions and the committed lockfile. Run
`pnpm prepare:ios` before the iOS command when the checkout remains under the
macOS Documents file-provider location. Generated `ios/`, `android/`, web
output, and native caches are intentionally ignored.

Real-device audio is not part of this evidence. Phase 2 must choose and verify
capture APIs before any speech-engine experiment begins.
