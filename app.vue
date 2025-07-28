<template>
  <NuxtLayout>
    <NuxtPwaManifest />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { $getLocale } = useI18n();

useHead({
  title: "SAFEReader",
  titleTemplate: "%s - SAFEReader",
  meta: [
    {
      name: "description",
      content:
        $getLocale() === "en"
          ? "A secure way to view shared URLs (in a sandboxed iframe with no JS)."
          : "Una forma segura de ver URLs compartidas (en un iframe aislado sin JavaScript).",
    },
    { name: "theme-color", content: "#ffffff" },
    { name: "apple-mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-status-bar-style", content: "default" },
  ],
  link: [
    {
      rel: "apple-touch-icon",
      href: "/safereader-192x192.png",
    },
  ],
});
</script>
