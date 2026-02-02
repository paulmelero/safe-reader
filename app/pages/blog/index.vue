<template>
  <main class="flex grow flex-col gap-10 px-4 py-8 md:px-6 md:py-10">
    <section class="flex flex-col gap-4 text-center">
      <h1 class="text-3xl font-semibold text-gray-800">{{ pageTitle }}</h1>
      <p class="text-gray-600">{{ pageSubtitle }}</p>
    </section>

    <section v-if="hasPosts" class="container mx-auto flex flex-col gap-10">
      <article
        v-for="post in postEntries"
        :key="post._id"
        class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
      >
        <p v-if="post.formattedDate" class="text-sm text-gray-500">
          {{ post.formattedDate }}
        </p>
        <h2 class="text-2xl font-semibold text-gray-800">
          <NuxtLink :to="post.href" class="hover:underline">
            {{ post.title }}
          </NuxtLink>
        </h2>
        <p v-if="post.description" class="text-gray-600">
          {{ post.description }}
        </p>
        <NuxtLink
          :to="post.href"
          class="mt-4 inline-flex text-blue-600 hover:underline"
        >
          {{ readMoreLabel }}
        </NuxtLink>
      </article>
    </section>

    <p v-else class="text-center text-gray-500">
      {{ emptyStateMessage }}
    </p>
  </main>
</template>

<script setup>
import { computed } from "vue";

const { $t, $getLocale } = useI18n();
const { $localePath } = useNuxtApp();

const pageTitle = computed(() => $t("blog.title", "Blog"));
const pageSubtitle = computed(() =>
  $t("blog.subtitle", "Updates and notes from Safe Reader"),
);
const emptyStateMessage = computed(() =>
  $t("blog.empty", "No posts available in this language yet."),
);
const readMoreLabel = computed(() => $t("blog.readMore", "Read more"));

const locale = computed(() => $getLocale());

const { data: posts } = await useAsyncData(
  "blog-posts",
  () =>
    queryCollection("blog")
      .where("_locale", "=", locale.value)
      .order("date", "DESC")
      .all(),
  {
    watch: [locale],
  },
);

const postList = computed(() => posts.value ?? []);

const postEntries = computed(() =>
  postList.value.map((post) => {
    const slug =
      post.slug || post._path?.split("/").filter(Boolean).pop() || post._id;
    const formattedDate = post.date
      ? new Date(post.date).toLocaleDateString(locale.value, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";

    return {
      ...post,
      slug,
      href: $localePath(`/blog/${slug}`),
      formattedDate,
    };
  }),
);

const hasPosts = computed(() => postEntries.value.length > 0);

useHead({
  title: () => pageTitle.value,
});

definePageMeta({
  title: "BlogPage",
});
</script>
