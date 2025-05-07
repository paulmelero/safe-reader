<template>
  <header class="bg-white shadow-sm">
    <div class="px-4 py-4 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">Safe Reader</h1>

      <!-- URL Input Form -->
      <form @submit.prevent="loadUrl" class="flex-1 max-w-3xl ml-8">
        <div class="flex gap-4">
          <input
            v-model="modelValue"
            type="url"
            placeholder="Enter URL to view"
            class="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Load
          </button>
        </div>
      </form>
    </div>
  </header>
</template>

<script setup lang="ts">
const modelValue = defineModel<string>();

const emit = defineEmits<{
  (e: "load", url: string): void;
}>();

const loadUrl = () => {
  if (modelValue.value) {
    emit("load", modelValue.value);
  }
};
</script>
