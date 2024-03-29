<template>
  <div class="my-fahuo">
    <div class="box-card">
      <Title>我的物流</Title>
      <div class="body">
        <el-table :data="shops" v-loading="tabelIsLoading" style="width: 100%" :border="true">
          <el-table-column fixed prop="id" label="id" width="100" />
          <el-table-column fixed prop="thing.name" label="物流名称" width="250" />
          <el-table-column prop="toName" label="收货人" width="250" />
          <el-table-column prop="toPhone" label="收货电话" width="250" />
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
              <el-tag v-else-if="scope.row.status == 1 && scope.row.current_position">运输中</el-tag>
              <el-tag v-else-if="scope.row.status == 1 && !scope.row.current_position" type="warning">发货中</el-tag>
              <el-tag v-else-if="scope.row.status == 2" type="danger">已拦截</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" prop="status" label="操作" width="500">
            <template #default="scope">
              <el-button icon="Delete" type="danger" plain @click="showDeleteDilog(scope.row.id)">删除</el-button>
              <el-button v-if="scope.row.status == 1" type="danger" plain @click="lanjie(scope.row)">拦截</el-button>
              <el-button v-if="scope.row.status == 1" type="primary" plain @click="updateAddress(scope.row)">更新位置</el-button>
              <el-button v-if="scope.row.status == 2" type="primary" plain @click="updateAddress2(scope.row)">撤销拦截</el-button>
              <el-button type="success" plain @click="showLine(scope.row)">运输路线</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog v-model="dialogVisibleAddress" title="位置更新" width="90%" height="80vh" draggable :destroy-on-close="true">
      <div class="content">
        <el-select v-model="toAddress" placeholder="请选择位置" @change="selectChange">
          <template v-for="item in allAddress">
            <el-option :disabled="item.disabled" :label="item.current_position" :value="item.current_position" />
          </template>
        </el-select>
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
        <ul class="info" v-if="currentLine && currentLine.length">
          <li v-for="(item, index) in currentLine">
            <span>{{ index == currentLine.length - 1 ? '（开始发货）' : '' }}</span>
            {{ item.current_time }} 到达 {{ item.current_position }}
          </li>
        </ul>
      </div>
    </el-dialog>

    <el-dialog v-model="isSureDelete" title="删除" width="30%" align-center>
      <span>确定删除吗</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="hiddenDeleteDilog">取消</el-button>
          <el-button type="primary" @click="remove"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<route lang="yaml">
meta:
  name: 我的物流
</route>

<script setup>
import { useDateFormat } from '@vueuse/core';
import { findShop, updateAddressApi, removeById, addATransportInfo, getTransportInfo } from '../../service/home/index';
import useAppStore from '../../store/app';
import { async } from 'exceljs/dist/exceljs';

let appStore = useAppStore();
let mapRef = ref(null);
let shops = reactive([]);
let tabelIsLoading = ref(true);

function getShops() {
  findShop(appStore.userInfo.id).then((res) => {
    shops.length = 0;
    shops.push(...res.data);
    tabelIsLoading.value = false;
    shops.forEach((item) => {
      item.current_time = useDateFormat(item.current_time * 1, 'YYYY-MM-DD HH:mm:ss');
    });
  });
}
getShops();

let currentShopInfo = ref();
// 1.0 更新位置
// 要更新的地点搜索
let toAddress = ref('');
let toAddressInfo = ref('');
let allAddress = reactive([]);
let targetMarker = '';
async function updateAddress2(info) {
  await updateAddressApi({
    id: info.id,
    lng: info.lng,
    lat: info.lat,
    current_position: info.current_position,
    status: 1,
  });
  ElMessage({
    type: 'success',
    message: '已撤销拦截 物流将继续运输',
  });
  await getShops()
}
// 更新位置
let dialogVisibleAddress = ref(false);
function updateAddress(info) {
  dialogVisibleAddress.value = true;
  currentShopInfo.value = info;
}

function getList() {
  const driving = new AMap.Driving({
    map: mapRef.value.getMap(),
    policy: AMap.DrivingPolicy.LEAST_TIME,
    showTraffic: false,
    autoFitView: false,
  });
  const startPos = currentShopInfo.value.start_position_geo.split(',');
  const endPos = currentShopInfo.value.end_position_geo.split(',');

  driving.search(startPos, endPos, async function (status, result) {
    if (status === 'complete') {
      allAddress.length = 0;
      const _index = result.routes[0].steps.findIndex((item) => item.end_location.lng + ',' + item.end_location.lat == currentShopInfo.value.current_position_geo);

      result.routes[0].steps.forEach((item, index) => {
        allAddress.push({
          current_position: '|' + index + '|' + (item.road || '未知路段') + '——' + (item.cities ? item.cities[0].name : '未知城市'),
          lng: item.end_location.lng,
          lat: item.end_location.lat,
          disabled: index <= _index ? true : false,
        });
      });
    }
  });
}

function selectChange(val) {
  toAddressInfo.value = allAddress.find((item) => item.current_position == val);
  if (targetMarker) {
    mapRef.value.getMap().setCenter(new AMap.LngLat(toAddressInfo.value.lng, toAddressInfo.value.lat));
    mapRef.value.getMap().add(targetMarker);
    return targetMarker.setPosition(new AMap.LngLat(toAddressInfo.value.lng, toAddressInfo.value.lat));
  }
  targetMarker = new AMap.Marker({
    icon: new AMap.Icon({
      image: '/image/project_icon2.png',
      imageSize: new AMap.Size(30, 30),
    }),
    size: new AMap.Size(30, 30),
    anchor: 'center',
  });
  mapRef.value.getMap().add(targetMarker);
  targetMarker.setPosition(new AMap.LngLat(toAddressInfo.value.lng, toAddressInfo.value.lat));
}

async function updateAddressConfirm() {
  // console.log(toAddressInfo.value);
  if (toAddressInfo.value.current_position == allAddress[allAddress.length - 1].current_position) {
    await updateAddressApi({
      id: currentShopInfo.value.id,
      lng: toAddressInfo.value.lng,
      lat: toAddressInfo.value.lat,
      current_position: toAddressInfo.value.current_position.replace(/\|\d*\|/, ''),
      status: 0,
    });
    console.log('-----');
  } else {
    await updateAddressApi({
      id: currentShopInfo.value.id,
      lng: toAddressInfo.value.lng,
      lat: toAddressInfo.value.lat,
      current_position: toAddressInfo.value.current_position.replace(/\|\d*\|/, ''),
      status: 1,
    });
  }

  ///toAddressInfo.value
  await addATransportInfo({
    id: currentShopInfo.value.id,
    current_time: +new Date(),
    current_position: toAddressInfo.value.current_position.replace(/\|\d*\|/, ''),
    current_position_geo: toAddressInfo.value.lng + ',' + toAddressInfo.value.lat,
  });
  dialogVisibleAddress.value = false;
  await getShops();
  ElMessage({
    type: 'success',
    message: '更新成功',
  });
}

function mapAddressLoadComplete() {
  mapRef.value.getMap().clearMap();
  toAddress.value = '';
  toAddressInfo.value = '';
  getList();
  getShops();
}

// 2.0运输路线
let dialogVisibleLine = ref(false);
let currentLine = ref();
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

async function getRoundLine() {
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
  const currentPos = currentShopInfo.value.current_position_geo?.split(',');

  // 绘制路线
  driving.search(startPos, endPos, async function (status, result) {
    if (status === 'complete') {
      console.log(result);
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
      if (!currentPos) return;
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

  const res = await getTransportInfo(currentShopInfo.value.id);
  currentLine.value = res.data.data;
  currentLine.value.forEach((item) => {
    item.current_time = useDateFormat(item.current_time * 1, 'YYYY-MM-DD HH:mm:ss');
  });
}

function sleep(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

// 3.0拦截
async function lanjie(data) {
  await updateAddressApi({
    id: data.id,
    lng: data.lng,
    lat: data.lat,
    current_position: data.current_position,
    status: 2,
  });
  await getShops()

  ElMessage({
    type: 'success',
    message: '已拦截 物流即将退回',
  });
}

// 4.0删除
let isSureDelete = ref(false);
let curShopId = ref();
function showDeleteDilog(id) {
  isSureDelete.value = true;
  curShopId.value = id;
}

function hiddenDeleteDilog() {
  isSureDelete.value = false;
  curShopId.value = '';
}

async function remove() {
  isSureDelete.value = false;
  let res = await removeById(curShopId.value);

  if (res.data.code == 200) {
    ElMessage({
      type: 'success',
      message: res.data.msg,
    });
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    });
  }

  await getShops();
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
  .el-table {
    height: 100%;
  }
}

.content {
  position: relative;
  height: 70vh;
  .el-select {
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
  .info {
    position: absolute;
    top: 0;
    left: 0;
    outline: 1px solid blue;
    margin: 0;
    padding: 0;
    padding: 0 10px;
    max-height: 100%;
    overflow-y: auto;
    background-color: rgba(0, 0, 255, 0.1);
    li {
      span {
        color: blue;
      }
      list-style: '↑';
      margin: 15px 0;
      padding-left: 5px;
      color: #000;
      font-size: 16px;
    }
  }
}
</style>
