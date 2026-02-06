<template>
  <main
    class="px-2 pb-4 pt-2 md:px-4 md:pb-8 md:pt-4 grow flex flex-col gap-6 relative z-[0]"
    :class="{
      [successBackground]: currentUrl && !loading && !error,
    }"
  >
    <!-- Error Message -->
    <div v-if="error" class="mb-8 p-4 bg-red-100 text-red-700 rounded-lg">
      {{ error }}
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="mb-8 p-4 bg-gray-100 text-gray-700 rounded-lg">
      {{ $t('loading') }}
    </div>

    <div
      v-if="!currentUrl"
      class="grow flex flex-col items-center justify-center text-center"
    >
      <div class="w-full max-w-2xl mx-auto space-y-6">
        <h2 class="text-xl md:text-2xl font-semibold text-gray-700">
          {{ $t('heroTitle') }}
        </h2>
        <p class="text-gray-500">
          {{ $t('heroSubtitle') }}
        </p>
        <div class="w-full" style="view-transition-name: search-form">
          <SearchForm />
        </div>
      </div>
    </div>

    <!-- URL Output -->
    <div class="grow flex flex-col">
      <!-- Reader Mode Trigger Header -->
      <div
        v-if="currentUrl && !showFallbackPrompt && !fallbackMode"
        class="mb-2 flex justify-end"
      >
        <ReaderModeTrigger />
      </div>

      <div
        v-if="currentUrl"
        class="bg-white rounded-lg shadow-lg overflow-hidden h-full grow flex flex-col"
      >
        <!-- Reader Mode View -->
        <div
          v-if="fallbackMode && articleData"
          class="container p-4 md:p-8 max-w-none prose lg:prose-xl mx-auto overflow-auto bg-white"
        >
          <div class="mb-6 border-b pb-4">
            <h1 v-if="articleData.title" class="mb-2 text-3xl font-bold">
              {{ articleData.title }}
            </h1>
            <div class="text-sm text-gray-500 flex flex-wrap gap-4">
              <span v-if="articleData.byline">By {{ articleData.byline }}</span>
              <span v-if="articleData.siteName"
                >from {{ articleData.siteName }}</span
              >
              <a
                :href="currentUrl"
                target="_blank"
                rel="noopener"
                class="text-blue-600 hover:underline"
                >Original Link</a
              >
            </div>
          </div>

          <div
            v-html="articleData.content"
            class="container mx-auto prose"
          ></div>
        </div>

        <!-- Iframe View -->
        <iframe
          v-else
          :key="currentUrl"
          :src="currentUrl"
          class="w-full h-full grow"
          ref="iframe"
          sandbox="allow-same-origin allow-forms"
          referrerpolicy="no-referrer"
          loading="lazy"
        ></iframe>
      </div>
    </div>

    <!-- Smart Prompt Modal -->
    <ReaderModePrompt
      :show="showFallbackPrompt && !fallbackMode"
      @close="dismissPrompt"
      @confirm="switchToReaderMode"
    />

    <!-- Page Too Large Modal -->
    <PageTooLargeModal
      :show="showPageTooLargeError"
      @close="dismissPageTooLargeError"
    />
  </main>
</template>

<script setup>
import { useUrlReader } from '~/composables/useUrlReader';

definePageMeta({
  title: 'IndexPage',
});

const { $t, $getLocale } = useI18n();

const {
  currentUrl,
  loading,
  error,
  title,
  hydrateFromLocation,
  fallbackMode,
  articleData,
  showFallbackPrompt,
  dismissPrompt,
  switchToReaderMode,
  showPageTooLargeError,
  dismissPageTooLargeError,
} = useUrlReader();

useHead({
  title: () => title.value || '',
  htmlAttrs: {
    lang: $getLocale(),
  },
});

const successBackground =
  'before:absolute before:inset-0 before:z-[-1] before:opacity-[.3] before:bg-[repeating-linear-gradient(45deg,_#3b82f6_25%,_transparent_25%,_transparent_75%,_#3b82f6_75%,_#3b82f6),_repeating-linear-gradient(45deg,_#3b82f6_25%,_#f3f4f6_25%,_#f3f4f6_75%,_#3b82f6_75%,_#3b82f6)] before:[background-position:0_0,_10px_10px] before:[background-size:20px_20px]';

// Handle URL params (for both navigation and PWA share target)
onMounted(() => {
  hydrateFromLocation(window.location.href);
});
</script>
