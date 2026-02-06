import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useUrlReader } from '~/composables/useUrlReader';

vi.mock('~/utils/runViewTransition', () => ({
  runViewTransition: async (callback: () => Promise<void> | void) => {
    await callback();
  },
}));

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('useUrlReader', () => {
  beforeEach(() => {
    globalThis.__resetNuxtMocks?.();
  });

  it('sets an invalidUrl error for bad input', async () => {
    const { urlInput, status, error, loadUrl } = useUrlReader();
    const serverMocks = globalThis.__serverReaderModeMocks;

    urlInput.value = 'not-a-url';
    await loadUrl({ animate: false });

    expect(status.value.phase).toBe('idle');
    expect(status.value.errorCode).toBe('invalidUrl');
    expect(error.value).toBe('errorInvalidUrl');
    expect(serverMocks.checkFrameAccess).not.toHaveBeenCalled();
  });

  it('navigates and updates title for a valid URL', async () => {
    const { urlInput, currentUrl, status, title, loadUrl } = useUrlReader();
    const serverMocks = globalThis.__serverReaderModeMocks;
    const router = globalThis.useRouter();

    urlInput.value = 'https://example.com/page';
    await loadUrl({ animate: false });

    expect(currentUrl.value).toBe('https://example.com/page');
    expect(status.value.phase).toBe('ready');
    expect(status.value.errorCode).toBeNull();
    expect(title.value).toBe('readingTitle:example.com');
    expect(router.push).toHaveBeenCalledWith({
      query: { url: 'https://example.com/page' },
    });
    expect(serverMocks.checkFrameAccess).toHaveBeenCalledWith(
      'https://example.com/page',
    );
  });

  it('marks frame blocked when iframe access is denied', async () => {
    const { urlInput, status, loadUrl } = useUrlReader();
    const serverMocks = globalThis.__serverReaderModeMocks;

    serverMocks.checkFrameAccess.mockResolvedValue({
      iframeLikelyBlocked: true,
    });

    urlInput.value = 'https://example.com/frame';
    await loadUrl({ animate: false });
    await flushPromises();

    expect(status.value.phase).toBe('frameBlocked');
  });

  it('switches to reader mode and stores article data', async () => {
    const { currentUrl, status, title, articleData, switchToReaderMode } =
      useUrlReader();
    const serverMocks = globalThis.__serverReaderModeMocks;

    currentUrl.value = 'https://example.com/article';
    serverMocks.fetchReaderMode.mockResolvedValue({
      title: 'Reader Title',
      content: '<p>Reader body</p>',
    });

    await switchToReaderMode();

    expect(status.value.phase).toBe('readerReady');
    expect(title.value).toBe('Reader Title');
    expect(articleData.value).toMatchObject({
      title: 'Reader Title',
      content: '<p>Reader body</p>',
    });
  });

  it('handles reader mode 413 errors as too large', async () => {
    const { currentUrl, status, switchToReaderMode } = useUrlReader();
    const serverMocks = globalThis.__serverReaderModeMocks;

    currentUrl.value = 'https://example.com/big';
    serverMocks.fetchReaderMode.mockRejectedValue({ status: 413 });

    await switchToReaderMode();

    expect(status.value.phase).toBe('readerError');
    expect(status.value.errorCode).toBe('readerTooLarge');
  });

  it('resets state and strips url/text query params', async () => {
    const { urlInput, currentUrl, status, title, articleData, resetState } =
      useUrlReader();
    const router = globalThis.useRouter();

    urlInput.value = 'https://example.com/page';
    currentUrl.value = 'https://example.com/page';
    title.value = 'readingTitle:example.com';
    articleData.value = { title: 'Old' };
    status.value = { phase: 'ready', errorCode: null, message: '' };
    router.currentRoute.value.query = {
      url: 'https://example.com/page',
      text: 'shared',
      keep: 'ok',
    };

    await resetState({ animate: false });

    expect(urlInput.value).toBe('');
    expect(currentUrl.value).toBe('');
    expect(title.value).toBe('');
    expect(articleData.value).toBeNull();
    expect(status.value.phase).toBe('idle');
    expect(router.replace).toHaveBeenCalledWith({
      query: { keep: 'ok' },
    });
  });
});
