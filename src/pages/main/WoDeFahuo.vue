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
          <el-table-column fixed prop="name" label="名称" width="150" />
          <el-table-column prop="current_position" label="当前地址" />
          <el-table-column prop="current_time" label="时间" />
          <el-table-column prop="start_position" label="发货地址" />
          <el-table-column prop="end_position" label="收货地址" />
          <el-table-column prop="status" label="状态">
            <template #default="scope">
              <el-tag v-if="scope.row.status == 1" type="success">已送达</el-tag>
              <el-tag v-else-if="scope.row.status == 0">运输中</el-tag>
              <el-tag v-else-if="scope.row.status == 2" type="danger">已拦截</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="操作" width="500">
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

    <el-dialog v-model="dialogVisibleAddress" title="位置更新" width="90%" height="80vh" draggable>
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

    <el-dialog v-model="dialogVisibleLine" title="运输路线" width="90%" height="80vh" draggable>
      <div class="content">
        <Map ref="mapRef"></Map>
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
