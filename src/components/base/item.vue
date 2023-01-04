<template>
  <div class="item" my-10 p-10 b-rd-10>
    <div lh-25>
      <span mr-10>商品名称:</span>
      {{ info.name }}
    </div>
    <div lh-25>
      <span mr-10>发货地址:</span>
      {{ info.start_position }}
    </div>
    <div lh-25>
      <span mr-10>收获地址:</span>
      {{ info.end_position }}
    </div>
    <div lh-25>
      <span mr-10>发货时间:</span>
      {{ dayjs(info.time * 1).format('YYYY MM-DD HH:mm:ss') }}
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs';
const props = defineProps({
  info: {
    type: Object,
  },
});
</script>

<style scoped lang="less">
.item {
  background-color: #f1f1f1;
  cursor: pointer;
}
</style>
