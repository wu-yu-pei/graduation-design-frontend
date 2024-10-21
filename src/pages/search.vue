<template>
  <div class="search">
    <div class="query-container">
      <van-field v-model="startDate" label="开始日期" readonly clickable @click="showCalendar = true"
        placeholder="选择开始日期" />

      <van-field v-model="endDate" label="结束日期" readonly clickable @click="showCalendar = true" placeholder="选择结束日期" />

      <van-field v-model="data.b" placeholder="请输入商户号" label="商户号" />

      <van-button type="primary" @click="search">查询</van-button>

      <van-calendar v-model:show="showCalendar" type="range" @confirm="onConfirm" :min-date="new Date(2022, 0, 1)" :max-date="new Date(2025, 0, 31)" />
    </div>
  </div>
</template>

<script setup>
import request from '../service/index';
import { ElMessage } from 'element-plus';
const results = ref([]);
const showCalendar = ref(false);

const startDate = ref('');
const endDate = ref('');

const onConfirm = (value) => {
  const formatDate = (date) => `${date.getFullYear()} / ${date.getMonth() + 1} / ${date.getDate()}`;
  showCalendar.value = false;
  startDate.value = formatDate(new Date(value[0]));
  endDate.value = formatDate(new Date(value[1]));
};

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

.van-button {
  width: 100%;
  margin-top: 20px;
}

</style>
