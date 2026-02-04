import { nextTick } from 'vue';
import { runViewTransition } from '~/utils/runViewTransition';

type LoadOptions = {
  animate?: boolean;
};

const isValidUrl = (value: string) => {
  try {
    return Boolean(new URL(value));
  } catch {
    return false;
  }
};

export const useUrlReader = () => {
  const currentUrl = useState<string>('url-reader:current-url', () => '');
  const urlInput = useState<string>('url-reader:url-input', () => '');
  const loading = useState<boolean>('url-reader:loading', () => false);
  const error = useState<string>('url-reader:error', () => '');
  const title = useState<string>('url-reader:title', () => '');

  // Reader Mode State
  const fallbackMode = useState<boolean>(
    'url-reader:fallback-mode',
    () => false,
  );
  const articleData = useState<any | null>(
    'url-reader:article-data',
    () => null,
  );
  const readerLoading = useState<boolean>(
    'url-reader:reader-loading',
    () => false,
  );
  const showFallbackPrompt = useState<boolean>(
    'url-reader:show-prompt',
    () => false,
  );
  const iframeLikelyBlocked = useState<boolean>(
    'url-reader:iframe-blocked',
    () => false,
  );

  const { $t } = useI18n();
  const router = useRouter();

  const loadUrl = async (options: LoadOptions = { animate: true }) => {
    error.value = '';
    // Reset reader mode on new URL load
    fallbackMode.value = false;
    articleData.value = null;
    showFallbackPrompt.value = false;
    iframeLikelyBlocked.value = false;

    if (!urlInput.value || !isValidUrl(urlInput.value)) {
      error.value = $t('errorInvalidUrl') as string;
      return;
    }

    const targetUrl = urlInput.value;
    const hostname = new URL(targetUrl).hostname;
    title.value = $t('readingTitle', { hostname }) as string;
    loading.value = true;

    // Start checking for frame blocks in parallel
    checkFrameAccess(targetUrl);

    const shouldAnimate = options.animate ?? !currentUrl.value;

    const applyNavigation = async () => {
      currentUrl.value = targetUrl;
      await nextTick();
      await router.push({ query: { url: currentUrl.value } });
    };

    try {
      if (shouldAnimate) {
        await runViewTransition(applyNavigation);
      } else {
        await applyNavigation();
      }
    } catch (e) {
      title.value = '';
      error.value = $t('errorFailedUrl') as string;
    } finally {
      loading.value = false;
    }
  };

  const checkFrameAccess = async (url: string) => {
    try {
      const { iframeLikelyBlocked: isBlocked } = await $fetch<any>(
        '/api/check-frame',
        {
          query: { url },
        },
      );

      if (isBlocked) {
        iframeLikelyBlocked.value = true;
        showFallbackPrompt.value = true;
      }
    } catch (e) {
      console.warn('Frame check failed', e);
    }
  };

  const switchToReaderMode = async () => {
    if (!currentUrl.value) return;

    fallbackMode.value = true;
    readerLoading.value = true;
    showFallbackPrompt.value = false;
    error.value = '';

    try {
      const data = await $fetch<any>('/api/reader-mode', {
        query: { url: currentUrl.value },
      });
      articleData.value = data;
      if (data && data.title) {
        title.value = data.title as string;
      }
    } catch (e: any) {
      console.error('Reader mode failed', e);
      error.value =
        ($t('errorReaderFailed') as string) ||
        'Failed to load reader mode: ' + (e.message || 'Unknown error');
      fallbackMode.value = false;
    } finally {
      readerLoading.value = false;
    }
  };

  const exitReaderMode = () => {
    fallbackMode.value = false;
  };

  const dismissPrompt = () => {
    showFallbackPrompt.value = false;
  };

  const hydrateFromLocation = (location: string) => {
    const url = new URL(location);
    const urlFromParams = url.searchParams.get('url');
    const textFromShareParams = url.searchParams.get('text');

    let urlToLoad: string | null = null;

    if (urlFromParams && isValidUrl(urlFromParams)) {
      urlToLoad = urlFromParams;
    } else if (textFromShareParams) {
      const urlMatch = textFromShareParams.match(/(https?:\/\/[^\s]+)/);
      if (urlMatch && isValidUrl(urlMatch[0])) {
        urlToLoad = urlMatch[0];
      }
    }

    if (urlToLoad) {
      urlInput.value = urlToLoad;
      loadUrl({ animate: false });
    }
  };

  const resetState = async (options: LoadOptions = { animate: true }) => {
    const shouldAnimate = options.animate ?? Boolean(currentUrl.value);

    const applyReset = async () => {
      urlInput.value = '';
      error.value = '';
      currentUrl.value = '';
      title.value = '';
      loading.value = false;
      fallbackMode.value = false;
      articleData.value = null;
      showFallbackPrompt.value = false;
      iframeLikelyBlocked.value = false;
      await nextTick();
    };

    if (shouldAnimate) {
      await runViewTransition(applyReset);
    } else {
      await applyReset();
    }

    const route = router.currentRoute.value;
    if ('url' in route.query || 'text' in route.query) {
      const nextQuery = { ...route.query } as Record<string, any>;
      delete nextQuery.url;
      delete nextQuery.text;
      await router.replace({ query: nextQuery });
    }
  };

  return {
    loadUrl,
    hydrateFromLocation,
    currentUrl,
    urlInput,
    loading,
    error,
    title,
    resetState,
    fallbackMode,
    articleData,
    readerLoading,
    switchToReaderMode,
    exitReaderMode,
    showFallbackPrompt,
    dismissPrompt,
  };
};
