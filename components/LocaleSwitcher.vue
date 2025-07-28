<template>
  <div>
    <button
      v-if="$getLocale() !== 'en'"
      @click="$switchLocale('en')"
      :aria-label="$t('langEnglish')"
    >
      🇬🇧
    </button>
    <button
      v-if="$getLocale() !== 'es'"
      @click="$switchLocale('es')"
      :aria-label="$t('langSpanish')"
    >
      🇪🇸
    </button>
  </div>
</template>

<script setup lang="ts">
const { $t, $switchLocale, $getLocale } = useI18n();
</script>
