<template>
  <div>
    <NuxtPwaManifest />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "Safe Reader",
  meta: [
    {
      name: "description",
      content:
        "A secure way to view shared URLs (in a sandboxed iframe with no JS).",
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
