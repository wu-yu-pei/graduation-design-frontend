<template>
  <div class="item" h140px my-10 p-10 b-rd-10>
    <div lh-25>
      <span mr-10>商品名称:</span>
      {{ shopName }}
    </div>
    <div lh-25>
      <span mr-10>发货地址:</span>
      {{ startAddress }}
    </div>
    <div lh-25>
      <span mr-10>收获地址:</span>
      {{ endAddress }}
    </div>
    <div lh-25>
      <span mr-10>当前地址:</span>
      {{ currentAddress }}
    </div>
    <div lh-25>
      <span mr-10>发货时间:</span>
      {{ time }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  shopName: {
    type: String,
  },
  startAddress: {
    type: String,
  },
  endAddress: {
    type: String,
  },
  currentAddress: {
    type: String,
  },
  time: {
    type: String,
  },
});
</script>

<style scoped lang="less">
.item {
  background-color: #f1f1f1;
  cursor: pointer;
}
</style>
