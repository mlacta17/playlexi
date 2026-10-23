import { SpellingPracticeScreen } from '@/features/spelling/spelling-practice-screen';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  return <SpellingPracticeScreen onOpenMicrophoneCheck={() => router.push('./microphone-check')} />;
}
