import { DeterministicFakeAudioCapture } from '@playlexi/audio-contract';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { MicrophoneHealthCheckScreen } from '../microphone-health-check-screen';

describe('MicrophoneHealthCheckScreen', () => {
  it('explains permission and reports sanitized health metrics', async () => {
    const capture = new DeterministicFakeAudioCapture('undetermined', [
      {
        samples: new Int16Array([0, 8_192, -8_192, 16_384]),
        sampleRate: 4,
        channels: 1,
        timestampSeconds: 0,
      },
    ]);
    await render(<MicrophoneHealthCheckScreen capture={capture} />);

    expect(await screen.findByText(/device will ask/i)).toBeOnTheScreen();
    capture.setPermission('granted');
    await fireEvent.press(screen.getByText('Allow microphone check'));
    expect(await screen.findByText(/ready for a short microphone check/i)).toBeOnTheScreen();

    await fireEvent.press(screen.getByText('Start microphone check'));
    expect(await screen.findByText('Listening now')).toBeOnTheScreen();
    await fireEvent.press(screen.getByText('Stop microphone check'));

    await waitFor(() => {
      expect(screen.getByText('Microphone signal received')).toBeOnTheScreen();
      expect(screen.getByText('4 Hz')).toBeOnTheScreen();
      expect(screen.getByText('1.00 s')).toBeOnTheScreen();
    });
  });

  it('rechecks a blocked permission after retry instead of waiting forever', async () => {
    const capture = new DeterministicFakeAudioCapture('blocked', []);
    await render(<MicrophoneHealthCheckScreen capture={capture} />);

    expect(await screen.findByText(/microphone access is blocked/i)).toBeOnTheScreen();
    capture.setPermission('granted');
    await fireEvent.press(screen.getByText('Try again'));

    expect(await screen.findByText(/ready for a short microphone check/i)).toBeOnTheScreen();
  });
});
