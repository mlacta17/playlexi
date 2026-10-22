# Development environment

**Last checked:** 2026-10-21
**Status:** Web prerequisites available; native first-run setup incomplete

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
| Xcode | 27.1, build 27A9275 | Application is updated, but the Apple license has not been accepted |
| Command Line Tools | 26.6.0.0.1781586589 | Installed |
| Xcode SDK/simulator checks | Blocked by the unaccepted license; `xcodebuild -showsdks` also reports a CoreDevice library-loading error before first-run completion | Recheck after Xcode completes license/components setup |
| Android Studio | 2026.2, build AI-262.9437.185.2621.16467767 | Application is installed |
| Android Studio bundled JDK | OpenJDK 25.0.3 | Available inside Android Studio; project compatibility remains to be verified |
| Android SDK | No `~/Library/Android/sdk` directory observed | Android Studio setup wizard has not installed the SDK |
| Android Debug Bridge | `adb` not found | Platform tools are not installed or not on PATH |

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

Xcode 27.1 is installed. The owner must:

1. launch Xcode;
2. accept Apple's license;
3. allow requested platform components to finish installing; and
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

Android Studio 2026.2 is installed. The owner must launch it and complete its
setup wizard, including the Android SDK, platform tools, emulator, and at least
one supported system image. Then record:

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
