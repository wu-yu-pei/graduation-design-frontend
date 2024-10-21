<template>
  <div class="index" v-if="isLogin">
    <div class="banner"></div>
    <div class="control">
      <div class="control-item" @click="$router.push('/search')">
        <div class="control-item-icon i-material-symbols:feature-search"></div>
        <div class="control-item-title">报名查询</div>
      </div>
      <div class="control-item" v-if="username === 'admin'" @click="$router.push('/upload')">
        <div class="control-item-icon i-material-symbols:background-grid-small-outline">1</div>
        <div class="control-item-title">上传文件</div>
      </div>
    </div>
  </div>
  <div v-else class="index-login">
    <div class="login-container">
      <h1 class="login-title">欢迎登录</h1>
      <van-cell-group>
        <van-field v-model="username" placeholder="请输入用户名" label="用户名" class="input-field" />
        <van-field v-model="password" placeholder="请输入密码" label="密码" type="password" class="input-field" />
      </van-cell-group>
      <van-button type="primary" class="login-button" @click="handleLogin">登录</van-button>
    </div>
  </div>
</template>

<script setup>
import request from '../service/index';
import localStorageWithExpiry from '../utils/index.js';
import { showToast } from 'vant';

const isLogin = ref(localStorageWithExpiry.getItem('isLogin') || false);

const username = ref(localStorageWithExpiry.getItem('username') || '');
const password = ref('');

const handleLogin = () => {
  if (!username.value || !password.value) {
    return showToast('用户名或密码不能为空');
  }
  if (new RegExp(/^user\d{2}$/).test(username.value.trim()) && (new RegExp(/^\d{2}\w{2}$/).test(password.value.trim()))) {
    showToast('登陆成功');
    isLogin.value = true;
    localStorageWithExpiry.setItem('username', username.value, 60 * 24);
    localStorageWithExpiry.setItem('isLogin', true, 60 * 24);
  } else if (username.value === 'admin' && password.value === '010407') {
    showToast('登陆成功');
    isLogin.value = true;
    localStorageWithExpiry.setItem('username', username.value, 60 * 24);
    localStorageWithExpiry.setItem('isLogin', true, 60 * 24);
  } else {
    showToast('用户名或密码错误');
  }
};
</script>

<style scoped lang="less">
.banner {
  height: 200px;
  background: linear-gradient(90deg, #FFF1EB 0%, #ACE0F9 100%);
  margin: 0 10px;
  border-radius: 10px;
}

.control {
  display: flex;
  flex-wrap: wrap;
  margin: 0 20px;
}

.control-item {
  --n: 3;
  /* 每行显示的子项数量 */
  --item-width: 100px;
  /* 子项宽度 */
  --space: calc(100% / var(--n) - var(--item-width));
  /* 计算子项之间的间距 */
  --m: calc(var(--space) / 2);
  /* 左右间距的一半 */
  margin: 10px var(--m);
  /* 动态计算左右的间距 */
}

.control-item-icon {
  width: 30px;
  height: 30px;
  color: #000;
  margin: 0 auto;
  margin-bottom: 10px;
}

.index-login {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-container {
  padding: 20px;
  // background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: auto;
}

.login-title {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.input-field {
  margin-bottom: 16px;
}

.login-button {
  width: 100%;
  border-radius: 20px;
  height: 44px;
}

h1 {
  font-weight: 400;
  font-size: 20px;
  letter-spacing: 3px;
}
</style>
