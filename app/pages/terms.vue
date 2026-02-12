<template>
  <article v-if="doc" class="prose flex flex-col gap-6">
    <header class="flex flex-col gap-2 border-b border-gray-200 pb-4">
      <h1 class="text-3xl font-semibold text-gray-800">
        {{ doc.title }}
      </h1>
    </header>

    <ContentRenderer :value="doc">
      <template #default="{ body }">
        <ContentRendererMarkdown :value="body" />
      </template>
    </ContentRenderer>
  </article>

  <p v-else-if="pending" class="text-center text-gray-500">
    {{ loadingMessage }}
  </p>

  <p v-else class="text-center text-gray-500">
    {{ notFoundMessage }}
  </p>
</template>

<script setup>
import { useNuxtApp } from '#imports';

import { computed } from 'vue';

const { $getLocale, $t } = useNuxtApp();
const locale = computed(() => $getLocale());

definePageMeta({
  title: 'terms',
  layout: 'article',
});

const loadingMessage = computed(() => $t('loading', 'Loading...'));
const notFoundMessage = computed(() => $t('blog.notFound', 'Page not found.'));

const route = useRoute();
const slug = computed(() => String(route.path.split('/').pop() || ''));

const { data: doc, pending } = await useAsyncData(
  () => `page-terms-${locale.value}-${slug.value}`,
  () =>
    queryCollection('pages')
      .where('slug', '=', slug.value)
      .where('_locale', '=', locale.value)
      .first(),
  {
    watch: [locale],
  },
);

useHead({
  title: () => doc.value?.title || $t('navTerms', 'Terms'),
});
</script>
