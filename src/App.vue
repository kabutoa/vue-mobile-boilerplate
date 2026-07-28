<script setup lang="ts">
import { useConfigStore } from '@/stores'

const { loading, message } = storeToRefs(useConfigStore())
</script>

<template>
  <div class="app-container">
    <CommonHeader />
    <RouterView />
  </div>
  <Loading v-bind="loading" />
  <Message v-bind="message" />
</template>

<style scoped></style>
