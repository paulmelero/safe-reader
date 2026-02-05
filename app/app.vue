<template>
  <NuxtLayout>
    <NuxtPwaManifest />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { $getLocale } = useI18n();
const locale = $getLocale();

const { APP_NAME } = useRuntimeConfig().public;

useHead({
  title: APP_NAME,
  titleTemplate: (title?: string) =>
    title ? `${title} – ${APP_NAME}` : APP_NAME,
  meta: [
    {
      name: 'description',
      content:
        locale === 'en'
          ? 'A secure way to view shared URLs (in a sandboxed iframe with no JS).'
          : 'Una forma segura de ver URLs compartidas (en un iframe aislado sin JavaScript).',
    },
    { name: 'theme-color', content: '#3b82f6' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
  ],
  // favicon
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon-96x96.png',
      sizes: '96x96',
    },
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'shortcut icon', href: '/favicon.ico' },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/apple-touch-icon.png',
    },
    { rel: 'manifest', href: '/manifest.webmanifest' },
  ],
});
</script>
