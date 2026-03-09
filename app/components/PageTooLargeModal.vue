<template>
  <dialog class="modal modal-bottom" :class="{ 'modal-open': isOpen }">
    <div class="modal-box">
      <button
        @click="close"
        class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        :aria-label="$t('closeButton')"
      >
        ✕
      </button>
      <h3 class="font-semibold text-base-content text-base mb-1">
        {{ $t("pageTooLargeTitle") }}
      </h3>
      <p class="text-sm text-base-content/70 leading-snug">
        {{ $t("pageTooLargeBody") }}
      </p>
    </div>
    <div class="modal-backdrop" @click="close"></div>
  </dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits(["close"]);

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
  emit("close");
};
</script>
