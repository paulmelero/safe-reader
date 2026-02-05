<template>
  <article class="flex flex-col gap-6">
    <h1 class="text-3xl font-semibold text-gray-800">
      {{ $t('faq.title') }}
    </h1>
    <dl class="flex flex-col gap-6">
      <div v-for="(item, index) in items" :key="index">
        <dt class="text-lg font-medium text-gray-800 mb-1">
          {{ item.q }}
        </dt>
        <dd class="text-gray-600">
          {{ item.a }}
        </dd>
      </div>
    </dl>
  </article>
</template>

<script setup>
const { $t } = useI18n();

const faqKeys = [
  { q: 'faq.q1', a: 'faq.a1' },
  { q: 'faq.q2', a: 'faq.a2' },
  { q: 'faq.q3', a: 'faq.a3' },
  { q: 'faq.q4', a: 'faq.a4' },
  { q: 'faq.q5', a: 'faq.a5' },
];

const items = computed(() =>
  faqKeys.map(({ q, a }) => ({
    q: $t(q),
    a: $t(a),
  })),
);

useHead({
  title: () => $t('faq.title'),
});

definePageMeta({
  title: 'FaqPage',
  layout: 'article',
});
</script>
