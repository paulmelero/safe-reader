<template>
  <footer class="flex justify-between px-4 py-2 text-sm">
    <div class="text-gray-600 text-center">
      <p>
        {{ $t("footerCopy", { year: new Date().getFullYear() }) }}
      </p>
    </div>
    <!-- <nav>
      <ul class="flex space-x-4">
        <li>
          <NuxtLink to="/">{{ $t("navHome") }}</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/about">{{ $t("navAbout") }}</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/terms">{{ $t("navTerms") }}</NuxtLink>
        </li>
      </ul>
    </nav> -->
    <LocaleSwitcher />
  </footer>
</template>

<script setup lang="ts">
const { $t } = useI18n();
</script>
