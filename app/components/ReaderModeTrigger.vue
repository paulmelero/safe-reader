<template>
  <div class="flex items-center gap-2">
    <button
      @click="switchToReaderMode"
      class="text-sm px-3 py-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center gap-2"
      :class="{ 'opacity-50 cursor-not-allowed': isReaderLoading }"
      :disabled="isReaderLoading"
    >
      <span v-if="isReaderLoading" class="animate-spin text-xs">↻</span>
      <span v-else>📄</span>
      {{ $t('switchToReaderMode') }}
    </button>
  </div>
</template>

<script setup lang="ts">
const { switchToReaderMode, isReaderLoading } = useUrlReader();

const { $t } = useI18n();
</script>
