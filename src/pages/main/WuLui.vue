<template>
  <div class="content">
    <Map ref="mapRef"></Map>
    <div class="btns">
      <el-button @click="showShopFlow">运输流向</el-button>
      <el-button>数量分布</el-button>
    </div>
  </div>
</template>

<script setup>
import { findShop } from '../../service/home';
const mapRef = ref(null);

let shops = reactive({});

findShop('0').then((res) => {
  shops = res.data;
});

function showShopFlow() {
  const map = mapRef.value.getMap();
  const loca = mapRef.value.getLoca();
  map.setZoom(5);
  map.setPitch(40);

  let linkLayer = new Loca.PulseLinkLayer({
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
    unit: 'meter',
    dash: [40000, 0, 40000, 0],
    lineWidth: function () {
      return [15000, 5000];
    },
    height: function (index, feat) {
      return feat.distance / 3 + 10;
    },
    smoothSteps: 30,
    speed: 150000,
    flowLength: 100000,
    lineColors: function (index, feat) {
      return feat.link.properties.type === 0 ? ['red'] : ['#25CDEA', '#12BFBF'];
    },
    maxHeightScale: 0.3, // 弧顶位置比例
    headColor: 'rgba(0, 0, 255, 1)',
    trailColor: 'rgba(255, 255,0,0)',
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

<style scoped lang="less">
.content {
  position: relative;
  width: calc(100% + 40px);
  height: calc(100% + 40px);
  margin: -20px;
  .btns {
    position: absolute;
    top: 10px;
    left: 10px;
  }
}
</style>
