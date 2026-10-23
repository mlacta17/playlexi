# Audio infrastructure

Platform capture adapters implement `@playlexi/audio-contract`. Native code uses
Expo Audio; web uses secure-context browser media APIs and an AudioWorklet.
