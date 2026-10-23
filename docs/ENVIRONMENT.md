# Development environment

**Last checked:** 2026-10-23
**Status:** Web baseline plus iOS and Android Phase 2 development builds verified

This document records observed local facts. It does not install or upgrade host
software and does not select project dependency versions.

## Observed host state

| Check | Observed result | Interpretation |
| --- | --- | --- |
| macOS | 26.6.2, build 25G83 | Current host |
| Node.js | 24.22.1 through the project NVM runtime | Exact project pin verified per ADR-007; the system default remains outside project control |
| Corepack | 0.32.0 | Available |
| pnpm | 11.25.0 | Selected project package manager per ADR-007 |
| Selected developer directory | `/Applications/Xcode.app/Contents/Developer` | Full Xcode path selected |
| Xcode | 27.1, build 27A9275 | Verified |
| Command Line Tools | 26.6.0.0.1781586589 | Installed |
| Xcode system resources | 27.1.0.0.1790739719; CoreDevice 651.13.5 | Stale Xcode 16.2 system resources were replaced successfully |
| Swift | 6.4, targeting arm64 macOS 27 | Verified |
| iOS SDK | iOS 27.1 and iOS Simulator 27.1 SDKs | Verified |
| Available iOS simulator runtime | iOS 18.3.1 with iPhone 16-family devices | Sufficient for initial deterministic builds; add a newer runtime only if selected support policy requires it |
| CocoaPods | 1.17.0 under the current user's Homebrew Ruby gem directory | Verified without changing the older root-owned Homebrew Ruby directory |
| Physical iPhone | Not visible during verification | Connect and pair before real-device capture validation |
| Android Studio | 2026.2, build AI-262.9437.185.2621.16467767 | Application is installed |
| Android Studio bundled JDK | OpenJDK 25.0.3 | Verified by the generated Android build |
| Android SDK | `~/Library/Android/sdk`; platform and sources 37.0; build tools 37.0.0 | Verified by the generated Android build |
| Android Debug Bridge | 1.0.41 / 37.0.1 at `~/Library/Android/sdk/platform-tools/adb` | Installed but not currently on the interactive shell PATH |
| Android emulator | Installed with Android 37 Google Play arm64 image | Verified |
| Android virtual device | `Medium_Phone_API_37.0` | Available for Phase 1 |

The deterministic implementation uses the versions accepted in ADR-007. The
Phase 2 source passed lint, strict type checking, 9 test suites with 22 tests,
and a four-route production web export under the exact pinned runtime on
2026-10-23.

## Selected scaffolding baseline

1. Node.js 24.22.1 LTS, pinned through repository version files.
2. pnpm 11.25.0, pinned in the root `packageManager` field.
3. Expo SDK 58 with its supported React Native 0.88, React 19.3.0, and React
   Native Web 0.21.0 baseline.
4. Jest 30, `jest-expo`, and React Native Testing Library 14 or newer.
5. Repository-pinned tooling only; no global Expo CLI dependency.

No package should be selected solely because it has the highest version number.
Compatibility, maintenance, platform support, and required APIs are the gates.

## Verified iOS baseline

These checks now succeed:

```bash
xcode-select -p
xcodebuild -version
xcodebuild -showsdks
swift --version
xcrun simctl list devices available
```

The deterministic application built, installed, and opened on an iPhone 16 Pro
simulator. Because this checkout is in a file-provider-managed Documents folder,
run `pnpm prepare:ios` before a clean iOS build and set
`EXPO_CUSTOM_BUILD_ROOT=/private/tmp/playlexi-expo-jsi` for the Expo command.
The preparation keeps the package's `Products` directory real for CocoaPods
discovery while linking only the generated ExpoModulesJSI XCFramework to the
temporary cache. This prevents file-provider metadata from breaking framework
generation or code signing.

Before real-device capture validation, connect and pair the target iPhone,
record its model and OS, and verify signing without recording account
identifiers.

## Verified Android baseline

Android Studio, its bundled JDK, the SDK, platform tools, emulator, system image,
and one virtual device are installed. The tools currently require explicit paths
because Android environment variables and the platform-tools PATH entry are not
configured in the shell.

During scaffolding, record:

```bash
"/Applications/Android Studio.app/Contents/jbr/Contents/Home/bin/java" -version
"$HOME/Library/Android/sdk/platform-tools/adb" version
"$HOME/Library/Android/sdk/emulator/emulator" -list-avds
```

The generated Expo project used Gradle 9.4.1, compile SDK 37, target SDK 36,
minimum SDK 24, NDK 27.1.12297006, and Kotlin 2.2.10. It built, installed, and
opened on the `Medium_Phone_API_37.0` emulator. The Phase 2 microphone prompt and
three-second capture lifecycle also completed there. The emulator's virtual
microphone returned silence, so a physical device is still required for signal
quality or recognition claims. Upstream Expo and React Native dependencies
emitted deprecation warnings; the build itself completed successfully.

Do not invent `JAVA_HOME`, Android SDK paths, or Gradle versions before the
supported Expo toolchain is selected.

## Required before web validation

Record:

- Node and pnpm versions from the pinned repository configuration;
- successful development, production build, test, and typecheck commands;
- exact Chrome, Safari, Firefox, and Edge versions in the supported matrix;
- HTTPS/localhost microphone permission behavior; and
- AudioWorklet and model-delivery requirements if speech work reaches the web.

## Host-change boundary

Installing or upgrading Xcode, Android Studio, a JDK, SDKs, simulators, or
emulators changes host software and may require large downloads, administrator
approval, licenses, or restarts. Perform those changes only with explicit owner
authorization.
