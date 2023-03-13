<template>
  <div class="my-shops">
    <Title>
      <div class="left">个人中心</div>
    </Title>
    <div class="body">
      <el-form :inline="true" :model="formInline" label-position="top" label-width="100px">
        <el-form-item label="姓名:">
          <el-input :disabled="currentStatus == 0" v-model="formInline.uname" placeholder="Approved by" />
        </el-form-item>
        <el-form-item label="发货地址:">
          <el-input :disabled="currentStatus == 0" v-model="formInline.address" placeholder="Approved by" />
        </el-form-item>
        <el-form-item label="联系电话:">
          <el-input :disabled="currentStatus == 0" v-model="formInline.account" placeholder="Approved by" />
        </el-form-item>
        <el-form-item label="操作:">
          <el-button v-if="currentStatus == 0" @click="changeCurrentStatus()">修改</el-button>
          <el-button v-if="currentStatus == 1" v-loading="currentStatus == isChanging" @click="sureChange()">确定</el-button>
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
import { changeUserInfo } from '../../service/home/index';
import useAppStore from '../../store/app';
let currentStatus = ref(0); // 0:禁止编辑状态 1:编辑状态
let isChanging = ref(false);
const appStore = useAppStore();
const formInline = reactive({
  uname: appStore.userInfo.uname,
  address: appStore.userInfo.address,
  account: appStore.userInfo.account,
});

function sureChange() {
  isChanging.value = true;
  appStore.userInfo.uname = formInline.uname;
  appStore.userInfo.address = formInline.address;
  appStore.userInfo.account = formInline.account;

  changeUserInfo({ ...formInline, address_geo: '113.814659,34.811091' }).then((res) => {
    if (res.data.code == 200) {
      ElMessage({
        type: 'success',
        message: '修改成功',
      });
    } else if (res.data.code == 400) {
      ElMessage({
        type: 'error',
        message: '修改失败',
      });
    }
    currentStatus.value = 0;
    isChanging.value = false;
  });
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
