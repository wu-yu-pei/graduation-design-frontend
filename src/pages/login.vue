<template>
  <div class="body">
    <div class="panel">
      <div class="header">物流追踪系统</div>
      <div class="form-body">
        <el-input v-model="formDate.account" size="large" placeholder="Please Input" :prefix-icon="User" />
        <el-input v-model="formDate.password" type="password" size="large" placeholder="Please Input" :prefix-icon="Lock" />
        <el-button @click="exec" v-loading="isLoading">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { login } from '../service/home';
import useAppStore from '../store/app';
import { User, Lock } from '@element-plus/icons-vue';
const router = useRouter();
const appStore = useAppStore();
const isLoading = ref(false);
if (localStorage.getItem('token')) {
  router.push('/');
}
const formDate = reactive({
  account: '0',
  password: '0',
});

function exec() {
  isLoading.value = true;
  login({ account: formDate.account, password: formDate.password, type: 1 }).then((res) => {
    // 登录失败
    if (res.data.code == 210) {
      ElMessage({
        type: 'error',
        message: '登录失败',
      });
      isLoading.value = false;
      return router.push('/login');
    }
    appStore.userInfo = res.data;
    appStore.token = res.data.token;
    localStorage.setItem('token', res.data.token);
    router.push('/');
    isLoading.value = false;
  });
}
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
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 500px;
  height: 500px;
  border-radius: 10px;
  .header {
    width: 100%;
    height: 100px;
    line-height: 100px;
    text-align: center;
    letter-spacing: 25px;
    font-size: 40px;
    font-weight: 800;
    text-shadow: 0 4px 6px #6159d5, -4px 0 6px #bee1ff;
    color: #fff;
  }
  .form-body {
    width: 100%;
    flex: 1;
    .el-input {
      margin: 20px 0;
    }
    .el-button {
      margin-top: 20px;
      height: 50px;
      width: 100%;
      letter-spacing: 5px;
      font-size: 16px;
    }
  }
}
</style>
