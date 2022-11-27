<template>
  <div class="main-right" absolute w400 b-1 border-transparent top-20 right-20 bottom-20 rd-10 z2 flex flex-col>
    <div class="right-top" flex justify-between items-center gap20>
      <div class="top-image" w50 h50 bg-white p2 b-rd-10>
        <img w46 h46 b-rd-10 src="https://lh3.googleusercontent.com/ogw/AOh-ky0thmu99DxORVxF34FhA7Vs7XYWiEtg5V9fcd6T=s32-c-mo" alt="" />
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
  </div>
</template>

<script setup>
import { nextTick } from 'vue';
import { createShop } from '../service/home';
import { findShop } from '../service/home';
import useAppStore from '../store/app';
const appStore = useAppStore();
const name = ref('');

let shops = reactive({});

findShop('0').then((res) => {
  shops = res.data;
});

const { AMap, map, loca } = storeToRefs(appStore);

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
    return alert('商品名不能为空');
  }
  if (!start.position.trim()) {
    return alert('发货地址不能为空');
  }
  if (!start.position.trim()) {
    return alert('收获地址不能为空');
  }
  createShop({ name: name.value, start_position: start.position, end_position: end.position, start_position_geo: start.position_geo, end_position_geo: end.position_geo }).then((res) => {
    console.log(res);
  });
}

function showShopFlow() {
  map.value.setZoom(5);
  map.value.setPitch(40);
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
  loca.value.add(linkLayer);

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
    loca: loca.value,
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
  console.log(loca.value);
  var breathYellow = new Loca.ScatterLayer({
    loca: loca.value,
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
  loca.value.animate.start();
}

function showShopCountDistribution() {}

// 监听 如果AMap map有值 就去加载插件
watch(
  () => [appStore.AMap, appStore.map],
  ([AMap, map], _) => {
    // 搜索提示插件

    // plugin
    AMap.plugin(['AMap.PlaceSearch', 'AMap.AutoComplete'], function () {
      let autoOptions = {
        input: 'start-position',
      };
      let auto = new AMap.AutoComplete(autoOptions);
      let placeSearch = new AMap.PlaceSearch({
        map: map,
      }); //构造地点查询类
      auto.on('select', select); //注册监听，当选中某条记录时会触发
      function select(e) {
        // placeSearch.setCity(e.poi.adcode);
        if (!e.poi.location) {
          return alert('请输入详细地址');
        }
        console.log(e);
        start.name = e.poi.name;
        start.position = e.poi.name;
        start.position_geo = `${e.poi.location.lng}, ${e.poi.location.lat}`;
      }
    });
    // plugin
    AMap.plugin(['AMap.PlaceSearch', 'AMap.AutoComplete'], function () {
      let autoOptions = {
        input: 'end-position',
      };
      let auto = new AMap.AutoComplete(autoOptions);
      let placeSearch = new AMap.PlaceSearch({
        map: map,
      }); //构造地点查询类
      auto.on('select', select); //注册监听，当选中某条记录时会触发
      function select(e) {
        if (!e.poi.location) {
          return alert('请输入详细地址');
        }
        console.log(e);
        end.name = e.poi.name;
        end.position = e.poi.name;
        end.position_geo = `${e.poi.location.lng}, ${e.poi.location.lat}`;
      }
    });
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
