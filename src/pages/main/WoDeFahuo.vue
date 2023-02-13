<template>
  <div class="my-fahuo">
    <div class="box-card">
      <Title>我的物流</Title>
      <div class="body">
        <el-table :data="shops" style="width: 100%" border="true">
          <el-table-column fixed prop="id" label="id" width="100" />
          <el-table-column fixed prop="name" label="物流名称" width="250" />
          <el-table-column label="物流流向">
            <template #default="scope"> {{ scope.row.start_position }} --> {{ scope.row.end_position }} </template>
          </el-table-column>
          <el-table-column prop="current_position" label="当前地址" />
          <el-table-column label="时间">
            <template #default="scope">
              {{ scope.row.current_time }}
            </template>
          </el-table-column>
          <el-table-column prop="qr_code" label="二维码" width="200">
            <template #default="scope">
              <img :src="scope.row.qr_code" alt="" />
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态">
            <template #default="scope">
              <el-tag v-if="scope.row.status == 0" type="success">已送达</el-tag>
              <el-tag v-else-if="scope.row.status == 1">运输中</el-tag>
              <el-tag v-else-if="scope.row.status == 2" type="danger">已拦截</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" prop="status" label="操作" width="500">
            <template #default="scope">
              <el-button icon="Delete" type="danger" plain>删除</el-button>
              <el-button v-if="scope.row.status == 1" type="danger" plain>拦截</el-button>
              <el-button v-if="scope.row.status == 1" type="primary" plain @click="updateAddress(scope.row)">更新位置</el-button>
              <el-button type="success" plain @click="showLine(scope.row)">运输路线</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog v-model="dialogVisibleAddress" title="位置更新" width="90%" height="80vh" draggable :destroy-on-close="true">
      <div class="content">
        <el-input v-model="toAddress" type="text" id="addressSelect" />
        <div id="panel"></div>
        <Map ref="mapRef" @mapLoadComplete="mapAddressLoadComplete"></Map>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisibleAddress = false">取消</el-button>
          <el-button type="primary" @click="updateAddressConfirm"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogVisibleLine" title="运输路线" width="90%" height="80vh" draggable :destroy-on-close="true">
      <div class="content">
        <Map ref="mapRef" @mapLoadComplete="mapLoadComplete"></Map>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { useDateFormat } from '@vueuse/core';
import { findShop } from '../../service/home/index';

let mapRef = ref(null);
let shops = reactive([]);

findShop('0').then((res) => {
  shops.push(...res.data);
  shops.forEach((item) => {
    item.current_time = useDateFormat(item.current_time * 1, 'YYYY-MM-DD HH:mm:ss');
  });
});

let currentShopInfo = ref();
// 1.0 更新位置
// 要更新的地点搜索
let toAddress = ref('');
let toAllResult = reactive();
let toAddressInfo = ref('');
// 更新位置
let dialogVisibleAddress = ref(false);
function updateAddress(info) {
  dialogVisibleAddress.value = true;
  currentShopInfo.value = info;
}

function updateAddressConfirm() {
  dialogVisibleAddress.value = false;
  let target = document.querySelector('.amap_lib_placeSearch_list ul li.active');
  toAddressInfo.value = toAllResult[target.getAttribute('data-idx')];
  console.log(toAddressInfo.value);
}

function mapAddressLoadComplete() {
  mapRef.value.getMap().clearMap();

  // 搜索插件
  const placeSearch = new AMap.PlaceSearch({
    map: mapRef.value.getMap(),
    pageSize: 5, // 单页显示结果条数
    pageIndex: 1, // 页码
    panel: 'panel', // 结果列表将在此容器中进行展示。
    autoFitView: true,
  });
  // 提示插件
  const autoCompleteSelect = new AMap.AutoComplete({
    input: 'addressSelect',
  });
  // 监听选择
  autoCompleteSelect.on('select', (e) => {
    console.log(e);
    // 搜索
    placeSearch.search(e.poi.name, (status, result) => {
      toAllResult = result.poiList.pois;
    });
  });

  autoCompleteSelect.on('error', (e) => {
    if (e.type == 'error') {
      ElMessage({
        message: e.info,
        grouping: true,
        type: 'error',
      });
    }
  });

  placeSearch.search('郑州东站', (status, result) => {
    toAllResult = result.poiList.pois;
  });
}

// 2.0运输路线
let dialogVisibleLine = ref(false);
function showLine(info) {
  dialogVisibleLine.value = true;
  currentShopInfo.value = info;
}

function mapLoadComplete() {
  mapRef.value.getMap().clearMap();
  const loadingInstance = ElLoading.service({ target: '#map' });
  setTimeout(() => {
    loadingInstance.close();
    getRoundLine();
  }, 1000);
}

function getRoundLine() {
  mapRef.value.getMap().setZoom(4);

  const driving = new AMap.Driving({
    map: mapRef.value.getMap(),
    policy: AMap.DrivingPolicy.LEAST_TIME,
    showTraffic: false,
    autoFitView: false,
  });

  const allFollowPoints = [];
  const startPos = currentShopInfo.value.start_position_geo.split(',');
  const endPos = currentShopInfo.value.end_position_geo.split(',');
  const currentPos = currentShopInfo.value.current_position_geo.split(',');

  // 绘制路线
  driving.search(startPos, endPos, async function (status, result) {
    if (status === 'complete') {
      result.routes.forEach((route) => {
        allFollowPoints.push(...route.steps);
      });
      // 重新绘制路线 原来的颜色不好看
      const path = allFollowPoints.reduce((pre, cur) => {
        pre.push(...cur.path);
        return pre;
      }, []);

      // 创建 infoWindow 实例
      var infoWindow = new AMap.InfoWindow({
        content: `<div>当前物流已到达:<br/>${currentShopInfo.value.current_position}</div>`, //传入 dom 对象，或者 html 字符串
      });

      var marker = new AMap.Marker({
        map: mapRef.value.getMap(),
        icon: new AMap.Icon({
          image: '/image/project_icon2.png',
          imageSize: new AMap.Size(30, 30),
        }),
        size: new AMap.Size(30, 30),
        anchor: 'center',
      });
      marker.on('click', (e) => {
        infoWindow.open(mapRef.value.getMap(), [e.target._position.lng, e.target._position.lat]);
      });
      // 轨迹
      new AMap.Polyline({
        map: mapRef.value.getMap(),
        path: path,
        borderWeight: 2,
        strokeWeight: 10,
        lineJoin: 'round',
        showDir: true,
        strokeColor: '#28F', //线颜色
        strokeWeight: 6, //线宽
      });

      // 已通过的轨迹
      var passedPolyline = new AMap.Polyline({
        map: mapRef.value.getMap(),
        strokeColor: '#AF5', //线颜色
        strokeWeight: 6, //线宽
      });

      // 计算已完成的路线
      const diss = [];
      for (let i = 0; i < path.length; i++) {
        const dis = AMap.GeometryUtil.distance(path[i], new AMap.LngLat(currentPos[0], currentPos[1]));
        diss.push(dis);
      }
      const completeEndPoint = path[diss.indexOf(Math.min(...diss))];

      let completePath = path.slice(
        0,
        path.findIndex((item) => item == completeEndPoint)
      );
      completePath = completePath.map((item) => new AMap.LngLat(item.lng, item.lat));

      // 动态绘制已完成的路线
      for (let i = 0; i < completePath.length; ) {
        if (i % Math.floor(completePath.length / 100) == 0) await sleep(0);
        marker.setPosition(completePath[i]);
        mapRef.value.getMap().setCenter(completePath[i]);
        passedPolyline.setPath(completePath.slice(0, i));
        i += 10;
      }
      mapRef.value.getMap().setZoom(5);
      infoWindow.open(mapRef.value.getMap(), completePath[completePath.length - 1]);
    }
  });
}

function sleep(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

// input 聚焦
function inputFouce(e) {
  let map = mapRef.value.getMap();
  var autoOptions = {
    input: 'tipinput',
  };
  var auto = new AMap.AutoComplete(autoOptions);
  var placeSearch = new AMap.PlaceSearch({
    map: map,
  }); //构造地点查询类
  auto.on('select', select); //注册监听，当选中某条记录时会触发
  function select(e) {
    placeSearch.setCity(e.poi.adcode);
    placeSearch.search(e.poi.name); //关键字查询查询
  }
}
</script>

<style scoped lang="less">
.my-fahuo {
  height: 100%;
}
.box-card {
  width: 100%;
  height: 100%;
}
.body {
  height: calc(100% - 40px);
  margin-top: 20px;
}

.content {
  position: relative;
  height: 70vh;
  .el-input {
    position: absolute;
    width: 300px;
    top: -50px;
    left: 50%;
    transform: translateX(-50%);
  }
  #panel {
    position: absolute;
    right: 0;
    width: 500px;
    height: 200px;
    z-index: 20;
  }
}
</style>
