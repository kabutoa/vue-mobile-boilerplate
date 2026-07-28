import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConfigStore = defineStore('config', () => {
  const loading = ref({
    mask: true,
    text: 'Loading...',
    visible: false,
  })

  function setLoading({ mask, visible }: { mask: boolean; visible: boolean }) {
    loading.value.visible = visible
    loading.value.mask = mask
  }

  return { loading, setLoading }
})
