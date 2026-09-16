# Development environment

**Last checked:** 2026-09-16
**Status:** Blocked — Apple developer toolchain requires repair or update

This document records observed local prerequisites. It is not a setup tutorial
until the toolchain has been repaired and the procedure has been reproduced.

## Observed host state

Commands were run from the new repository without modifying Xcode configuration.

| Check | Observed result | Interpretation |
| --- | --- | --- |
| `xcodebuild -version` | Reports Xcode 16.2, build 16C5032a, then fails loading `libxcodebuildLoader.dylib` because `_XPCTypeBool` is unavailable from the installed system framework | Xcode installation and host system frameworks are not currently compatible |
| `swift --version` | Fails because Xcode cannot locate Swift through a valid macOS SDK; references a missing `macosx/SDKSettings.plist` path | Swift builds cannot be trusted or run |

The failure may indicate an incomplete OS/Xcode update or incompatible selected
developer directory. That cause is a hypothesis until the installation and
`xcode-select` state are inspected after any ongoing update finishes.

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
