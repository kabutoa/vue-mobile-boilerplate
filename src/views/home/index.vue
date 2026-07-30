<script lang="ts" setup>
import { getUserInfo } from '@/api'
import { useConfigStore } from '@/stores'

const { setLoading, setMessage } = useConfigStore()

const onShowLoading = () => {
  setLoading({ mask: true, visible: true })
}

const onShowMessage = () => {
  setMessage({ text: 'Hello, world!', type: 'info', visible: true })
}

const onGetUserInfo = async () => {
  const res = await getUserInfo()
  console.log(res.name)
}
</script>

<template>
  <div class="home">
    <h1>Home</h1>
    <button @click="onShowLoading">Show Loading</button>
    <button @click="onShowMessage">Show Message</button>
    <button @click="onGetUserInfo">Get User Info</button>
  </div>
</template>

<style lang="scss" scoped>
.home {
  @include flexcc;
}
</style>
