<template>
  <form v-bind="attrs" @submit.prevent="onSubmit" class="flex gap-4">
    <input
      v-model="urlInput"
      type="url"
      :placeholder="$t('inputPlaceholder')"
      class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primaryHover caret-primary"
      required
      :disabled="isLoading"
    />
    <button
      type="submit"
      class="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primaryHover focus:outline-none focus:ring-2 focus:ring-primaryHover disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="isLoading"
    >
      {{ isLoading ? $t("loading") : $t("loadButton") }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { useAttrs } from "vue";
import { useUrlReader } from "~/composables/useUrlReader";

defineOptions({ inheritAttrs: false });

const { $t } = useI18n();

const attrs = useAttrs();

const { urlInput, isLoading, loadUrl } = useUrlReader();

const onSubmit = () => {
  loadUrl();
};
</script>
