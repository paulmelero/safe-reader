<template>
  <article class="flex flex-col gap-4">
    <h1 class="text-3xl font-semibold text-base-content">
      {{ title }}
    </h1>
    <p
      v-for="(paragraph, index) in paragraphs"
      :key="index"
      class="text-base-content/70"
    >
      {{ paragraph }}
    </p>
  </article>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  paragraphs: {
    type: Array,
    default: () => [],
  },
});
</script>
