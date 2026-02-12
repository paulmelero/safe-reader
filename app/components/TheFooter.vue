<template>
  <footer
    class="flex items-center justify-center md:justify-between px-4 py-2 text-sm"
  >
    <div class="text-gray-600 text-center">
      <p>
        {{ $t('footerCopy', { year: new Date().getFullYear() }) }}
      </p>
    </div>
    <nav class="hidden md:block">
      <ul class="flex space-x-4 items-center">
        <li>
          <NuxtLink :to="localePath('/')">Home</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="localePath('/blog')">Blog</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="localePath({ name: 'about' })">{{
            $t('navAbout')
          }}</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="localePath({ name: 'terms' })">{{
            $t('navTerms')
          }}</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="localePath('/faq')">{{ $t('navFaq') }}</NuxtLink>
        </li>
      </ul>
    </nav>
    <div class="hidden md:block">
      <LocaleSwitcher />
    </div>
  </footer>
</template>

<script setup lang="ts">
const { $t } = useI18n();
const { $localePath } = useNuxtApp();
const localePath = $localePath;
</script>
