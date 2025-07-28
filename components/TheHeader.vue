<template>
  <header class="bg-white shadow-sm">
    <div class="px-4 gap-4 py-4 flex items-center justify-between max-w-full">
      <h1 class="md:text-2xl font-bold text-gray-800 text-nowrap">
        <span class="text-blue-500">[SAFE]</span> Reader
      </h1>

      <!-- URL Input Form -->
      <form @submit.prevent="urlStore.loadUrl" class="w-full">
        <div class="flex gap-4">
          <input
            v-model="urlInput"
            type="url"
            :placeholder="$t('inputPlaceholder')"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {{ $t("loadButton") }}
          </button>
        </div>
      </form>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useUrlStore } from "~/stores/urlStore";

const urlStore = useUrlStore();
const { urlInput } = storeToRefs(urlStore);

const { $t } = useI18n();
</script>
