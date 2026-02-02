<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-between">
    <TheHeader />

    <main class="flex grow flex-col px-4 py-8 md:px-6 md:py-12">
      <section class="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <slot />
      </section>
    </main>

    <TheFooter />
  </div>
</template>

<script setup lang="ts"></script>
