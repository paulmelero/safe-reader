<template>
  <div class="flex gap-2">
    <button
      v-for="locale in locales"
      :key="locale.code"
      @click="switchLocale(locale.code)"
      :aria-label="$t(locale.labelKey)"
      :disabled="$getLocale() === locale.code"
      class="rounded-full p-2 transition-opacity"
      :class="{
        'cursor-default opacity-50': $getLocale() === locale.code,
        'hover:opacity-80': $getLocale() !== locale.code,
      }"
    >
      {{ locale.flag }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { queryCollection, useRoute, useRouter } from "#imports";

const { $t, $switchLocale, $getLocale, switchLocalePath, localePath } =
  useI18n();
const router = useRouter();
const route = useRoute();

const locales = [
  { code: "en", labelKey: "langEnglish", flag: "🇬🇧" },
  { code: "es", labelKey: "langSpanish", flag: "🇪🇸" },
] as const;

const slugPattern = /\/blog\/([^/?#]+)/;

const canNavigateToTarget = async (targetPath: string, locale: string) => {
  if (!targetPath) {
    return false;
  }

  if (!route.path.includes("/blog/")) {
    return true;
  }

  const slugMatch = targetPath.match(slugPattern);
  if (!slugMatch) {
    return true;
  }

  const [, rawSlug] = slugMatch;
  const targetSlug = decodeURIComponent(rawSlug ?? "");
  const existingPost = await queryCollection("blog")
    .where("slug", "=", targetSlug)
    .where("_locale", "=", locale)
    .first();

  return Boolean(existingPost);
};

const switchLocale = async (code: (typeof locales)[number]["code"]) => {
  if ($getLocale() === code) {
    return;
  }

  const targetPath = switchLocalePath(code);
  const hasValidTarget = targetPath
    ? await canNavigateToTarget(targetPath, code)
    : false;

  await $switchLocale(code);

  if (hasValidTarget && targetPath) {
    await router.push(targetPath);
    return;
  }

  await router.push(localePath("/blog", code));
};
</script>
