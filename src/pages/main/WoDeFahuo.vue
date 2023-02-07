<template>
  <div class="my-fahuo">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>我的发货</span>
        </div>
      </template>
      <div>
        <el-table :data="shops" style="width: 100%">
          <el-table-column fixed prop="name" label="名称" width="150" />
          <el-table-column prop="current_position" label="当前地址" />
          <el-table-column prop="current_time" label="时间" />
          <el-table-column prop="end_position" label="收货地址" />
          <el-table-column prop="start_position" label="发货地址" />
          <el-table-column prop="status" label="状态" />
          <el-table-column label="操作" />
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { findShop } from '../../service/home/index';

let shops = reactive([]);

findShop('0').then((res) => {
  shops.push(...res.data);
});
</script>

<style scoped></style>
