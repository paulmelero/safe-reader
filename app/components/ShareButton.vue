<template>
  <button
    v-if="canShare"
    class="fixed bottom-16 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition hover:bg-primaryHover focus:outline-none focus:ring-2 focus:ring-primaryHover"
    type="button"
    :aria-label="$t('shareButton')"
    @click="shareUrl"
  >
    <span class="sr-only">{{ $t('shareButton') }}</span>
    <svg
      aria-hidden="true"
      class="h-6 w-6"
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 16.08a2.91 2.91 0 0 0-1.96.77l-6.36-3.52a2.93 2.93 0 0 0 0-2.66l6.36-3.52a2.93 2.93 0 1 0-.94-1.51l-6.35 3.52a2.93 2.93 0 1 0 0 5.68l6.35 3.52A2.93 2.93 0 1 0 18 16.08Z"
      />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useUrlReader } from '~/composables/useUrlReader';

const { $t } = useI18n();
const { currentUrl, title } = useUrlReader();
const isShareSupported = ref(false);

onMounted(() => {
  isShareSupported.value =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function';
});

const config = useRuntimeConfig();

const shareLink = computed(() => {
  try {
    const baseUrl = config.public.APP_URL;
    if (!baseUrl || !currentUrl.value) return '';
    const url = new URL(baseUrl);
    url.searchParams.set('url', currentUrl.value);
    return url.toString();
  } catch (e) {
    return currentUrl.value;
  }
});

const canShare = computed(
  () => Boolean(currentUrl.value) && isShareSupported.value,
);

const shareUrl = async () => {
  if (
    !canShare.value ||
    typeof navigator === 'undefined' ||
    typeof navigator.share !== 'function'
  ) {
    return;
  }

  try {
    await navigator.share({
      url: shareLink.value,
      title: title.value || currentUrl.value,
      text: title.value || currentUrl.value,
    });
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'name' in error &&
      (error as { name?: string }).name === 'AbortError'
    ) {
      return;
    }

    console.error('Error sharing', error);
  }
};
</script>
