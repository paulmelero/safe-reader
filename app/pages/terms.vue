<template>
  <InfoPageContent :title="title" :paragraphs="paragraphs" />
</template>

<script setup>
const { title, paragraphs } = useStaticPageContent({
  titleKey: "terms.title",
  titleDefault: "Terms",
  bodyKeys: ["terms.body1", "terms.body2", "terms.body3", "terms.body4"],
  bodyDefaults: [
    "Safe Reader previews links inside an isolated iframe to reduce risk, but you remain responsible for the URLs you open.",
    "We do not store the URLs you preview; the address stays within your browser.",
    "By using Safe Reader you agree to use it responsibly and comply with local regulations.",
    "We disclaim any liability for damages resulting from the use of Safe Reader. We only access what is published publicly on the web.",
  ],
});

useHead({
  title: () => title.value,
});

definePageMeta({
  title: "TermsPage",
  layout: "article",
});
</script>
