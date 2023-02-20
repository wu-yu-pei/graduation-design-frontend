<template>
  <div class="my-fahuo">
    <Title>AA</Title>
    <div class="body">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="物流名称">
          <el-input v-model="formInline.user" placeholder="请输入物流名称" />
        </el-form-item>
        <el-form-item label="发货地址">
          <el-select v-model="formInline.region" placeholder="请选择发货地址">
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="收货地址">
          <el-select v-model="formInline.region" placeholder="请选择收货地址">
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">Query</el-button>
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
import { reactive } from 'vue'

const formInline = reactive({
  name: '',
  current: '',
})

const onSubmit = () => {
  console.log('submit!')
}
</script>

<style scoped lang="less"></style>
