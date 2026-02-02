<template>
  <InfoPageContent :title="title" :paragraphs="paragraphs" />
</template>

<script setup>
const { title, paragraphs } = useStaticPageContent({
  titleKey: "about.title",
  titleDefault: "About Safe Reader",
  bodyKeys: ["about.body1", "about.body2"],
  bodyDefaults: [
    "Safe Reader lets you inspect shared links inside a sandboxed view so you can decide whether to trust them.",
    "The project is open source and welcomes contributions from the community.",
  ],
});

useHead({
  title: () => title.value,
});

definePageMeta({
  title: "AboutPage",
  layout: "article",
});
</script>
