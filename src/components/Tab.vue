<template>
  <div class="tabs">
    <el-tag v-for="(tab, index) of tabs" size="large" :class="{ active: activeIndex == index }" :key="tab" @click="tabClick(tab, index)" :closable="tab.isCanClose" @close="handleClose(tab, index)">
      {{ tab.name }}
    </el-tag>
  </div>
</template>

<script setup>
import { useStorage } from '@vueuse/core';
import { useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const tabs = useStorage('tabs', [{ name: '系统介绍', path: '/main/SystemIntroduce', isCanClose: false }], sessionStorage);
// const tabs =  reactive([{ name: '系统介绍', path: '/main/SystemIntroduce', isCanClose: false }]);
let activeIndex = ref(0);
watch(
  route,
  () => {
    if (tabs.value.find((item) => item.name == route.meta.name)) {
      activeIndex.value = tabs.value.findIndex((item) => item.name == route.meta.name);
      return;
    }
    tabs.value.push({
      name: route.meta.name,
      path: route.fullPath,
      isCanClose: true,
    });
    activeIndex.value = tabs.value.findIndex((item) => item.name == route.meta.name);
  },
  {
    immediate: true,
  }
);

function handleClose(tab) {
  const index = tabs.value.findIndex((item) => item.name == tab.name);

  if (index == activeIndex.value) {
    tabs.value.splice(index, 1);
    router.replace(tabs.value[tabs.value.length - 1].path);
  } else if (index < activeIndex.value) {
    tabs.value.splice(index, 1);
    activeIndex.value = activeIndex.value - 1;
  } else {
    tabs.value.splice(index, 1);
  }
}

function tabClick(tab, index) {
  activeIndex.value = index;
  router.replace(tab.path);
}
</script>

<style lang="less" scoped>
.tabs {
  display: flex;
  flex-shrink: 0;
  align-items: flex-end;
  height: 44px;
  padding: 0 20px;
  overflow-y: scroll;
}
.el-tag {
  position: relative;
  cursor: pointer;
  color: #fff;
  background-color: #fff;
  color: #545c64;
  letter-spacing: 3px;
  margin-left: 3px;
  border-radius: 0;
  border-bottom: none;
  &:hover {
    background-color: #545c64;
    color: #fff;
  }
  .el-icon {
    color: #ccc;
  }
  &.active {
    background-color: #545c64;
    color: #fff;
  }
}
</style>
