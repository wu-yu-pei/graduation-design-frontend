<template>
  <div class="aside-body">
    <el-menu :router="true" :default-active="routes[0].index" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
      <template v-for="(item, index) in routes" :key="index">
        <el-menu-item :index="item.index">
          <el-icon><icon-menu /></el-icon>
          <span>{{ item.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
const routes = [
  { title: '系统介绍', index: '/main/SystemIntroduce' },
  { title: '我的商品', index: '/main/MyShops' },
  { title: '我要发货', index: '/main/WoYaoFaHuo' },
  { title: '我的发货', index: '/main/WoDeFaHuo' },
  { title: '物流总览', index: '/main/Wului' },
];
</script>

<style scoped lang="less">
.aside-body {
  height: calc(100% - 60px);
}

.el-menu {
  width: 100%;
  height: 100%;
  .el-menu-item {
    &.is-active {
      color: #fff;
      background-color: #545c64;
    }
    &:hover {
      color: #fff;
      background-color: #545c64;
    }
  }
}
</style>
