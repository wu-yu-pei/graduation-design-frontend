<template>
  <div>登录页面</div>
</template>

<script setup>
import { login, findShop } from '../service/home';
login({ account: 0, password: 0 }).then((res) => {
  localStorage.setItem('token', res.data.token);
});
</script>

<style scoped></style>
