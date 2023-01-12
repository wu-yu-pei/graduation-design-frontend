<template>
  <div class="main" relative w100vw h100vh>
    <MainLeft></MainLeft>
    <MainMap ref="mapRef"></MainMap>
    <MainRight></MainRight>
  </div>
</template>

<route lang="yaml">
meta:
  layout: default
</route>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import MainLeft from '../components/mainLeft.vue';
import MainMap from '../components/mainMap.vue';
import MainRight from '../components/mainRight.vue';
import useAppStore from '../store/app';
const router = useRouter();
const appStore = useAppStore();
if (!appStore.token) {
  router.replace('/login');
}

const mapRef = ref(null);

watch(
  () => mapRef.value,
  (n) => {
    appStore.mapRef = n;
  }
);
</script>

<style scoped lang="less"></style>
