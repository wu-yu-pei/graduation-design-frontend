<template>
  <div class="hasin">
    <van-field v-model="data.b" placeholder="请输入商户号" label="商户号" />

    <van-button type="primary" @click="search">查询</van-button>
    {{ info }}
  </div>
</template>

<script setup>
import request from '../service/index';

const data = ref({
  b: '',
});
const info = ref('')

async function search() {
  if (!data.value.b) {
    ElMessage.warning('请输入商户号');
    return;
  }

  const res = await request.request({
    method: 'POST',
    url: '/pg/find',
    data: {
      b: data.value.b,
    },
  });

  if (res.data.data.length === 0) {
    ElMessage.warning('未查询到数据');
  } else {
    ElMessage.success('有报名记录');
  }
}
</script>

<style scoped>
.hasin {
  padding: 20px 10px;
}

.van-button {
  width: 100%;
  margin-top: 20px;
}
</style>