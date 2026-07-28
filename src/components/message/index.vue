<script setup lang="ts">
export type MessageType = 'error' | 'info' | 'success'

withDefaults(
  defineProps<{
    text: string
    type?: MessageType
    visible: boolean
  }>(),
  {
    type: 'info',
  },
)
</script>

<template>
  <Teleport to="body">
    <Transition name="message">
      <div v-if="visible" class="message" :class="`message--${type}`" aria-live="polite">
        {{ text }}
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.message {
  position: fixed;
  z-index: 1001;
  top: max(24px, env(safe-area-inset-top, 0px));
  left: 50%;
  max-width: calc(100vw - 32px);
  padding: 10px 14px;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  line-height: 1.5;
  transform: translateX(-50%);
  box-shadow: 0 8px 24px rgb(0 0 0 / 16%);

  &--info {
    background: #404040;
  }

  &--success {
    background: #16794c;
  }

  &--error {
    background: #b42318;
  }
}

.message-enter-active,
.message-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.message-enter-from,
.message-leave-to {
  opacity: 0;
  transform: translate(-50%, -8px);
}

@media (prefers-reduced-motion: reduce) {
  .message-enter-active,
  .message-leave-active {
    transition: none;
  }
}
</style>
