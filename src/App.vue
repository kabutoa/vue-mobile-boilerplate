<script setup lang="ts">
import { useConfigStore } from '@/stores'

const { loading } = storeToRefs(useConfigStore())
</script>

<template>
  <div class="app-container">
    <CommonHeader />
    <RouterView />
  </div>
  <Loading :visible="loading.visible" :mask="loading.mask" />
</template>

<style scoped></style>
