<template>
  <div class="search">
    <div class="query-container">
      <van-field v-model="startDate" label="开始日期" readonly clickable @click="showCalendar = true"
        placeholder="选择开始日期" />

      <van-field v-model="endDate" label="结束日期" readonly clickable @click="showCalendar = true" placeholder="选择结束日期" />

      <van-field v-model="data.b" placeholder="请输入商户号" label="商户号" />

      <van-button type="primary" @click="search">查询</van-button>

      <van-calendar v-model:show="showCalendar" type="multiple" @confirm="onConfirm" :min-date="new Date(2022, 0, 1)" :max-date="new Date(2025, 0, 31)" />
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

const data = ref({
  b: '',
  dates: [],
});

const onConfirm = (value) => {
  console.log(value);
  const formatDate = (date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  startDate.value = formatDate(new Date(value[0]));
  endDate.value = formatDate(new Date(value[value.length - 1]));
  data.value.dates = value.map(item => formatDate(new Date(item))).join(",")
  showCalendar.value = false;
};

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
      dates: data.value.dates,
    },
  });

  if (res.data.data.length === 0) {
    ElMessage.warning('未查询到数据');
  } else {
    const money = res.data.data.reduce((acc, cur) => acc + cur.g * 1, 0);
    ElMessage.success(`查询成功: ${money / 100} 元`);
  }
}
</script>

<style scoped lang="less">
.search {
  padding: 20px 10px;
}

.van-button {
  width: 100%;
  margin-top: 20px;
}

</style>
