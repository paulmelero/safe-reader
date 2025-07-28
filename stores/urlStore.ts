export const useUrlStore = defineStore("urlStore", () => {
  const currentUrl = ref("");
  const urlInput = ref("");
  const loading = ref(false);
  const error = ref("");
  const title = ref("");

  const { $t } = useI18n();

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const loadUrl = async () => {
    error.value = "";

    if (!urlInput || !isValidUrl(urlInput.value)) {
      error.value = $t("errorInvalidUrl") as string;
      return;
    }
    const hostname = new URL(urlInput.value).hostname;
    title.value = $t("readingTitle", { hostname }) as string;
    loading.value = true;
    try {
      currentUrl.value = urlInput.value;
    } catch (e) {
      title.value = "";
      error.value = $t("errorFailedUrl") as string;
    } finally {
      loading.value = false;
    }
  };

  const get = (currentLocation: string) => {
    const url = new URL(currentLocation);
    // Check for params from share target API (url, title, text)
    const urlFromParams = url.searchParams.get("url");
    const textFromShareParams = url.searchParams.get("text");

    // Priority: 1. url parameter, 2. text parameter that contains a URL
    let urlToLoad = null;

    if (urlFromParams && isValidUrl(urlFromParams)) {
      urlToLoad = urlFromParams;
    } else if (textFromShareParams) {
      // Check if the text contains a URL
      const urlMatch = textFromShareParams.match(/(https?:\/\/[^\s]+)/);
      if (urlMatch && isValidUrl(urlMatch[0])) {
        urlToLoad = urlMatch[0];
      }
    }

    if (urlToLoad) {
      urlInput.value = urlToLoad;
      loadUrl();
    }
  };

  return {
    loadUrl,
    get,
    currentUrl,
    urlInput,
    loading,
    error,
    title,
  };
});
