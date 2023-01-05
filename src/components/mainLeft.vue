<template>
  <div class="main-left" :class="{ hidden: leftIsShow }" px-10 absolute w300 b-1 border-transparent top-20 left--320 bottom-20 rd-10 bg-white z2>
    <div text-center my-10 font700 flex justify-between items-center>
      <span i-material-symbols-arrow-back w20 h20 inline-block cursor-pointer @click="leftIsShow = false"></span>
      <span>我的物流</span>
    </div>
    <div class="circle" bg-red w20 h20 absolute top-10 :style="{ right: leftIsShow ? '320px' : '-40px' }" @click="leftIsShow = true">
      <span i-material-symbols-arrow-forward w20 h20 inline-block bg-white cursor-pointer color-white></span>
    </div>
    <template v-for="(item, index) in shopList">
      <Item :info="item" @click="handleItemClick(index)"></Item>
    </template>

    <!-- 弹出框 -->
    <!-- <el-dialog v-model="isShowDialog" title="Tips" width="30%" draggable>
      <span>It's a draggable Dialog</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isShowDialog = false">Cancel</el-button>
          <el-button type="primary" @click="isShowDialog = false"> Confirm </el-button>
        </span>
      </template>
    </el-dialog> -->
  </div>
</template>

<script setup>
import { findShop } from '../service/home';
import Item from '../components/base/item.vue';
let leftIsShow = ref(true);
let shopList = ref([]);

findShop(0).then((res) => {
  shopList.value = res.data;
});

// let isShowDialog = ref(false);
// let currentInfo = ref({});
// function handleItemClick(index) {
//   isShowDialog.value = true;
//   currentInfo = shopList[index];
// }
</script>

<style scoped lang="less">
.main-left {
  height: calc(100% - 40px);
  background-color: rgba(255, 255, 255, 1);
  transition: all linear 0.3s;
  .circle {
    background: blue;
    border-radius: 0 10px 10px 0;
    transition: all linear 0.3s;
  }
}
.hidden {
  left: 20px;
}
</style>
