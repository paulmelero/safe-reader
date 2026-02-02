<template>
  <div class="flex gap-2">
    <button
      v-for="locale in locales"
      :key="locale.code"
      @click="switchLocale(locale.code)"
      :aria-label="$t(locale.labelKey)"
      :disabled="$getLocale() === locale.code"
      class="rounded-full p-2 transition-opacity"
      :class="{
        'cursor-default opacity-50': $getLocale() === locale.code,
        'hover:opacity-80': $getLocale() !== locale.code,
      }"
    >
      {{ locale.flag }}
    </button>
  </div>
</template>

<script setup lang="ts">
const { $t, $switchLocale, $getLocale } = useI18n();

const locales = [
  { code: "en", labelKey: "langEnglish", flag: "🇬🇧" },
  { code: "es", labelKey: "langSpanish", flag: "🇪🇸" },
] as const;

const switchLocale = (code: (typeof locales)[number]["code"]) => {
  if ($getLocale() === code) {
    return;
  }

  $switchLocale(code);
};
</script>
