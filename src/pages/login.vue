<template>
  <div>登录页面</div>
</template>

<script setup>
import { login } from '../service/home';
login({ account: 0, password: 0 }).then((res) => {
  console.log(res);
});
</script>

<style scoped></style>