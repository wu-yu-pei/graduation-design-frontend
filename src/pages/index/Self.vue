<template>
  <div class="my-shops">
    <Title>
      <div class="left">个人中心</div>
    </Title>
    <div class="body">
      <el-form :inline="true" :model="formInline" label-position="top" label-width="100px">
        <el-form-item label="姓名:">
          <el-input :disabled="currentStatus == 0" v-model="formInline.username" placeholder="Approved by" />
        </el-form-item>
        <el-form-item label="发货地址:">
          <el-input :disabled="currentStatus == 0" v-model="formInline.address" placeholder="Approved by" />
        </el-form-item>
        <el-form-item label="联系电话:">
          <el-input :disabled="currentStatus == 0" v-model="formInline.phone" placeholder="Approved by" />
        </el-form-item>
        <el-form-item label="操作:">
          <el-button v-if="currentStatus == 0" @click="changeCurrentStatus()">修改</el-button>
          <el-button v-if="currentStatus == 1" @click="sureChange()">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  name: 个人中心
</route>

<script setup>
import { ref } from 'vue';
import useAppStore from '../../store/app';
let currentStatus = ref(0); // 0:禁止编辑状态 1:编辑状态
const appStore = useAppStore();
const formInline = reactive({
  username: appStore.userInfo.uname,
  address: appStore.userInfo.address,
  phone: appStore.userInfo.account,
});

function sureChange() {
  currentStatus.value = 0;
  console.log('submit!');
}

function changeCurrentStatus() {
  currentStatus.value = 1;
}
</script>

<style scoped lang="less">
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .right {
    display: flex;
    gap: 0 10px;
  }
  .upload {
    display: flex;
    flex-direction: row-reverse;
  }
}

.el-form {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}
</style>
