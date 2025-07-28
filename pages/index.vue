<template>
  <main class="px-4 pb-8 pt-4 grow flex flex-col justify-between">
    <!-- Error Message -->
    <div v-if="error" class="mb-8 p-4 bg-red-100 text-red-700 rounded-lg">
      {{ error }}
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="mb-8 p-4 bg-gray-100 text-gray-700 rounded-lg">
      Loading URL...
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

const urlStore = useUrlStore();
const { currentUrl, loading, error, title } = storeToRefs(urlStore);

useHead({
  title: () => title.value || "",
});

// Handle URL params (for both navigation and PWA share target)
onMounted(() => {
  urlStore.get(window.location.href);
});
</script>
