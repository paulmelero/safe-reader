<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-between">
    <!-- Header -->
    <TheHeader @load="loadUrl" v-model="urlInput" />

    <div class="px-4 pb-8 grow flex flex-col justify-between">
      <!-- Error Message -->
      <div v-if="error" class="mb-8 p-4 bg-red-100 text-red-700 rounded-lg">
        {{ error }}
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="mb-8 p-4 bg-gray-100 text-gray-700 rounded-lg">
        Loading URL...
      </div>

      <!-- URL Display -->
      <div
        v-if="currentUrl"
        class="bg-white rounded-lg shadow-lg overflow-hidden h-full grow flex flex-col justify-between"
      >
        <div class="p-4 bg-gray-50 border-b grid grid-cols-[1fr,auto] gap-4">
          <p class="text-gray-600 min-w-max">Currently viewing:</p>
          <output
            class="text-gray-800 font-medium overflow-auto whitespace-nowrap"
            >{{ currentUrl }}</output
          >
        </div>
        <div class="w-full h-full grow flex flex-col justify-between">
          <iframe
            :key="currentUrl"
            :src="currentUrl"
            class="w-full h-full grow"
            sandbox="allow-same-origin allow-forms"
            referrerpolicy="no-referrer"
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const urlInput = ref("");
const currentUrl = ref("");
const loading = ref(false);
const error = ref("");

// Function to validate URL
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Function to load URL
const loadUrl = async () => {
  error.value = "";

  if (!isValidUrl(urlInput.value)) {
    error.value = "Please enter a valid URL";
    return;
  }

  loading.value = true;
  try {
    currentUrl.value = urlInput.value;
  } catch (e) {
    error.value = "Failed to load URL";
  } finally {
    loading.value = false;
  }
};

// Handle URL params (for both navigation and PWA share target)
onMounted(() => {
  const url = new URL(window.location.href);
  // Check for params from share target API (url, title, text)
  const sharedUrl = url.searchParams.get("url");
  const sharedText = url.searchParams.get("text");

  // Priority: 1. url parameter, 2. text parameter that contains a URL
  let urlToLoad = null;

  if (sharedUrl && isValidUrl(sharedUrl)) {
    urlToLoad = sharedUrl;
  } else if (sharedText) {
    // Check if the text contains a URL
    const urlMatch = sharedText.match(/(https?:\/\/[^\s]+)/);
    if (urlMatch && isValidUrl(urlMatch[0])) {
      urlToLoad = urlMatch[0];
    }
  }

  if (urlToLoad) {
    urlInput.value = urlToLoad;
    loadUrl();
  }
});
</script>
