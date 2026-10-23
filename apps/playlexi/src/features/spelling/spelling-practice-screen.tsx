import {
  createSpellingSession,
  LETTERS,
  transitionSpellingSession,
  type Letter,
  type RecognitionRejection,
} from '@playlexi/domain';
import {
  DeterministicFakeLetterRecognizer,
  type LetterRecognitionResult,
} from '@playlexi/speech-contract';
import { BUNDLED_WORDS } from '@playlexi/test-fixtures';
import { useReducer, useRef } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PRACTICE_SCRIPT: readonly LetterRecognitionResult[] = [
  { kind: 'recognized', candidates: [{ letter: 'C', confidence: 0.91 }, { letter: 'K' }] },
  { kind: 'ambiguous' },
  { kind: 'recognized', candidates: [{ letter: 'A', confidence: 0.88 }, { letter: 'H' }] },
  { kind: 'recognized', candidates: [{ letter: 'T', confidence: 0.93 }, { letter: 'D' }] },
];

function getPracticeWord() {
  const word = BUNDLED_WORDS[0];
  if (word === undefined) {
    throw new Error('Playlexi requires at least one validated bundled word.');
  }
  return word;
}

const PRACTICE_WORD = getPracticeWord();

export function SpellingPracticeScreen({
  onOpenMicrophoneCheck,
}: {
  readonly onOpenMicrophoneCheck?: () => void;
} = {}) {
  const [session, dispatch] = useReducer(
    transitionSpellingSession,
    PRACTICE_WORD,
    createSpellingSession,
  );
  const recognizer = useRef(new DeterministicFakeLetterRecognizer(PRACTICE_SCRIPT));
  const isFull = session.acceptedLetters.length === session.word.letters.length;

  async function beginRecognition() {
    const attemptNumber = session.attemptNumber + 1;
    dispatch({ type: 'BEGIN_RECOGNITION' });
    const result = await recognizer.current.recognize({ attemptNumber });

    if (result.kind === 'recognized') {
      dispatch({
        type: 'RECEIVE_CANDIDATES',
        attemptNumber,
        candidates: result.candidates.map((candidate) => candidate.letter),
      });
      return;
    }

    dispatch({
      type: 'RECEIVE_REJECTION',
      attemptNumber,
      reason: result.kind satisfies RecognitionRejection,
    });
  }

  function resetPractice() {
    recognizer.current.reset();
    dispatch({ type: 'RESET' });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.content}>
          <Text style={styles.eyebrow}>DETERMINISTIC PRACTICE</Text>
          <Text accessibilityRole="header" style={styles.title}>
            Spell “{session.word.prompt}”
          </Text>
          <Text style={styles.instructions}>
            This phase uses a scripted recognizer—no microphone or voice recording yet.
          </Text>
          {onOpenMicrophoneCheck !== undefined ? (
            <SecondaryButton label="Open microphone health check" onPress={onOpenMicrophoneCheck} />
          ) : null}

          <View accessibilityLabel="Your spelling" style={styles.letterRow}>
            {session.word.letters.map((_, index) => {
              const letter = session.acceptedLetters[index];
              return (
                <View key={index} style={styles.letterColumn}>
                  <View style={[styles.letterSlot, letter !== undefined && styles.filledSlot]}>
                    <Text style={styles.letterText}>{letter ?? '–'}</Text>
                  </View>
                  {letter !== undefined && session.status === 'ready' ? (
                    <View style={styles.letterActions}>
                      <SmallButton
                        label={`Change letter ${index + 1}`}
                        text="Change"
                        onPress={() => dispatch({ type: 'START_CORRECTION', index })}
                      />
                      <SmallButton
                        label={`Delete letter ${index + 1}`}
                        text="Delete"
                        onPress={() => dispatch({ type: 'DELETE_LETTER', index })}
                      />
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>

          {session.notice !== null ? (
            <Text accessibilityLiveRegion="polite" style={styles.notice}>
              {session.notice}
            </Text>
          ) : null}
          {session.lastError !== null ? (
            <Text accessibilityLiveRegion="assertive" style={styles.error}>
              {session.lastError}
            </Text>
          ) : null}

          {session.status === 'ready' && !isFull ? (
            <View style={styles.actionStack}>
              <PrimaryButton label="Try a practice letter" onPress={beginRecognition} />
              <SecondaryButton
                label="Enter a letter manually"
                onPress={() => dispatch({ type: 'START_MANUAL_ENTRY' })}
              />
            </View>
          ) : null}

          {session.status === 'recognizing' ? (
            <Text accessibilityLiveRegion="polite" style={styles.notice}>
              Checking the scripted result…
            </Text>
          ) : null}

          {session.status === 'reviewing' ? (
            <View style={styles.panel}>
              <Text accessibilityRole="header" style={styles.panelTitle}>
                What did you say?
              </Text>
              <View style={styles.candidateRow}>
                {session.candidates.map((letter) => (
                  <LetterButton
                    key={letter}
                    letter={letter}
                    label={`Accept letter ${letter}`}
                    onPress={() => dispatch({ type: 'ACCEPT_CANDIDATE', letter })}
                  />
                ))}
              </View>
              <SecondaryButton label="Try again" onPress={() => dispatch({ type: 'RETRY' })} />
              <SecondaryButton
                label="Choose another letter"
                onPress={() => dispatch({ type: 'START_MANUAL_ENTRY' })}
              />
            </View>
          ) : null}

          {session.status === 'manualEntry' ? (
            <View style={styles.panel}>
              <Text accessibilityRole="header" style={styles.panelTitle}>
                Choose a letter
              </Text>
              <View style={styles.alphabetGrid}>
                {LETTERS.map((letter) => (
                  <LetterButton
                    compact
                    key={letter}
                    letter={letter}
                    label={`Use letter ${letter}`}
                    onPress={() => dispatch({ type: 'CHOOSE_MANUAL_LETTER', letter })}
                  />
                ))}
              </View>
              <SecondaryButton
                label="Cancel"
                onPress={() => dispatch({ type: 'CANCEL_MANUAL_ENTRY' })}
              />
            </View>
          ) : null}

          {session.status === 'ready' && isFull ? (
            <PrimaryButton label="Check my spelling" onPress={() => dispatch({ type: 'SUBMIT' })} />
          ) : null}

          {session.status === 'completed' ? (
            <View accessibilityLiveRegion="polite" style={styles.resultCard}>
              <Text accessibilityRole="header" style={styles.resultTitle}>
                {session.result === 'correct' ? 'Nice work!' : 'Almost there'}
              </Text>
              <Text style={styles.resultText}>
                You spelled {session.acceptedLetters.join('–')}.
              </Text>
              <PrimaryButton label="Practice again" onPress={resetPractice} />
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface ButtonProps {
  readonly label: string;
  readonly onPress: (event: GestureResponderEvent) => void;
}

function PrimaryButton({ label, onPress }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
    >
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}

function SecondaryButton({ label, onPress }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
    >
      <Text style={styles.secondaryButtonText}>{label}</Text>
    </Pressable>
  );
}

function SmallButton({ label, text, onPress }: ButtonProps & { readonly text: string }) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.smallButton, pressed && styles.pressed]}
    >
      <Text style={styles.smallButtonText}>{text}</Text>
    </Pressable>
  );
}

function LetterButton({
  compact = false,
  label,
  letter,
  onPress,
}: ButtonProps & { readonly compact?: boolean; readonly letter: Letter }) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.letterButton,
        compact && styles.compactLetterButton,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.letterButtonText}>{letter}</Text>
    </Pressable>
  );
}

const colors = {
  background: '#FFF8EE',
  card: '#FFFFFF',
  ink: '#17223B',
  muted: '#586174',
  primary: '#5B3FD0',
  primaryDark: '#3E2998',
  soft: '#EEE9FF',
  success: '#DCF7E8',
  warning: '#FFF1C2',
  error: '#9F1D2F',
  border: '#D8D3C8',
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  page: { flexGrow: 1, alignItems: 'center', padding: 20 },
  content: { width: '100%', maxWidth: 620, gap: 18 },
  eyebrow: { color: colors.primaryDark, fontSize: 13, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: colors.ink, fontSize: 36, fontWeight: '800', lineHeight: 42 },
  instructions: { color: colors.muted, fontSize: 17, lineHeight: 25 },
  letterRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, flexWrap: 'wrap' },
  letterColumn: { alignItems: 'center', gap: 6 },
  letterSlot: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 2,
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
  filledSlot: { backgroundColor: colors.success, borderColor: colors.primary },
  letterText: { color: colors.ink, fontSize: 32, fontWeight: '800' },
  letterActions: { gap: 4 },
  actionStack: { gap: 10 },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    minHeight: 54,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.primary,
    borderRadius: 14,
    borderWidth: 2,
    minHeight: 50,
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  secondaryButtonText: { color: colors.primaryDark, fontSize: 16, fontWeight: '700' },
  smallButton: { minHeight: 32, justifyContent: 'center', paddingHorizontal: 6 },
  smallButtonText: { color: colors.primaryDark, fontSize: 12, fontWeight: '700' },
  notice: { backgroundColor: colors.warning, borderRadius: 12, color: colors.ink, fontSize: 16, padding: 14 },
  error: { color: colors.error, fontSize: 15, fontWeight: '700' },
  panel: { backgroundColor: colors.card, borderRadius: 18, gap: 14, padding: 18 },
  panelTitle: { color: colors.ink, fontSize: 22, fontWeight: '800' },
  candidateRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  alphabetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  letterButton: {
    alignItems: 'center',
    backgroundColor: colors.soft,
    borderColor: colors.primary,
    borderRadius: 14,
    borderWidth: 2,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  compactLetterButton: { height: 48, width: 48 },
  letterButtonText: { color: colors.primaryDark, fontSize: 24, fontWeight: '800' },
  resultCard: { backgroundColor: colors.success, borderRadius: 18, gap: 12, padding: 20 },
  resultTitle: { color: colors.ink, fontSize: 28, fontWeight: '800' },
  resultText: { color: colors.ink, fontSize: 18 },
  pressed: { opacity: 0.72 },
});
