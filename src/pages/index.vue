<template>
  <div class="index">
    <div class="banner"></div>
    <div class="control">
      <div class="control-item" @click="$router.push('/search')">
        <div class="control-item-icon i-material-symbols:feature-search"></div>
        <div class="control-item-title">报名查询</div>
      </div>
      <div class="control-item">
        <div class="control-item-icon i-material-symbols:background-grid-small-outline">1</div>
        <div class="control-item-title">上传文件</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import request from '../service/index';
</script>

<style scoped lang="less">
.banner {
  height: 200px;
  background: linear-gradient(90deg,#FFF1EB 0%,#ACE0F9 100%);
  margin: 0 10px;
  border-radius: 10px;
}

.control {
  display: flex;
  flex-wrap: wrap;
  margin: 0 20px;
}

.control-item {
  --n: 3; /* 每行显示的子项数量 */
  --item-width: 100px; /* 子项宽度 */
  --space: calc(100% / var(--n) - var(--item-width)); /* 计算子项之间的间距 */
  --m: calc(var(--space) / 2); /* 左右间距的一半 */
  margin: 10px var(--m); /* 动态计算左右的间距 */
}

.control-item-icon {
  width: 30px;
  height: 30px;
  color: #000;
  margin: 0 auto;
  margin-bottom: 10px;
}
</style>
