<template>
  <main class="flex grow flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
    <section class="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <h1 class="text-3xl font-semibold text-gray-800">{{ aboutTitle }}</h1>
      <p
        v-for="(paragraph, index) in aboutParagraphs"
        :key="index"
        class="text-gray-600"
      >
        {{ paragraph }}
      </p>
    </section>
  </main>
</template>

<script setup>
import { computed } from "vue";

const { $t } = useI18n();

const aboutTitle = computed(() => $t("about.title", "About Safe Reader"));
const aboutParagraphs = computed(() => [
  $t(
    "about.body1",
    "Safe Reader lets you inspect shared links inside a sandboxed view so you can decide whether to trust them.",
  ),
  $t(
    "about.body2",
    "The project is open source and welcomes contributions from the community.",
  ),
]);

useHead({
  title: () => aboutTitle.value,
});

definePageMeta({
  title: "AboutPage",
});
</script>
