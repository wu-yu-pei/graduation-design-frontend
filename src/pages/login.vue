<template>
  <div class="body">
    <div class="panel">
      <div class="header"></div>
      <div class="form-body"></div>
    </div>
  </div>
</template>

<script setup>
import { login } from '../service/home';
import useAppStore from '../store/app';
const appStore = useAppStore();
login({ account: 0, password: 0, type: 1 }).then((res) => {
  appStore.userInfo = res.data;
  appStore.token = res.data.token;
  localStorage.setItem('token', res.data.token);
});
</script>

<style scoped lang="less">
.body {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
.panel {
  width: 500px;
  height: 400px;
  border: 1px solid red;
}
</style>
