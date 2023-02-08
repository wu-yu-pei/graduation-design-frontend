<template>
  <div class="my-fahuo">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>我的物流</span>
        </div>
      </template>
      <div>
        <el-table :data="shops" style="width: 100%" border="true">
          <el-table-column fixed prop="name" label="名称" width="250" />
          <el-table-column prop="current_position" label="当前地址"  />
          <el-table-column prop="current_time" label="时间"  />
          <el-table-column prop="start_position" label="发货地址"  />
          <el-table-column prop="end_position" label="收货地址"  />
          <el-table-column prop="status" label="状态">
            <template #default="scope">
              <el-tag v-if="scope.row.status == 1" type="success">已送达</el-tag>
              <el-tag v-else-if="scope.row.status == 0">运输中</el-tag>
              <el-tag v-else-if="scope.row.status == 2" type="danger">已拦截</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" prop="status" label="操作" width="500">
            <template #default="scope">
              <el-button icon="Delete" type="danger" plain>删除</el-button>
              <el-button v-if="scope.row.status == 0" type="danger" plain>拦截</el-button>
              <el-button v-if="scope.row.status == 0" type="primary" plain @click="updateAddress(scope.row)">更新位置</el-button>
              <el-button type="success" plain @click="showLine(scope.row)">运输路线</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <el-dialog v-model="dialogVisibleAddress" title="位置更新" width="90%" height="80vh" draggable :destroy-on-close="true">
      <div class="content">
        <Map ref="mapRef"></Map>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisibleAddress = false">取消</el-button>
          <el-button type="primary" @click="dialogVisibleAddress = false"> 确定 </el-button>
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
import { findShop } from '../../service/home/index';

let mapRef = ref(null);
let shops = reactive([]);

findShop('0').then((res) => {
  shops.push(...res.data);
});

let currentShopInfo = ref();

// 更新位置
let dialogVisibleAddress = ref(false);
function updateAddress(info) {
  dialogVisibleAddress.value = true;
  currentShopInfo.value = info;
}

// 运输路线
let dialogVisibleLine = ref(false);
function showLine(info) {
  dialogVisibleLine.value = true;
  currentShopInfo.value = info;
}

function mapLoadComplete() {
  mapRef.value.getMap().clearMap();
  getRoundLine();
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
.el-card {
  height: 100%;
}
.content {
  height: 70vh;
}
</style>
