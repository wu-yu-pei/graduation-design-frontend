<template>
  <router-view></router-view>
</template>

<script setup>
import { hi } from './service/home';
console.log(11);
hi().then((res) => {
  console.log(res);
});
</script>

<style></style>
