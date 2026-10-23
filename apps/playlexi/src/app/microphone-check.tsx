import { MicrophoneHealthCheckScreen } from '@/features/audio-capture/microphone-health-check-screen';
// Metro resolves this contract to the .native or .web implementation.
// eslint-disable-next-line import/no-unresolved
import { useAudioCapture } from '@/infrastructure/audio/use-audio-capture';
import { useRouter } from 'expo-router';

export default function MicrophoneCheckRoute() {
  const capture = useAudioCapture();
  const router = useRouter();
  return <MicrophoneHealthCheckScreen capture={capture} onExit={() => router.back()} />;
}
