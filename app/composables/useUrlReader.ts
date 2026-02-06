import { computed, nextTick } from 'vue';
import { runViewTransition } from '~/utils/runViewTransition';

type LoadOptions = {
  animate?: boolean;
};

type ReaderPhase =
  | 'idle'
  | 'validating'
  | 'navigating'
  | 'ready'
  | 'frameBlocked'
  | 'readerLoading'
  | 'readerReady'
  | 'readerError';

type ReaderErrorCode =
  | 'invalidUrl'
  | 'navigationFailed'
  | 'readerTimeout'
  | 'readerTooLarge'
  | 'readerFailed';

type ReaderStatus = {
  phase: ReaderPhase;
  errorCode: ReaderErrorCode | null;
  message: string;
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
  const title = useState<string>('url-reader:title', () => '');
  const status = useState<ReaderStatus>('url-reader:status', () => ({
    phase: 'idle',
    errorCode: null,
    message: '',
  }));
  const articleData = useState<any | null>(
    'url-reader:article-data',
    () => null,
  );
  const { $t } = useI18n();
  const router = useRouter();
  const { checkFrameAccess: checkFrameAccessApi, fetchReaderMode } =
    useServerReaderMode();

  const setStatus = (next: Partial<ReaderStatus>) => {
    status.value = {
      ...status.value,
      ...next,
    };
  };

  const error = computed(() => status.value.message);
  const hasError = computed(
    () => Boolean(status.value.errorCode) || Boolean(status.value.message),
  );
  const isLoading = computed(() =>
    ['validating', 'navigating', 'readerLoading'].includes(status.value.phase),
  );
  const isReaderLoading = computed(
    () => status.value.phase === 'readerLoading',
  );
  const isReaderModeActive = computed(() =>
    ['readerLoading', 'readerReady'].includes(status.value.phase),
  );
  const shouldShowPrompt = computed(
    () => status.value.phase === 'frameBlocked',
  );
  const showPageTooLargeError = computed(
    () => status.value.errorCode === 'readerTooLarge',
  );
  const hasReaderContent = computed(
    () => status.value.phase === 'readerReady' && Boolean(articleData.value),
  );
  const isSuccessBackground = computed(
    () => Boolean(currentUrl.value) && !isLoading.value && !error.value,
  );

  const loadUrl = async (options: LoadOptions = { animate: true }) => {
    setStatus({
      phase: 'validating',
      errorCode: null,
      message: '',
    });
    // Reset reader mode on new URL load
    articleData.value = null;

    if (!urlInput.value || !isValidUrl(urlInput.value)) {
      setStatus({
        phase: 'idle',
        errorCode: 'invalidUrl',
        message: $t('errorInvalidUrl') as string,
      });
      return;
    }

    const targetUrl = urlInput.value;
    const hostname = new URL(targetUrl).hostname;
    title.value = $t('readingTitle', { hostname }) as string;
    setStatus({
      phase: 'navigating',
      errorCode: null,
      message: '',
    });

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
      setStatus({
        phase: 'idle',
        errorCode: 'navigationFailed',
        message: $t('errorFailedUrl') as string,
      });
    } finally {
      if (status.value.phase === 'navigating') {
        setStatus({ phase: 'ready' });
      }
    }
  };

  const checkFrameAccess = async (url: string) => {
    try {
      const { iframeLikelyBlocked: isBlocked } =
        await checkFrameAccessApi(url);

      if (isBlocked) {
        if (hasError.value) {
          return;
        }
        if (['navigating', 'ready'].includes(status.value.phase)) {
          setStatus({ phase: 'frameBlocked' });
        }
      }
    } catch (e) {
      console.warn('Frame check failed', e);
    }
  };

  const switchToReaderMode = async () => {
    if (!currentUrl.value) return;

    setStatus({
      phase: 'readerLoading',
      errorCode: null,
      message: '',
    });
    articleData.value = null;

    try {
      const data = await fetchReaderMode(currentUrl.value);
      articleData.value = data;
      if (data && data.title) {
        title.value = data.title as string;
      }
      setStatus({ phase: 'readerReady' });
    } catch (e: any) {
      console.error('Reader mode failed', e);
      const status =
        e?.response?.status ??
        e?.status ??
        e?.statusCode ??
        e?.data?.statusCode ??
        e?.data?.status;
      if (status === 413) {
        setStatus({
          phase: 'readerError',
          errorCode: 'readerTooLarge',
          message: '',
        });
      } else if (status === 408) {
        setStatus({
          phase: 'readerError',
          errorCode: 'readerTimeout',
          message: $t('errorReaderTimeout') as string,
        });
      } else {
        setStatus({
          phase: 'readerError',
          errorCode: 'readerFailed',
          message:
            ($t('errorReaderFailed') as string) ||
            'Failed to load reader mode: ' + (e.message || 'Unknown error'),
        });
      }
    } finally {
      if (status.value.phase === 'readerLoading') {
        setStatus({ phase: 'readerError' });
      }
    }
  };

  const exitReaderMode = () => {
    if (status.value.phase !== 'readerLoading') {
      setStatus({ phase: 'ready' });
    }
  };

  const dismissPrompt = () => {
    if (status.value.phase === 'frameBlocked') {
      setStatus({ phase: 'ready' });
    }
  };

  const dismissPageTooLargeError = () => {
    if (status.value.errorCode === 'readerTooLarge') {
      setStatus({
        phase: 'ready',
        errorCode: null,
        message: '',
      });
    }
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
      currentUrl.value = '';
      title.value = '';
      articleData.value = null;
      setStatus({
        phase: 'idle',
        errorCode: null,
        message: '',
      });
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
    status,
    error,
    hasError,
    isLoading,
    isReaderLoading,
    isReaderModeActive,
    shouldShowPrompt,
    showPageTooLargeError,
    hasReaderContent,
    isSuccessBackground,
    title,
    resetState,
    articleData,
    switchToReaderMode,
    exitReaderMode,
    dismissPrompt,
    dismissPageTooLargeError,
  };
};
