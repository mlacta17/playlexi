# Development environment

**Last checked:** 2026-10-21
**Status:** Web prerequisites available; iOS and Android builds blocked

This document records observed local facts. It does not install or upgrade host
software and does not select project dependency versions.

## Observed host state

| Check | Observed result | Interpretation |
| --- | --- | --- |
| macOS | 26.6.2, build 25G83 | Current host |
| Node.js | 23.11.0 | Available, but not an appropriate project pin until Expo compatibility is checked |
| Corepack | 0.32.0 | Available |
| pnpm | 11.25.0 | Available; exact project version will be pinned during scaffolding |
| Selected developer directory | `/Applications/Xcode.app/Contents/Developer` | Full Xcode path selected |
| Xcode | 16.2, build 16C5032a; `xcodebuild` fails loading required libraries | iOS builds are blocked by an incompatible/broken installation |
| Java | No runtime found | Android builds are blocked |
| Android Debug Bridge | `adb` not found | Android SDK/platform tools are not installed or not on PATH |
| Android Studio | Not present in `/Applications` | Android development environment is not installed |

The deterministic web implementation may begin after project-version
compatibility is selected. Phase 1 cannot exit until iOS and Android builds also
succeed.

## Required before scaffolding

1. Select an Expo SDK supported Node LTS version from current official Expo
   requirements.
2. Pin Node through a repository version file.
3. Pin pnpm in the root `packageManager` field and commit the lockfile.
4. Record the exact Expo, React Native, React, Expo Router, TypeScript, and test
   versions selected by the supported scaffold.
5. Avoid global CLI dependencies; invoke repository-pinned tooling.

No package should be selected solely because it has the highest version number.
Compatibility, maintenance, platform support, and required APIs are the gates.

## Required before iOS build

The installed Xcode 16.2 cannot run correctly on this host. The owner must:

1. install a current Xcode release compatible with macOS 26.6.2;
2. launch Xcode once;
3. accept the license and install requested platform components; and
4. allow these checks to pass without suppressed errors:

```bash
xcode-select -p
xcodebuild -version
xcodebuild -showsdks
swift --version
xcrun simctl list devices available
```

Then record the Xcode/Swift builds, iOS SDK, simulator runtime, physical test
device, OS version, and signing availability without account identifiers.

## Required before Android build

Install a current Android Studio/toolchain combination supported by the selected
Expo SDK. Then record:

```bash
java -version
adb version
sdkmanager --list_installed
```

Also record the JDK, Android Gradle Plugin/Gradle versions produced by the Expo
scaffold, installed SDK/platform/build-tools versions, emulator image, and
physical test device.

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
