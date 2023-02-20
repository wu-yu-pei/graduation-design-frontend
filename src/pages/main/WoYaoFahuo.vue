<template>
  <div class="my-fahuo">
    <Title>我要发货</Title>
    <div class="body">
      <el-form :inline="true" :model="formDate" class="demo-form-inline">
        <el-form-item label="物流名称">
          <el-input v-model="formDate.user" placeholder="请输入物流名称" />
        </el-form-item>
        <el-form-item label="发货地址">
          <el-select v-model="formDate.region" placeholder="请选择发货地址">
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="收货地址">
          <el-select v-model="formDate.region" placeholder="请选择收货地址">
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">发货</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  name: 我要发货
</route>

<script setup>
import { createShop } from '../../service/home/index';
import useAppStore from '../../store/app';

const appStore = useAppStore();
const formDate = reactive({
  name: '小米13',
  start_position: '河南财政金融学院',
  start_position_geo: '113.814357,34.809858',
  end_position: '浙江省杭州市西湖区龙井路1号',
  end_position_geo: '120.12792,30.228932',
});

function onSubmit() {
  createShop({ ...formDate, uid: appStore.userInfo.id, time: +new Date() }).then((res) => {
    console.log(res);
  });
}
</script>

<style scoped lang="less">
.body {
  margin-top: 20px;
}
</style>
