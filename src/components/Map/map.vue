<template>
  <div id="map"></div>
</template>

<script setup>
import AMapLoader from '@amap/amap-jsapi-loader';
let map = '';
let Amap = '';
let loca = '';
let emit = defineEmits(['mapLoadComplete']);

function getMap() {
  return map;
}

function getAMap() {
  return Amap;
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
      Amap = AMap;
      map = new AMap.Map('map', {
        zoom: 7, //级别
        mapStyle: 'amap://styles/fresh', //设置地图的显示样式
        viewMode: '3D', //使用3D视图
      });
      // 高德可视化插件 初始化
      loca = new Loca.Container({
        map,
      });

      map.on('complete', function () {
        emit('mapLoadComplete');
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
  width: 100%;
  height: 100%;
}
</style>
