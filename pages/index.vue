<template>
  <main
    class="px-2 pb-4 pt-2 md:px-4 md:pb-8 md:pt-4 grow flex flex-col justify-between relative z-[0]"
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
      {{ $t("loading") }}
    </div>

    <!-- URL Output -->
    <div
      v-if="currentUrl"
      class="bg-white rounded-lg shadow-lg overflow-hidden h-full grow flex flex-col justify-between"
    >
      <div class="w-full h-full grow flex flex-col justify-between">
        <iframe
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
  </main>
</template>

<script setup>
import { useUrlStore } from "~/stores/urlStore";
definePageMeta({
  title: "IndexPage",
});

const { $t, $getLocale } = useI18n();

const urlStore = useUrlStore();
const { currentUrl, loading, error, title } = storeToRefs(urlStore);

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
  urlStore.get(window.location.href);
});
</script>
