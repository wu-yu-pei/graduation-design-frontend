<template>
  <div class="header-right">
    <a href="https://github.com/wu-yu-pei/graduation-design-frontend">
      <el-avatar src="https://docs.github.com/assets/cb-803/images/site/favicon.svg" />
    </a>
    <el-avatar :src="userInfo.img" /> {{ userInfo.account == 0 ? 'wuyupei' : userInfo.account }}
    <div class="btn" @click="exit">退出</div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import useAppStore from '../../store/app';

const appStore = useAppStore();
const { userInfo } = storeToRefs(appStore);

function exit() {
  localStorage.clear();
  location.reload();
}
</script>

<style scoped lang="less">
.header-right {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0 10px;
  .el-avatar {
    border: 1px solid #ccc;
    background-color: #fff;
  }
  .btn {
    height: 25px;
    color: #545c64;
    line-height: 25px;
    border: none;
    letter-spacing: 3px;
    font-weight: bold;
    border-left: 2px solid #545c64;
  }
}
</style>
