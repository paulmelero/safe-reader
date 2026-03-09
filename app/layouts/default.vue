<template>
  <div class="min-h-screen bg-base-200 flex flex-col justify-between">
    <TheHeader />

    <slot />

    <TheFooter />
    <ShareButton />
  </div>
</template>

<script setup lang="ts"></script>
