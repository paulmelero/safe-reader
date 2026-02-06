import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import SearchForm from '~/components/SearchForm.vue';

const createRef = <T>(value: T) => ({ value, __v_isRef: true });

let mockState: {
  urlInput: { value: string; __v_isRef: true };
  isLoading: { value: boolean; __v_isRef: true };
  loadUrl: ReturnType<typeof vi.fn>;
};

vi.mock('~/composables/useUrlReader', () => ({
  useUrlReader: () => mockState,
}));

describe('SearchForm', () => {
  beforeEach(() => {
    mockState = {
      urlInput: createRef(''),
      isLoading: createRef(false),
      loadUrl: vi.fn(),
    };
  });

  it('updates the url input and submits', async () => {
    const user = userEvent.setup();

    render(SearchForm);

    const input = screen.getByPlaceholderText('inputPlaceholder');
    const button = screen.getByRole('button', { name: 'loadButton' });

    await user.type(input, 'https://example.com');
    await user.click(button);

    expect(mockState.urlInput.value).toBe('https://example.com');
    expect(mockState.loadUrl).toHaveBeenCalledTimes(1);
  });

  it('disables input and button while loading', () => {
    mockState.isLoading.value = true;

    render(SearchForm);

    const input = screen.getByPlaceholderText('inputPlaceholder');
    const button = screen.getByRole('button', { name: 'loading' });

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });
});
