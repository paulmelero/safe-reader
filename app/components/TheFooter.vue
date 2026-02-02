<template>
  <footer class="flex justify-between px-4 py-2 text-sm">
    <div class="text-gray-600 text-center">
      <p>
        {{ $t("footerCopy", { year: new Date().getFullYear() }) }}
      </p>
    </div>
    <nav>
      <ul class="flex space-x-4">
        <li>
          <NuxtLink :to="localePath('/')">Home</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="localePath('/blog')">Blog</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="localePath('/about')">{{ $t("navAbout") }}</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="localePath('/terms')">{{ $t("navTerms") }}</NuxtLink>
        </li>
      </ul>
    </nav>
    <LocaleSwitcher />
  </footer>
</template>

<script setup lang="ts">
const { $t } = useI18n();
const { $localePath } = useNuxtApp();
const localePath = $localePath;
</script>
