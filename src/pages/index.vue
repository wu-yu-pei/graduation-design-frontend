<template>
  <div w100 h100 bg-blue color-white rd-10 text-center lh-100 reactive mx-auto>
    Hi
  </div>
  <div w100 h100 ma text-center lh-100>
    <span i-ph-activity w20 h20  inline-block mx10></span>
    <span i-material-symbols-360 w20 h20 inline-block mx10></span>
  </div>
  <div flex w350 h100 b-1 ma justify-around items-center>
    <div w50 h50 b-2 rd-10></div>
    <div w50 h50 b-2 rd-10></div>
    <div w50 h50 b-2 rd-10></div>
    <div w50 h50 b-2 rd-10></div>
    <div w50 h50 b-2 rd-10></div>
    <div w50 h50 b-2 rd-10></div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: default
</route>

<script setup>
import { useRouter, useRoute } from 'vue-router';

const route = useRoute();
const router = useRouter();

console.log(route.fullPath, router);
</script>

<style scoped></style>
