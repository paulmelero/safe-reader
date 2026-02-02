<template>
  <article v-if="doc" class="prose flex flex-col gap-6">
    <header class="flex flex-col gap-2 border-b border-gray-200 pb-4">
      <p v-if="formattedDate" class="text-sm text-gray-500">
        {{ formattedDate }}
      </p>
      <h1 class="text-3xl font-semibold text-gray-800">
        {{ doc.title }}
      </h1>
      <p v-if="doc.description" class="text-gray-600">
        {{ doc.description }}
      </p>
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

  <div
    v-else
    class="flex flex-col items-center gap-4 text-center text-gray-600"
  >
    <p>{{ notFoundMessage }}</p>
    <NuxtLink to="/blog" class="text-blue-600 hover:underline">
      {{ backToBlogLabel }}
    </NuxtLink>
  </div>
</template>

<script setup>
import { computed } from "vue";

definePageMeta({
  title: "BlogPostPage",
  layout: "article",
});

const route = useRoute();
const { $getLocale, $t } = useI18n();

const locale = computed(() => $getLocale());
const slug = computed(() => String(route.params.slug || ""));

const loadingMessage = computed(() => $t("loading", "Loading..."));
const notFoundMessage = computed(() =>
  $t("blog.notFound", "We couldn't find that post."),
);
const backToBlogLabel = computed(() => $t("blog.back", "Back to the blog"));

const { data: doc, pending } = await useAsyncData(
  "blog-post",
  async () => {
    if (!slug.value) {
      return null;
    }

    return queryCollection("blog")
      .where("slug", "=", slug.value)
      .where("_locale", "=", locale.value)
      .first();
  },
  {
    watch: [slug, locale],
    server: true,
  },
);

const formattedDate = computed(() => {
  const date = doc.value?.date;
  if (!date) {
    return "";
  }

  try {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    return "";
  }
});

useHead(() => ({
  title: doc.value?.title || $t("blog.title", "Blog"),
  meta: doc.value?.description
    ? [
        {
          name: "description",
          content: doc.value.description,
        },
      ]
    : [],
}));
</script>
