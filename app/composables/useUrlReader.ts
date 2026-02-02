import { nextTick } from "vue";
import { runViewTransition } from "~/utils/runViewTransition";

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
  const currentUrl = useState<string>("url-reader:current-url", () => "");
  const urlInput = useState<string>("url-reader:url-input", () => "");
  const loading = useState<boolean>("url-reader:loading", () => false);
  const error = useState<string>("url-reader:error", () => "");
  const title = useState<string>("url-reader:title", () => "");

  const { $t } = useI18n();
  const router = useRouter();

  const loadUrl = async (options: LoadOptions = { animate: true }) => {
    error.value = "";

    if (!urlInput.value || !isValidUrl(urlInput.value)) {
      error.value = $t("errorInvalidUrl") as string;
      return;
    }

    const targetUrl = urlInput.value;
    const hostname = new URL(targetUrl).hostname;
    title.value = $t("readingTitle", { hostname }) as string;
    loading.value = true;

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
      title.value = "";
      error.value = $t("errorFailedUrl") as string;
    } finally {
      loading.value = false;
    }
  };

  const hydrateFromLocation = (location: string) => {
    const url = new URL(location);
    const urlFromParams = url.searchParams.get("url");
    const textFromShareParams = url.searchParams.get("text");

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
      urlInput.value = "";
      error.value = "";
      currentUrl.value = "";
      title.value = "";
      loading.value = false;
      await nextTick();
    };

    if (shouldAnimate) {
      await runViewTransition(applyReset);
    } else {
      await applyReset();
    }

    const route = router.currentRoute.value;
    if ("url" in route.query || "text" in route.query) {
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
  };
};
