# Development environment

**Last checked:** 2026-09-16
**Status:** Blocked — Apple developer toolchain requires repair or update

This document records observed local prerequisites. It is not a setup tutorial
until the toolchain has been repaired and the procedure has been reproduced.

## Observed host state

Commands were run from the new repository without modifying Xcode configuration.

| Check | Observed result | Interpretation |
| --- | --- | --- |
| `sw_vers` | macOS 26.6.2, build 25G83 | Host meets Apple's published requirement for Xcode 27 |
| `xcode-select -p` | `/Applications/Xcode.app/Contents/Developer` | The full Xcode installation is already selected; this is not a Command Line Tools path-selection error |
| `xcodebuild -version` | Reports Xcode 16.2, build 16C5032a, then fails loading `libxcodebuildLoader.dylib` because `_XPCTypeBool` is unavailable from the installed system framework | Xcode 16.2 is incompatible with this host OS; Apple lists its supported range as macOS 14.5 through macOS 15.x |
| `swift --version` | Fails because Xcode cannot locate Swift through a valid macOS SDK; references a missing `macosx/SDKSettings.plist` path | Swift builds cannot be trusted or run |
| Command Line Tools package | 16.2.0.0.1.1733547573 | Command Line Tools are also from the incompatible Xcode generation |

Apple's current compatibility table lists Xcode 27 for macOS 26.6 or later, with
device support for iOS 17 or later. Installing the current stable Xcode 27 is the
preferred repair because it matches this host and supports the intended iOS 26
validation device. Source checked 2026-09-16:
<https://developer.apple.com/xcode/system-requirements>.

## Required owner action

1. Update Xcode through the Mac App Store, or install the current stable Xcode
   27 from Apple Developer Downloads.
2. Launch the new Xcode once.
3. Accept any license prompt and allow requested platform components to finish
   installing.
4. Return to this repository and rerun the verification below.

Do not download an older Xcode 16 release. It does not support this host OS or
the iOS 26 SDK needed for the selected validation direction.

## Required before project generation

All checks must succeed without suppressed errors:

```bash
xcode-select -p
xcodebuild -version
xcodebuild -showsdks
swift --version
xcrun simctl list devices available
```

Then record:

- macOS version and build;
- Xcode version and build;
- Swift version;
- installed iOS SDK versions;
- available simulator runtimes;
- physical target iPhone model and exact iOS version;
- Apple Developer signing availability, without recording account identifiers.

The selected Xcode/iOS deployment target must be written into an ADR when these
facts are known. Do not assume that an API present in current online documentation
exists in the installed SDK.

## Repair boundary

Repairing or updating Xcode changes host software and may require a large download,
administrator approval, license acceptance, or a restart. It is not performed as
an implicit repository setup step. The owner must explicitly authorize it.

After repair, replace this status with verified output summaries and add the
reproducible project-generation/build/test commands.
