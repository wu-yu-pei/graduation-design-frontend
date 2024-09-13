<template>
  <div class="search">
    <el-form>
      <el-form-item label="商户号:" label-width="80px">
        <el-input v-model="data.b" placeholder="请输入商户号"></el-input>
      </el-form-item>
      <el-form-item label="开始日期:" label-width="80px">
        <el-config-provider :locale="zhCn">
          <el-date-picker v-model="startDate" type="datetime" placeholder="请选择开始日期" format="YYYY-MM-DD" date-format="YYYY-MM-DD" time-format="HH:mm" />
        </el-config-provider>
      </el-form-item>
      <el-form-item label="结束日期:" label-width="80px">
        <el-config-provider :locale="zhCn">
          <el-date-picker v-model="endDate" type="datetime" placeholder="请选择结束日期" format="YYYY-MM-DD" date-format="YYYY-MM-DD" time-format="HH:mm" />
        </el-config-provider>
      </el-form-item>
      <el-button type="primary" size="large" @click="search">
        <el-icon><Search /></el-icon>
        <span>搜索</span>
      </el-button>
    </el-form>
  </div>
</template>

<script setup>
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import request from '../service/index';
import { ElMessage } from 'element-plus';

const startDate = ref('');
const endDate = ref('');

const data = ref({
  b: '',
  dates: [],
});

function getDatesBetween(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start > end) {
    throw new Error('startDate must be before or equal to endDate');
  }

  const dates = [];
  let currentDate = new Date(start);

  while (currentDate <= end) {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

async function search() {
  if (!data.value.b) {
    ElMessage.warning('请输入商户号');
    return;
  }
  if (!startDate.value || !endDate.value) {
    ElMessage.warning('请输入开始日期和结束日期');
    return;
  }

  const res = await request.request({
    method: 'POST',
    url: '/pg/query',
    data: {
      b: data.value.b,
      dates: getDatesBetween(startDate.value, endDate.value).join(','),
    },
  });

  if (res.data.data.length === 0) {
    ElMessage.warning('未查询到数据');
  } else {
    ElMessage.success(`查询成功:${res.data.data[0]}`);
  }
}
</script>

<style scoped lang="less">
.search {
  padding: 10px;
}
.el-button {
  width: 100%;
}
span {
  letter-spacing: 5px;
}
:deep(.el-date-editor) {
  width: 100%;
}
</style>
