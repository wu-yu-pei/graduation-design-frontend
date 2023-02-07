<template>
  <div id="map"></div>
</template>

<script setup>
import AMapLoader from '@amap/amap-jsapi-loader';
let map = '';
let AMap = '';
let loca = '';

function getMap() {
  return map;
}

function getAMap() {
  return AMap;
}

function getLoca() {
  return loca;
}

defineExpose({ getMap, getAMap, getLoca });

function initMap() {
  AMapLoader.load({
    key: '62bf752ab1f963e58a757af1298be24c',
    version: '2.0',
    plugins: ['AMap.Driving', 'AMap.PlaceSearch', 'AMap.AutoComplete', 'AMap.GeometryUtil'],
    Loca: {
      version: '2.0',
    },
  })
    .then((AMap) => {
      AMap = AMap;
      map = new AMap.Map('map', {
        zoom: 7, //级别
        mapStyle: 'amap://styles/fresh', //设置地图的显示样式
        viewMode: '3D', //使用3D视图
      });
      // 高德可视化插件 初始化
      loca = new Loca.Container({
        map,
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

<style scoped lang="less">
#map {
  width: calc(100% + 40px);
  height: calc(100% + 40px);
  margin: -20px;
}
</style>
