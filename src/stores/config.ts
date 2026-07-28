import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { MessageType } from '@/components/message/index.vue'

export const useConfigStore = defineStore('config', () => {
  const loading = ref({
    mask: true,
    visible: false,
  })

  function setLoading({ mask, visible }: { mask: boolean; visible: boolean }) {
    loading.value.visible = visible
    loading.value.mask = mask
  }

  const message = ref<{
    text: string
    type: MessageType
    visible: boolean
  }>({
    text: '',
    type: 'info',
    visible: false,
  })

  function setMessage({
    text,
    type,
    visible,
  }: {
    text: string
    type: MessageType
    visible: boolean
  }) {
    message.value.visible = visible
    message.value.text = text
    message.value.type = type
  }

  return { loading, message, setLoading, setMessage }
})
