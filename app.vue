<template>
  <NuxtPage />
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
  ],
});
</script>
