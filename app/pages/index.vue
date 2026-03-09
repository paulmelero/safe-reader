<template>
  <main
    class="px-2 pb-4 pt-2 md:px-4 md:pb-6 md:pt-4 grow flex flex-col gap-4 relative z-[0]"
    :class="{
      [successBackground]: isSuccessBackground,
    }"
  >
    <!-- Error Message -->
    <ErrorAlert v-if="error" :error />

    <!-- Loading State -->
    <progress
      v-if="isLoading"
      :aria-label="$t('loading')"
      class="progress w-full"
    ></progress>

    <div
      v-if="!currentUrl"
      class="grow flex flex-col items-center justify-center text-center"
    >
      <div class="w-full max-w-2xl mx-auto space-y-6">
        <h2 class="text-xl md:text-2xl font-semibold text-base-content">
          {{ $t("heroTitle") }}
        </h2>
        <p class="text-base-content/70">
          {{ $t("heroSubtitle") }}
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
        v-if="currentUrl && !shouldShowPrompt && !isReaderModeActive"
        class="mb-2 flex justify-end"
      >
        <ReaderModeTrigger />
      </div>

      <div
        v-if="currentUrl"
        class="bg-base-100 rounded-lg shadow-lg overflow-hidden h-full grow flex flex-col"
      >
        <!-- Reader Mode View -->
        <div
          v-if="hasReaderContent"
          class="container p-4 md:p-8 max-w-none prose dark:prose-invert lg:prose-xl mx-auto overflow-auto bg-base-100"
        >
          <div class="mb-6 border-b pb-4">
            <h1 v-if="articleData.title" class="mb-2 text-3xl font-bold">
              {{ articleData.title }}
            </h1>
            <div class="text-sm text-base-content/60 flex flex-wrap gap-4">
              <span v-if="articleData.byline">By {{ articleData.byline }}</span>
              <span v-if="articleData.siteName"
                >from {{ articleData.siteName }}</span
              >
              <a
                :href="currentUrl"
                target="_blank"
                rel="noopener"
                class="text-primary hover:underline"
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
      :show="shouldShowPrompt && !isReaderModeActive"
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
import { useUrlReader } from "~/composables/useUrlReader";

definePageMeta({
  title: "IndexPage",
});

const { $t, $getLocale } = useI18n();

const {
  currentUrl,
  error,
  isLoading,
  isReaderModeActive,
  shouldShowPrompt,
  hasReaderContent,
  isSuccessBackground,
  title,
  hydrateFromLocation,
  articleData,
  dismissPrompt,
  switchToReaderMode,
  showPageTooLargeError,
  dismissPageTooLargeError,
} = useUrlReader();

useHead({
  title: () => title.value || "",
  htmlAttrs: {
    lang: $getLocale(),
  },
});

const successBackground =
  "before:absolute before:inset-0 before:z-[-1] before:opacity-[.3] before:bg-[repeating-linear-gradient(45deg,_#3b82f6_25%,_transparent_25%,_transparent_75%,_#3b82f6_75%,_#3b82f6),_repeating-linear-gradient(45deg,_#3b82f6_25%,_#f3f4f6_25%,_#f3f4f6_75%,_#3b82f6_75%,_#3b82f6)] before:[background-position:0_0,_10px_10px] before:[background-size:20px_20px]";

// Handle URL params (for both navigation and PWA share target)
onMounted(() => {
  hydrateFromLocation(window.location.href);
});
</script>
