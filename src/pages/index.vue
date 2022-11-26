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
import MainLeft from '../components/mainLeft.vue';
import MainMap from '../components/mainMap.vue';
import MainRight from '../components/mainRight.vue';
</script>

<style scoped lang="less"></style>
