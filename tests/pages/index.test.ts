import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import IndexPage from '~/pages/index.vue';

const createRef = <T>(value: T) => ({ value, __v_isRef: true });

type UrlReaderState = {
  currentUrl: { value: string; __v_isRef: true };
  error: { value: string; __v_isRef: true };
  isLoading: { value: boolean; __v_isRef: true };
  isReaderModeActive: { value: boolean; __v_isRef: true };
  shouldShowPrompt: { value: boolean; __v_isRef: true };
  hasReaderContent: { value: boolean; __v_isRef: true };
  isSuccessBackground: { value: boolean; __v_isRef: true };
  title: { value: string; __v_isRef: true };
  hydrateFromLocation: ReturnType<typeof vi.fn>;
  articleData: { value: any; __v_isRef: true };
  dismissPrompt: ReturnType<typeof vi.fn>;
  switchToReaderMode: ReturnType<typeof vi.fn>;
  showPageTooLargeError: { value: boolean; __v_isRef: true };
  dismissPageTooLargeError: ReturnType<typeof vi.fn>;
};

let mockState: UrlReaderState;

const createState = (overrides: Partial<UrlReaderState> = {}) => ({
  currentUrl: createRef(''),
  error: createRef(''),
  isLoading: createRef(false),
  isReaderModeActive: createRef(false),
  shouldShowPrompt: createRef(false),
  hasReaderContent: createRef(false),
  isSuccessBackground: createRef(false),
  title: createRef(''),
  hydrateFromLocation: vi.fn(),
  articleData: createRef(null),
  dismissPrompt: vi.fn(),
  switchToReaderMode: vi.fn(),
  showPageTooLargeError: createRef(false),
  dismissPageTooLargeError: vi.fn(),
  ...overrides,
});

vi.mock('~/composables/useUrlReader', () => ({
  useUrlReader: () => mockState,
}));

const stubs = {
  SearchForm: { template: '<div data-testid="search-form-stub" />' },
  ReaderModeTrigger: { template: '<div data-testid="reader-trigger-stub" />' },
  ReaderModePrompt: { template: '<div data-testid="reader-prompt-stub" />' },
  PageTooLargeModal: { template: '<div data-testid="page-too-large-stub" />' },
};

describe('Index page', () => {
  beforeEach(() => {
    mockState = createState();
  });

  it('renders hero content when no URL is set', () => {
    render(IndexPage, { global: { stubs } });

    expect(screen.getByText('heroTitle')).toBeInTheDocument();
    expect(screen.getByTestId('search-form-stub')).toBeInTheDocument();
    expect(screen.queryByTestId('reader-trigger-stub')).not.toBeInTheDocument();
  });

  it('shows an iframe for the current URL', () => {
    mockState = createState({
      currentUrl: createRef('https://example.com'),
    });

    const { container } = render(IndexPage, { global: { stubs } });

    expect(container.querySelector('iframe')).toBeInTheDocument();
    expect(screen.getByTestId('reader-trigger-stub')).toBeInTheDocument();
  });

  it('renders reader content when available', () => {
    mockState = createState({
      currentUrl: createRef('https://example.com'),
      hasReaderContent: createRef(true),
      articleData: createRef({
        title: 'Article Title',
        byline: 'Author',
        siteName: 'Example',
        content: '<p>Reader body</p>',
      }),
    });

    const { container } = render(IndexPage, { global: { stubs } });

    expect(screen.getByText('Article Title')).toBeInTheDocument();
    expect(screen.getByText('Reader body')).toBeInTheDocument();
    expect(container.querySelector('iframe')).not.toBeInTheDocument();
  });

  it('shows the reader prompt when frame access is blocked', () => {
    mockState = createState({
      currentUrl: createRef('https://example.com'),
      shouldShowPrompt: createRef(true),
    });

    render(IndexPage, { global: { stubs } });

    expect(screen.getByTestId('reader-prompt-stub')).toBeInTheDocument();
  });
});
