<template>
  <main class="flex grow flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
    <section class="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <h1 class="text-3xl font-semibold text-gray-800">
        {{ termsTitle }}
      </h1>
      <p
        v-for="(paragraph, index) in termsParagraphs"
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

const termsTitle = computed(() => $t("terms.title", "Terms"));
const termsParagraphs = computed(() => [
  $t(
    "terms.body1",
    "Safe Reader previews links inside an isolated iframe to reduce risk, but you remain responsible for the URLs you open.",
  ),
  $t(
    "terms.body2",
    "We do not store the URLs you preview; the address stays within your browser.",
  ),
  $t(
    "terms.body3",
    "By using Safe Reader you agree to use it responsibly and comply with local regulations.",
  ),
  $t(
    "terms.body4",
    "We disclaim any liability for damages resulting from the use of Safe Reader. We only access what is published publicly on the web.",
  ),
]);

useHead({
  title: () => termsTitle.value,
});

definePageMeta({
  title: "TermsPage",
});
</script>
