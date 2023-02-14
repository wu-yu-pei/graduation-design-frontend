<template>
  <div class="header-left">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/main/SystemIntroduce' }">首页</el-breadcrumb-item>
      <Transition>
        <el-breadcrumb-item v-if="isAnimation">
          <a href="javascript:;">{{ currentMenu.title }}</a>
        </el-breadcrumb-item>
      </Transition>
    </el-breadcrumb>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const menu = [
  { title: '系统介绍', index: '/main/SystemIntroduce', icon: 'House' },
  { title: '我的货物', index: '/main/MyShops', icon: 'ShoppingBag' },
  {
    title: '物流管理',
    icon: 'House',
    children: [
      {
        title: '我要发货',
        index: '/main/WoYaoFahuo',
        icon: 'Coordinate',
      },
      {
        title: '我的物流',
        index: '/main/WoDeFahuo',
        icon: 'Van',
      },
    ],
  },
  { title: '物流流向', index: '/main/WuLui', icon: 'Refresh' },
  { title: '智能物流', index: '/main/ZhiNengWuLui', icon: 'Headset' },
];
const isAnimation = ref(true);
const route = useRoute();

const currentMenu = computed(() => {
  const path = route.fullPath;
  isAnimation.value = false;
  setTimeout(() => {
    isAnimation.value = true;
  }, 200);
  return findNameByPath(menu, path);
});

function findNameByPath(menu, path) {
  const map = menu.reduce((pur, cur) => {
    if (cur.children) {
      pur.push(...cur.children.map((item) => ({ ...item, parentTitle: cur.title })));
    } else {
      pur.push(cur);
    }
    return pur;
  }, []);
  return map.find((item) => item.index == path);
}
</script>

<style scoped lang="less">
.v-enter-active,
.v-leave-active {
  transition: all 200ms ease;
}

.v-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}
.v-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.v-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.v-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>
