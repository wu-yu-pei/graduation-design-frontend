<template>
  <div>登录页面</div>
</template>

<script setup>
import { login } from '../service/home';
import useAppStore from '../store/app';
const appStore = useAppStore();
login({ account: 0, password: 0 }).then((res) => {
  appStore.userInfo = res.data;
  appStore.token = res.data.token;
});
</script>

<style scoped></style>
