<template>
  <div class="my-fahuo">
    <Title>我要发货</Title>
    <div class="body">
      <div class="form">
        <el-form :inline="true" :model="formDate" class="demo-form-inline">
          <el-form-item label="物流名称">
            <el-input v-model="formDate.name" placeholder="请输入物流名称" />
          </el-form-item>
          <el-form-item label="发货地址">
            <el-input id="start-position" v-model="formDate.start_position" placeholder="请输入物流名称" />
          </el-form-item>
          <el-form-item label="收货地址">
            <el-input id="end-position" v-model="formDate.end_position" placeholder="请输入物流名称" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">发货</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="map">
        <div id="panel-fahuo"></div>
        <div ref="buttonRef" style="opacity: 0">
          <el-button type="primary" size="large" @click="sureAddress">确定</el-button>
        </div>
        <Map @mapLoadComplete="mapLoadComplete" ref="mapRef"></Map>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  name: 我要发货
</route>

<script setup>
import { createShop } from '../../service/home/index';
import useAppStore from '../../store/app';
const mapRef = ref(null);
let buttonRef = ref(null);
let startAllResult = reactive();
let endAllResult = reactive();

const appStore = useAppStore();
const formDate = reactive({
  name: '',
  start_position: '',
  start_position_geo: '',
  end_position: '',
  end_position_geo: '',
});

// 地图加载完成
function mapLoadComplete() {
  const placeSearch = new AMap.PlaceSearch({
    map: mapRef.value.getMap(),
    pageSize: 5, // 单页显示结果条数
    pageIndex: 1, // 页码
    panel: 'panel-fahuo', // 结果列表将在此容器中进行展示。
    autoFitView: true,
  });

  const autoCompleteStart = new AMap.AutoComplete({
    input: 'start-position',
  });
  const autoCompleteEnd = new AMap.AutoComplete({
    input: 'end-position',
  });

  autoCompleteStart.on('select', selectStart); //注册监听，当选中某条记录时会触发
  autoCompleteEnd.on('select', selectEnd); //注册监听，当选中某条记录时会触发

  function selectStart(e) {
    buttonRef.value.style.opacity = 1;
    // 搜索
    placeSearch.search(e.poi.name, (status, result) => {
      startAllResult = result.poiList.pois;
    });
  }

  function selectEnd(e) {
    // 搜索
    placeSearch.search(e.poi.name, (status, result) => {
      endAllResult = result.poiList.pois;
    });
  }
}

// 确定地址
function sureAddress() {
  buttonRef.value.style.opacity = 0;
  mapRef.value.getMap().clearMap();
}
// 提交
function onSubmit() {
  createShop({ ...formDate, uid: appStore.userInfo.id, time: +new Date() }).then((res) => {
    console.log(res);
  });
}
</script>

<style scoped lang="less">
.my-fahuo {
  height: 100%;
}
.body {
  height: 100%;
  padding-top: 20px;
  .form {
    max-height: 100px;
  }
  .map {
    position: relative;
    height: calc(100% - 200px);
    #panel-fahuo {
      position: absolute;
      right: 0;
      top: 0;
      width: 500px;
      height: 200px;
      z-index: 20;
    }
    .el-button {
      position: absolute;
      width: 100px;
      height: 100px;
      right: 30px;
      border-radius: 50%;
      font-size: 24px;
      letter-spacing: 8px;
      text-align: center;
      bottom: 10px;
      z-index: 20;
    }
  }
}
</style>
