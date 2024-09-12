<template>
  <div class="index">
    <li v-for="item in list">
      {{ item.book_name }}
    </li>
  </div>
</template>

<script setup>
import request from '../service/index';
const list = ref([]);

async function getList() {
  const res = await request.get({
    url: '/juejin/book',
  });
  list.value = res.data.data;
}

getList();
</script>

<style scoped lang="less">
.index {
  width: 100vw;
  height: 100vh;
  overflow: scroll;
}
li {
  list-style: none;
  margin: 10px 0;
}
</style>
