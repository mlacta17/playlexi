import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { SpellingPracticeScreen } from '../spelling-practice-screen';

describe('SpellingPracticeScreen', () => {
  it('supports recognition, retry, correction, deletion, manual entry, and submission', async () => {
    await render(<SpellingPracticeScreen />);

    await fireEvent.press(screen.getByText('Try a practice letter'));
    await fireEvent.press(await screen.findByLabelText('Accept letter C'));

    await fireEvent.press(screen.getByText('Try a practice letter'));
    await waitFor(() => {
      expect(screen.getByText(/couldn't hear one clear letter/i)).toBeOnTheScreen();
    });

    await fireEvent.press(screen.getByText('Try a practice letter'));
    await fireEvent.press(await screen.findByLabelText('Accept letter A'));
    await fireEvent.press(screen.getByText('Try a practice letter'));
    await fireEvent.press(await screen.findByLabelText('Accept letter T'));

    await fireEvent.press(screen.getByLabelText('Change letter 2'));
    await fireEvent.press(screen.getByLabelText('Use letter B'));
    await fireEvent.press(screen.getByLabelText('Change letter 2'));
    await fireEvent.press(screen.getByLabelText('Use letter A'));

    await fireEvent.press(screen.getByLabelText('Delete letter 3'));
    await fireEvent.press(screen.getByText('Enter a letter manually'));
    await fireEvent.press(screen.getByLabelText('Use letter T'));
    await fireEvent.press(screen.getByText('Check my spelling'));

    expect(screen.getByText('Nice work!')).toBeOnTheScreen();
    expect(screen.getByText('You spelled C–A–T.')).toBeOnTheScreen();
  });
});
