<template>
  <div class="aside-body">
    <el-menu :router="true" :default-active="defaultActive" class="el-menu-vertical-demo">
      <template v-for="item in menu" :key="item.index">
        <template v-if="item.children">
          <el-sub-menu :index="item.index">
            <template #title>
              <el-icon><location /></el-icon>
              <span>{{ item.title }}</span>
            </template>
            <el-menu-item v-for="sItem in item.children" :index="sItem.index">
              <el-icon>
                <component :is="sItem.icon"></component>
              </el-icon>
              <span>{{ sItem.title }}</span>
            </el-menu-item>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index">
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <span>{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const menu = [
  { title: '系统介绍', index: '/', icon: 'House' },
  { title: '我的货物', index: '/MyShops', icon: 'ShoppingBag' },
  {
    title: '物流管理',
    index: '/WoYaoFahuo',
    icon: 'House',
    children: [
      {
        title: '我要发货',
        index: '/WoYaoFahuo',
        icon: 'Coordinate',
      },
      {
        title: '我的物流',
        index: '/WoDeFahuo',
        icon: 'Van',
      },
    ],
  },
  { title: '物流流向', index: '/WuLui', icon: 'Refresh' },
  { title: '智能物流', index: '/ZhiNengWuLui', icon: 'Headset' },
  { title: '个人中心', index: '/Self', icon: 'User' },
];

let defaultActive = ref(menu[0].index);
const route = useRoute();

function findIndexByPath(menu, path) {
  const map = menu.reduce((pur, cur, index) => {
    if (cur.children) {
      pur.push(...cur.children);
    } else {
      pur.push(cur);
    }
    return pur;
  }, []);
  return map.find((item) => item.index == path)?.index || menu[0].index;
}
watch(
  route,
  () => {
    const path = route.fullPath;
    defaultActive.value = findIndexByPath(menu, path);
  },
  {
    immediate: true,
  }
);
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
