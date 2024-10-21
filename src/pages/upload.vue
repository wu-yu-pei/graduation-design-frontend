<template>
  <div class="upload">
    <el-upload v-model:file-list="fileList" class="upload-demo"
      action="https://api.super-project.wuyupei.top/api/pg/upload" :on-remove="handleRemove"
      :before-remove="beforeRemove" :on-exceed="handleExceed">
      <el-button type="primary">点击上传</el-button>
      <template #tip>
        <div class="el-upload__tip">
          .txt files
        </div>
      </template>
    </el-upload>
  </div>
</template>

<script setup>
const afterRead = (file) => {
  // 此时可以自行将文件上传至服务器
  console.log(file);
};
</script>

<style scoped></style>