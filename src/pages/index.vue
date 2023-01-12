<template>
  <div class="main" relative w100vw h100vh>
    <MainLeft></MainLeft>
    <MainMap ref="mapRef"></MainMap>
    <MainRight @show-shop-flow="showShopFlow"></MainRight>
  </div>
</template>

<route lang="yaml">
meta:
  layout: default
</route>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import MainLeft from '../components/mainLeft.vue';
import MainMap from '../components/mainMap.vue';
import MainRight from '../components/mainRight.vue';
import { findShop } from '../service/home';
import useAppStore from '../store/app';
const router = useRouter();
const appStore = useAppStore();
if (!appStore.token) {
  router.replace('/login');
}

const mapRef = ref(null);

watch(
  () => mapRef.value,
  (n) => {
    appStore.mapRef = n;
  }
);
let shops = reactive({});

findShop('0').then((res) => {
  shops = res.data;
});

function showShopFlow() {
  const map = mapRef.value.getMap();
  const loca = mapRef.value.getLoca();

  map.setZoom(5);
  map.setPitch(40);

  let linkLayer = new Loca.LinkLayer({
    zIndex: 20,
    opacity: 1,
    visible: true,
    zooms: [2, 22],
  });
  // 线
  let features = shops.map((item, index) => {
    return {
      type: 'Feature',
      properties: {
        type: item.status,
      },
      geometry: {
        type: 'LineString',
        coordinates: [item.start_position_geo.split(','), item.end_position_geo.split(',')],
      },
    };
  });

  const source = new Loca.GeoJSONSource({
    data: {
      type: 'FeatureCollection',
      features,
    },
  });
  linkLayer.setSource(source);
  linkLayer.setStyle({
    lineColors: function (index, item) {
      return item.link.properties.type === 0 ? ['#FFD87B', '#FF4F00'] : ['#25CDEA', '#12BFBF'];
    },
    height: function (index, item) {
      console.log(item);
      return item.distance / 3;
    },
    smoothSteps: function (index, item) {
      return 200;
    },
  });
  loca.add(linkLayer);

  // 红色 呼吸点
  const pointsRed = shops
    .filter((item, index) => item.status == 0)
    .map((item, index) => {
      return {
        type: 'Feature',
        properties: {
          type: 1,
        },
        geometry: {
          type: 'Point',
          coordinates: item.end_position_geo.split(','),
        },
      };
    });
  var geoLeveRed = new Loca.GeoJSONSource({
    data: {
      type: 'FeatureCollection',
      features: pointsRed,
    },
  });
  var breathRed = new Loca.ScatterLayer({
    loca: loca,
    zIndex: 113,
    opacity: 1,
    visible: true,
    zooms: [2, 22],
  });

  breathRed.setSource(geoLeveRed);

  breathRed.setStyle({
    unit: 'meter',
    size: [100000, 100000],
    borderWidth: 0,
    texture: 'https://a.amap.com/Loca/static/loca-v2/demos/images/breath_red.png',
    duration: 500,
    animate: true,
  });

  // 黄色呼吸点
  const pointsYellow = shops
    .filter((item, index) => item.status == 1)
    .map((item, index) => {
      return {
        type: 'Feature',
        properties: {
          type: 1,
        },
        geometry: {
          type: 'Point',
          coordinates: item.end_position_geo.split(','),
        },
      };
    });
  var geoLeveYellow = new Loca.GeoJSONSource({
    data: {
      type: 'FeatureCollection',
      features: pointsYellow,
    },
  });
  var breathYellow = new Loca.ScatterLayer({
    loca: loca,
    zIndex: 112,
    opacity: 1,
    visible: true,
    zooms: [2, 22],
  });
  breathYellow.setSource(geoLeveYellow);
  breathYellow.setStyle({
    unit: 'meter',
    size: [100000, 100000],
    borderWidth: 0,
    texture: 'https://a.amap.com/Loca/static/loca-v2/demos/images/breath_yellow.png',
    duration: 1000,
    animate: true,
  });

  // 启动渲染动画
  loca.animate.start();
}
</script>

<style scoped lang="less"></style>
