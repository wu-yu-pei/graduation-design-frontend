<template>
  <div id="map" absolute top-0 left-0 right-0 bottom-0 z1></div>
</template>

<script setup>
import AMapLoader from '@amap/amap-jsapi-loader';
import useAppStore from '../store/app';
const appStore = useAppStore();

function initMap() {
  AMapLoader.load({
    key: '62bf752ab1f963e58a757af1298be24c',
    version: '2.0',
    plugins: ['AMap.Driving'],
    Loca: {
      // 是否加载 Loca， 缺省不加载
      version: '2.0', // Loca 版本
    },
  })
    .then((AMap) => {
      const map = new AMap.Map('map', {
        zoom: 7, //级别
        mapStyle: 'amap://styles/darkblue', //设置地图的显示样式
        viewMode: '3D', //使用3D视图
      });
      // 高德可视化插件 初始化
      let loca = new Loca.Container({
        map,
      });

      appStore.AMap = AMap;
      appStore.map = map;
      appStore.loca = loca;

      // 地图加载完成
      map.on('complete', () => {});
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
