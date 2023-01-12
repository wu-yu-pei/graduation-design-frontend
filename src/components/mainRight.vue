<template>
  <div class="main-right" absolute w400 b-1 border-transparent top-20 right-20 bottom-20 rd-10 z2 flex flex-col>
    <div class="right-top" flex justify-between items-center gap20>
      <div class="top-image" w50 h50 bg-white p2 b-rd-10>
        <img w46 h46 b-rd-10 src="https://wuyupei.top:8888/upload/82cb385f028de68e02ddd7b14.jpg" alt="" />
      </div>
      <div class="top-name" bg-white flex-1 h50 text-center lh-50 b-rd-10>Growing,欢迎使用物流追踪系统</div>
    </div>
    <div class="right-contorls" h100px my-20 flex gap10>
      <div btn @click="showShopFlow">货物流向</div>
      <div btn @click="showShopCountDistribution">数量分布</div>
    </div>
    <div class="right-content" flex-1 bg-white>
      <div class="label" fs-20 fw-800>我要发货</div>
      <div class="form">
        <div class="item">
          <div class="label">商品名称:</div>
          <div class="input">
            <input v-model="name" type="text" />
          </div>
        </div>
        <div class="item">
          <div class="label">发货地址:</div>
          <div class="input">
            <input type="text" id="start-position" />
          </div>
        </div>
        <div class="item">
          <div class="label">收获地址:</div>
          <div class="input">
            <input type="text" id="end-position" />
          </div>
        </div>
        <div class="button" @click="fahuo">发货</div>
      </div>
    </div>
    <div class="right-control">
      <div f-c-c btn absolute bottom-0 b-blue left--60 w50 h50 border-rd-10 transition-500 hover:bg-blue @click="toggleDark">
        <div i-material-symbols-sunny-outline-rounded w40 h40 v-show="!appStore.isDaylight"></div>
        <div i-material-symbols-dark-mode-outline w40 h40 v-show="appStore.isDaylight"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { findShop } from '../service/home/index';
import { createShop } from '../service/home';
import useAppStore from '../store/app';
import { storeToRefs } from 'pinia';

const appStore = useAppStore();
const { isDaylight, map, mapRef } = storeToRefs(appStore);

function toggleDark() {
  isDaylight.value = !isDaylight.value;
  if (isDaylight.value) {
    mapRef.value.getMap().setMapStyle('amap://styles/normal');
  } else {
    mapRef.value.getMap().setMapStyle('amap://styles/darkblue');
  }
}

// 1.0 货物流向
let shops = reactive({});

findShop('0').then((res) => {
  shops = res.data;
});

function showShopFlow() {
  const map = mapRef.value.getMap();
  const loca = mapRef.value.getLoca();

  map.setZoom(5);
  map.setPitch(40);

  var linkLayer = new Loca.PulseLinkLayer({
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

// 2.0发货-------------------
const name = ref('');

const start = reactive({
  name: '',
  position: '',
  position_geo: '',
});

const end = reactive({
  name: '',
  position: '',
  position_geo: '',
});

// 点击发货按钮 去发货
function fahuo() {
  if (!name.value.trim()) {
    return ElMessage({
      message: '商品名不能为空',
      type: 'error',
    });
  }
  if (!start.position.trim()) {
    return ElMessage({
      message: '发货地址/位置信息不能为空',
      type: 'error',
    });
  }
  if (!start.position.trim()) {
    return ElMessage({
      message: '收获地址/位置信息不能为空',
      type: 'error',
    });
  }
  createShop({ name: name.value, start_position: start.position, end_position: end.position, start_position_geo: start.position_geo, end_position_geo: end.position_geo }).then((res) => {
    console.log(res);
  });
}

function showShopCountDistribution() {}

onMounted(() => {});

// 监听 如果 map有值  说明插件加载完成了
watch(
  () => appStore.map,
  (_, __) => {
    const placeSearch = new AMap.PlaceSearch({ map: appStore.map });
    const autoCompleteStart = new AMap.AutoComplete({
      input: 'start-position',
    });
    const autoCompleteEnd = new AMap.AutoComplete({
      input: 'end-position',
    });

    autoCompleteStart.on('select', selectStart); //注册监听，当选中某条记录时会触发
    autoCompleteEnd.on('select', selectEnd); //注册监听，当选中某条记录时会触发

    function selectStart(e) {
      if (!e.poi.location) {
        return ElMessage({
          message: '没有该位置坐标信息，请重新选择',
          type: 'error',
        });
      }
      start.name = e.poi.name;
      start.position = e.poi.name;
      start.position_geo = `${e.poi.location.lng}, ${e.poi.location.lat}`;
    }

    function selectEnd(e) {
      if (!e.poi.location) {
        return ElMessage({
          message: '没有该位置坐标信息，请重新选择',
          type: 'error',
        });
      }
      end.name = e.poi.name;
      end.position = e.poi.name;
      end.position_geo = `${e.poi.location.lng}, ${e.poi.location.lat}`;
    }
  }
);
</script>

<style scoped lang="less">
.main-right {
  height: calc(100% - 40px);
}
.right-top {
}
.right-contorls {
}
.right-content {
  padding: 0 10px;
  > .label {
    border-left: 5px solid blue;
    border-radius: 5px 0 0 5px;
    padding-left: 5px;
    margin: 10px 0;
  }
  .form {
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 15px 0;
      .label {
        width: 90px;
        font-size: 16px;
      }
      .input {
        flex: 1;
        input {
          width: 100%;
          height: 100%;
          outline: none;
          border: none;
          border-bottom: 1px solid #000;
        }
      }
    }
    .button {
      background: #000;
      color: #fff;
      text-align: center;
      letter-spacing: 20px;
      font-size: 20px;
      padding: 5px 10px;
      cursor: pointer;
      &:hover {
        background-color: #fff;
        color: #000;
      }
    }
  }
}
</style>
