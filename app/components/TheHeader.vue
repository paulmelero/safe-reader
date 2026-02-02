<template>
  <header class="bg-white shadow-sm">
    <div class="px-4 gap-4 py-4 flex items-center justify-between max-w-full">
      <NuxtLink to="/" @click.native="resetState">
        <h1
          class="hidden md:block md:text-2xl font-bold text-gray-800 text-nowrap"
        >
          <span class="text-primary">[SAFE]</span>&nbsp;Reader
        </h1>
        <h1
          class="block md:hidden md:text-2xl font-bold text-gray-800 text-nowrap"
        >
          <span class="text-primary">[S]</span>&nbsp;R
        </h1>
      </NuxtLink>

      <!-- URL Input Form -->
      <div class="w-full flex justify-end">
        <div
          v-if="hasActiveUrl"
          class="w-full max-w-2xl"
          role="search"
          style="view-transition-name: search-form"
        >
          <SearchForm />
        </div>
        <div v-else class="h-12 w-full max-w-2xl" aria-hidden="true"></div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useUrlReader } from "~/composables/useUrlReader";

const { currentUrl, resetState } = useUrlReader();

const hasActiveUrl = computed(() => Boolean(currentUrl.value));
</script>
