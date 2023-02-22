<template>
  <div class="content">
    <Map ref="mapRef"></Map>
    <div class="btns">
      <el-button @click="showShopFlow">运输流向（飞线图）</el-button>
      <el-button @click="showShopTransport">运输流向（运输图）</el-button>
      <el-button @click="showAllShop">全部物流</el-button>
      <el-button @click="showCount">数量分布</el-button>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  name: 物流流向
</route>

<script setup>
import useAppStore from '../../store/app';

import { findShop } from '../../service/home';
const mapRef = ref(null);

let appStore = useAppStore();
let shops = reactive({});

findShop(appStore.userInfo.id).then((res) => {
  shops = res.data;
});

function showShopFlow() {
  const map = mapRef.value.getMap();
  const loca = mapRef.value.getLoca();
  loca.clear();
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
      return feat.link.properties.type === 0 ? ['#25CDEA'] : ['red', '#ff00ee'];
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
    texture: 'https://a.amap.com/Loca/static/loca-v2/demos/images/breath_yellow.png',
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
    texture: 'https://a.amap.com/Loca/static/loca-v2/demos/images/breath_red.png',
    borderWidth: 0,
    duration: 1000,
    animate: true,
  });

  // 启动渲染动画
  loca.animate.start();
}

function showShopTransport() {
  const map = mapRef.value.getMap();
  mapRef.value.getLoca().clear();
  map.setZoom(6);
  map.setPitch(0);

  // 线
  let inLineSource = new Loca.GeoJSONSource({
    data: shops.reduce(
      (p, cur) => {
        p.features.push({
          type: 'Feature',
          properties: {
            type: 1,
          },
          geometry: {
            type: 'LineString',
            coordinates: [cur.start_position_geo.split(','), cur.end_position_geo.split(',')],
          },
        });
        return p;
      },
      { type: 'FeatureCollection', features: [] }
    ),
  });

  var outLinelayer = new Loca.PulseLineLayer({
    // loca,
    zIndex: 11,
    opacity: 1,
    visible: true,
    zooms: [2, 22],
  });

  outLinelayer.setStyle({
    altitude: 0,
    lineWidth: 3,
    headColor: 'red',
    trailColor: 'blue',
    interval: 0.25,
    duration: 5000,
  });
  outLinelayer.setSource(inLineSource);
  mapRef.value.getLoca().add(outLinelayer);

  // 呼吸点
  var scatter = new Loca.ScatterLayer({
    zIndex: 10,
    opacity: 1,
    visible: true,
    zooms: [2, 22],
  });

  var scatterGeo = new Loca.GeoJSONSource({
    data: shops.reduce(
      (p, cur) => {
        p.features.push({
          type: 'Feature',
          properties: {
            type: 0,
          },
          geometry: {
            type: 'Point',
            coordinates: cur.end_position_geo.split(','),
          },
        });
        return p;
      },
      { type: 'FeatureCollection', features: [] }
    ),
  });
  scatter.setSource(scatterGeo);
  scatter.setStyle({
    size: [50, 50],
    borderWidth: 0,
    texture: 'https://a.amap.com/Loca/static/loca-v2/demos/images/breath_yellow.png',
    duration: 2000,
    animate: true,
  });
  mapRef.value.getLoca().add(scatter);

  mapRef.value.getLoca().animate.start();
}

function showAllShop() {
  const map = mapRef.value.getMap();
  mapRef.value.getLoca().clear();
  var infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(10, 0) });

  for (var i = 0; i < shops.length; i++) {
    var marker = new AMap.Marker({
      position: shops[i].current_position_geo.split(','),
      map: map,
      icon: new AMap.Icon({
        image: '/image/project_icon2.png',
        imageSize: new AMap.Size(30, 30),
      }),
    });
    marker.content = `
      <div class="point-marker-body">
        <div class="name">${shops[i].name}</div>
        <div class="address">当前位置：${shops[i].current_position}</div>
      </div>
    `;
    marker.on('click', markerClick);
  }

  function markerClick(e) {
    const map = mapRef.value.getMap();
    map.setCenter(e.target._position);
    infoWindow.setContent(e.target.content);
    infoWindow.open(map, e.target.getPosition());
  }

  map.setFitView();
}

function showCount() {
  // var loca = mapRef.value.getLoca();
  // var opts = {
  //   subdistrict: 0, //获取边界不需要返回下级行政区
  //   extensions: 'all', //返回行政区边界坐标组等具体信息
  //   level: 'city', //查询行政级别为 市
  // };
  // var district = new AMap.DistrictSearch(opts);
  // district.search('河南省', (status, res) => {
  //   console.log(res);
  // });
  console.log('----------------------');
}
</script>
<style lang="less">
.point-marker-body {
  width: 200px;
  padding-top: 10px;
}
</style>

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
