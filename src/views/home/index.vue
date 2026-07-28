<script lang="ts" setup>
import { getUserInfo } from '@/api'

const onGetUserInfo = async () => {
  const res = await getUserInfo()
  console.log(res)
}
</script>

<template>
  <div class="home">
    <h1>Home</h1>
    <button @click="onGetUserInfo">Get User Info</button>
  </div>
</template>

<style lang="scss" scoped>
.home {
  @include flexcc;
}
</style>
