<template>
  <div class="my-fahuo">
    <Title>我要发货</Title>
    <div class="body">
      <div class="form">
        <el-form :inline="true" :model="formDate" class="demo-form-inline">
          <el-form-item label="物流名称">
            <!-- <el-input v-model="formDate.name" placeholder="请输入物流名称" /> -->
            <el-select v-model="formDate.name" placeholder="请选择商品" style="width: 115px">
              <template v-for="(item, index) of AllShop" :key="index">
                <el-option :label="item.name" :value="item.name" />
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="收货人姓名">
            <el-input v-model="formDate.toName" placeholder="请输入收货人姓名" />
          </el-form-item>
          <el-form-item label="收货人电话">
            <el-input v-model="formDate.toPhone" placeholder="请输入收货人电话" />
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
import { createShop, getAllThings } from '../../service/home/index';
import useAppStore from '../../store/app';
const mapRef = ref(null);
let buttonRef = ref(null);
let startAllResult = reactive();
let startInfo = reactive();
let endAllResult = reactive();
let endInfo = reactive();
let AllShop = ref([]);

getAllThings().then((res) => {
  AllShop.value = res.data.data;
});

const appStore = useAppStore();
const formDate = reactive({
  name: '',
  start_position: appStore.userInfo.address,
  start_position_geo: appStore.userInfo.address_geo,
  end_position: '',
  end_position_geo: '',
  toName: '',
  toPhone: '',
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

  const autoCompleteEnd = new AMap.AutoComplete({
    input: 'end-position',
  });

  autoCompleteEnd.on('select', selectEnd); //注册监听，当选中某条记录时会触发
  autoCompleteEnd.on('error', errorMessage);

  function errorMessage() {
    return ElMessage({
      type: 'warning',
      message: '当日搜索次数已用完！明天再来吧',
    });
  }

  function selectEnd(e) {
    buttonRef.value.style.opacity = 1;
    // 搜索
    placeSearch.search(e.poi.name, (status, result) => {
      endAllResult = result.poiList.pois;
    });
  }
}
// 确定地址
function sureAddress() {
  const target = document.querySelector('#panel-fahuo .amap_lib_placeSearch_list ul li.active');
  if (!target) {
    ElMessage({
      type: 'warning',
      message: '请选择位置',
    });
    return;
  }

  endInfo = endAllResult[target.getAttribute('data-idx')];
  formDate.end_position = endInfo.cityname + endInfo.adname + endInfo.address;
  formDate.end_position_geo = endInfo.location.lng + ',' + endInfo.location.lat;

  buttonRef.value.style.opacity = 0;
  document.querySelector('#panel-fahuo > div').remove();
  mapRef.value.getMap().clearMap();
}
// 提交
async function onSubmit() {
  if (!formDate.name || !formDate.end_position || !formDate.end_position_geo || !formDate.start_position || !formDate.start_position_geo) {
    return ElMessage({
      type: 'error',
      message: '请输入完整信息',
    });
  }
  let res = await createShop({ ...formDate, uid: appStore.userInfo.id, time: +new Date() });
  if (res.data.msg == '发货成功') {
    ElMessage({
      type: 'success',
      message: '发货成功',
    });
    formDate.end_position = '';
    formDate.end_position_geo = '';
    formDate.name = '';
    formDate.toName = '';
    formDate.toPhone = '';
  }
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
