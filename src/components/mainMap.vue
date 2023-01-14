<template>
  <div id="map" absolute top-0 left-0 right-0 bottom-0 z1></div>
</template>

<script setup>
import { defineExpose } from 'vue';
import AMapLoader from '@amap/amap-jsapi-loader';
import useAppStore from '../store/app';

const appStore = useAppStore();
let map = '';
let AMap = '';
let loca = '';

function getMap() {
  return map;
}
function getLoca() {
  return loca;
}

defineExpose({ map, AMap, loca, getMap, getLoca });

function initMap() {
  AMapLoader.load({
    key: '62bf752ab1f963e58a757af1298be24c',
    version: '2.0',
    plugins: ['AMap.Driving', 'AMap.PlaceSearch', 'AMap.AutoComplete', 'AMap.GeometryUtil', 'AMap.MoveAnimation'],
    Loca: {
      // 是否加载 Loca， 缺省不加载
      version: '2.0', // Loca 版本
    },
  })
    .then((AMap) => {
      // 根据时间动态设置样式
      let mapStyle = 'amap://styles/darkblue';
      if (appStore.isDaylight) {
        // 是否是白天 如果是白天就设置为白天的样式
        mapStyle = 'amap://styles/normal';
      }
      map = new AMap.Map('map', {
        zoom: 7, //级别
        mapStyle, //设置地图的显示样式
        viewMode: '3D', //使用3D视图
      });
      // 高德可视化插件 初始化
      loca = new Loca.Container({
        map,
      });

      // 地图加载完成
      map.on('complete', () => {
        console.log('---map load complete---');
      });
    })
    .catch((e) => {
      console.error(e); //加载错误提示
    });
}

onMounted(() => {
  initMap();
});
</script>

<style scoped></style>
