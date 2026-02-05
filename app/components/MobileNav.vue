<template>
  <div class="md:hidden flex items-center">
    <button
      @click="toggle"
      :aria-expanded="open"
      aria-controls="mobile-nav-panel"
      aria-label="Menu"
      class="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <!-- Hamburger / Close icon -->
      <svg
        class="h-6 w-6 transition-transform"
        :class="{ 'rotate-90': open }"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <template v-if="!open">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </template>
        <template v-else>
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="6" y1="18" x2="18" y2="6" />
        </template>
      </svg>
    </button>

    <!-- Overlay + Panel -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="open"
          class="fixed inset-0 z-40 bg-black/30"
          @click="close"
        />
      </Transition>

      <Transition name="slide">
        <nav
          v-if="open"
          id="mobile-nav-panel"
          class="fixed top-0 right-0 z-50 h-full w-64 bg-white shadow-lg flex flex-col"
        >
          <!-- Close button -->
          <div class="flex justify-end p-4">
            <button
              @click="close"
              aria-label="Close menu"
              class="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <svg
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </svg>
            </button>
          </div>

          <!-- Nav links -->
          <ul class="flex flex-col gap-1 px-4">
            <li v-for="link in links" :key="link.to">
              <NuxtLink
                :to="localePath(link.to)"
                class="block rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                @click="close"
              >
                {{ $t(link.labelKey) }}
              </NuxtLink>
            </li>
          </ul>

          <!-- Locale switcher at bottom -->
          <div class="mt-auto border-t p-4">
            <LocaleSwitcher />
          </div>
        </nav>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const { $t } = useI18n();
const { $localePath } = useNuxtApp();
const localePath = $localePath;

const open = ref(false);

const links = [
  { to: '/', labelKey: 'navHome' },
  { to: '/blog', labelKey: 'blog.title' },
  { to: '/about', labelKey: 'navAbout' },
  { to: '/terms', labelKey: 'navTerms' },
  { to: '/faq', labelKey: 'navFaq' },
];

function toggle() {
  open.value = !open.value;
}

function close() {
  open.value = false;
}

// Close on Escape key
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') close();
}

watch(open, (isOpen) => {
  if (isOpen) {
    document.addEventListener('keydown', onKeydown);
    document.body.style.overflow = 'hidden';
  } else {
    document.removeEventListener('keydown', onKeydown);
    document.body.style.overflow = '';
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown);
  document.body.style.overflow = '';
});
</script>

<style scoped>
/* Backdrop fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Panel slide from right */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.25s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
