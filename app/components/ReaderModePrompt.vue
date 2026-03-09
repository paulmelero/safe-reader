<template>
  <ClientOnly>
    <Teleport to="body">
      <dialog class="modal modal-bottom" :class="{ 'modal-open': isOpen }">
        <div class="modal-box">
          <button
            @click="close"
            class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            :aria-label="$t('closeButton') as string"
          >
            ✕
          </button>
          <h3 class="font-semibold text-base-content text-base mb-1">
            {{ $t("promptTitle") }}
          </h3>
          <p class="text-sm text-base-content/70 leading-snug">
            {{ $t("promptBody") }}
          </p>
          <div class="modal-action">
            <button
              @click="confirm"
              class="btn whitespace-nowrap bg-primary hover:bg-primary/90 text-primary-content text-sm font-medium"
            >
              {{ $t("promptAction") }}
            </button>
          </div>
        </div>
        <div class="modal-backdrop" @click="close"></div>
      </dialog>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits(["close", "confirm"]);

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

const confirm = () => {
  emit("confirm");
  isOpen.value = false;
};
</script>
