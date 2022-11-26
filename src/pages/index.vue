<template>
  <div class="main" reactive w100vw h100vh>
    <MainLeft></MainLeft>
    <MainMap></MainMap>
    <MainRight></MainRight>
  </div>
</template>

<route lang="yaml">
meta:
  layout: default
</route>

<script setup>
import { useRouter } from 'vue-router';
import MainLeft from '../components/mainLeft.vue';
import MainMap from '../components/mainMap.vue';
import MainRight from '../components/mainRight.vue';
const router = useRouter();
const token = localStorage.getItem('token');
if (!token) {
  router.replace('/login');
}
</script>

<style scoped lang="less"></style>
