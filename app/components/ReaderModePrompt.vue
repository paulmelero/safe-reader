<template>
  <Transition
    enter-active-class="transform transition ease-in-out duration-300 sm:duration-500"
    enter-from-class="translate-y-full"
    enter-to-class="translate-y-0"
    leave-active-class="transform transition ease-in-out duration-300 sm:duration-500"
    leave-from-class="translate-y-0"
    leave-to-class="translate-y-full"
  >
    <div
      v-if="isOpen"
      class="fixed inset-x-0 mx-auto bottom-0 max-w-lg z-50 p-4 md:p-6 pb-8 rounded-t-[1.45rem] shadow-2xl border border-gray-100 bg-white"
    >
      <div class="p-4 md:p-5 flex items-center justify-between gap-4">
        <div class="flex-1">
          <h3 class="font-semibold text-gray-900 text-base mb-1">
            {{ $t('promptTitle') }}
          </h3>
          <p class="text-sm text-gray-500 leading-snug">
            {{ $t('promptBody') }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="confirm"
            class="whitespace-nowrap bg-primary hover:bg-primarHover text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            {{ $t('promptAction') }}
          </button>
        </div>
      </div>
      <button
        @click="close"
        class="absolute top-0 right-0 text-gray-400 hover:text-gray-600 p-2 h-10 w-10 rounded-full hover:bg-gray-100 transition-colors"
        :aria-label="$t('closeButton')"
      >
        ✕
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits(['close', 'confirm']);

const { $t } = useI18n();

const isOpen = ref(false);

watch(
  () => props.show,
  (val) => {
    isOpen.value = val;
  },
);

const close = () => {
  isOpen.value = false;
  emit('close');
};

const confirm = () => {
  emit('confirm');
  isOpen.value = false;
};
</script>
