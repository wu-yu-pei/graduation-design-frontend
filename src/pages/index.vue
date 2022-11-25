<template>
  <div class="main" reactive w100vw h100vh>
    <div class="main-left" :class="{ hidden: leftIsShow }" px-10 absolute w300 b-1 border-transparent top-20 left--320 bottom-20 rd-10 bg-white z2>
      <div text-center my-10 font700 flex justify-between items-center>
        <span i-material-symbols-arrow-back w20 h20 inline-block cursor-pointer @click="leftIsShow = false"></span>
        <span>我的订单</span>
      </div>
      <div class="circle" bg-red w20 h20 absolute top-10 :style="{ right: leftIsShow ? '320px' : '-40px' }" @click="leftIsShow = true">
        <span i-material-symbols-arrow-forward w20 h20 inline-block bg-white cursor-pointer color-white></span>
      </div>
      <Item></Item>
      <Item></Item>
      <Item></Item>
      <Item></Item>
      <Item></Item>
      <Item></Item>
      <Item></Item>
      <Item></Item>
    </div>
    <div class="main-right" absolute w250 b-1 border-transparent top-20 right-20 bottom-20 rd-10 bg-white z2></div>
    <div id="map" absolute top-0 left-0 right-0 bottom-0 z1></div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: default
</route>

<script setup>
import Item from '../components/item.vue';

let leftIsShow = ref(true);
function initMap() {
  // todo 根据时间 动态切换地图
  const map = new AMap.Map('map', {
    zoom: 11, //级别
    mapStyle: 'amap://styles/darkblue', //设置地图的显示样式
    viewMode: '3D', //使用3D视图
  });

  map.on('complete', function () {});
}

onMounted(() => {
  initMap();
});
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
.main-right {
  height: calc(100% - 40px);
  background-color: rgba(255, 255, 255, 1);
}
</style>
