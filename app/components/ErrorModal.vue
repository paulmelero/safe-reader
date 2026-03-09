<template>
  <ClientOnly>
    <Teleport to="body">
      <dialog class="modal" :class="{ 'modal-open': isOpen }">
        <div class="modal-box border border-error bg-base-100">
          <button
            @click="close"
            class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            :aria-label="$t('closeButton') as string"
          >
            ✕
          </button>
          <h3 class="font-semibold text-error text-base mb-4">
            {{ title }}
          </h3>
          <p class="text-sm text-base-content/70 leading-snug">
            {{ body }}
          </p>
        </div>
        <div class="modal-backdrop" @click="close"></div>
      </dialog>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean;
  title: string;
  body: string;
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
