<script setup lang="ts">
// Vue 3.5+ 直接解构
const { mask, visible } = defineProps<{
  mask: boolean
  visible: boolean
}>()

// 旧版本解构
// const { mask, visible } = toRefs(props)
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      :class="['loading', { 'loading-mask': mask }]"
      role="status"
      aria-live="polite"
    >
      <div class="loading-indicator">
        <span class="loading-spinner" aria-hidden="true" />
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.loading {
  @include mask;
  @include gridcc;

  &.loading-mask {
    background: rgb(255 255 255 / 72%);
  }

  &-indicator {
    display: grid;
    justify-items: center;
    gap: 12px;
    color: #171717;
  }

  &-spinner {
    width: 32px;
    aspect-ratio: 1;
    border: 3px solid rgb(23 23 23 / 18%);
    border-top-color: currentColor;
    border-radius: 50%;
    animation: loading-spin 0.7s linear infinite;
  }

  @keyframes loading-spin {
    to {
      transform: rotate(1turn);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .loading-spinner {
      animation: none;
    }
  }
}
</style>
