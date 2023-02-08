<template>
  <div class="my-fahuo">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>我的物流</span>
        </div>
      </template>
      <div>
        <el-table :data="shops" style="width: 100%" border="true">
          <el-table-column fixed prop="name" label="名称" width="150" />
          <el-table-column prop="current_position" label="当前地址" />
          <el-table-column prop="current_time" label="时间" />
          <el-table-column prop="start_position" label="发货地址" />
          <el-table-column prop="end_position" label="收货地址" />
          <el-table-column prop="status" label="状态">
            <template #default="scope">
              <el-tag v-if="scope.row.status == 1" type="success">已送达</el-tag>
              <el-tag v-else-if="scope.row.status == 0">运输中</el-tag>
              <el-tag v-else-if="scope.row.status == 2" type="danger">已拦截</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="操作">
            <template #default="scope">
              <el-button icon="Delete" type="danger" plain>删除</el-button>
              <el-button v-if="scope.row.status == 0" type="danger" plain>拦截</el-button>
              <el-button v-if="scope.row.status == 0" type="primary" plain>更新位置</el-button>
            </template>
          </el-table-column>
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

<style scoped lang="less">
.my-fahuo {
  height: 100%;
}
.el-card {
  height: 100%;
}
</style>
