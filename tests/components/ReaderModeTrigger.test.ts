import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import ReaderModeTrigger from '~/components/ReaderModeTrigger.vue';

const createRef = <T>(value: T) => ({ value, __v_isRef: true });

let mockState: {
  switchToReaderMode: ReturnType<typeof vi.fn>;
  isReaderLoading: { value: boolean; __v_isRef: true };
};

const mountState = () => {
  (globalThis as any).useUrlReader = () => mockState;
};

describe('ReaderModeTrigger', () => {
  beforeEach(() => {
    mockState = {
      switchToReaderMode: vi.fn(),
      isReaderLoading: createRef(false),
    };
    mountState();
  });

  it('triggers reader mode on click', async () => {
    const user = userEvent.setup();

    render(ReaderModeTrigger);

    const button = screen.getByRole('button', {
      name: /switchToReaderMode/i,
    });

    await user.click(button);

    expect(mockState.switchToReaderMode).toHaveBeenCalledTimes(1);
    expect(button).not.toBeDisabled();
  });

  it('disables the button and shows a spinner while loading', () => {
    mockState.isReaderLoading.value = true;

    render(ReaderModeTrigger);

    const button = screen.getByRole('button', {
      name: /switchToReaderMode/i,
    });

    expect(button).toBeDisabled();
    expect(screen.getByText('↻')).toBeInTheDocument();
  });
});
