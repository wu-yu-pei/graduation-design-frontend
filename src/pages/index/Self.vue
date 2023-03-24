<template>
  <div class="my-shops">
    <Title>
      <div class="left">个人中心</div>
    </Title>
    <div class="body">
      <el-form :inline="true" :model="formInline" label-position="top" label-width="100px">
        <el-form-item label="姓名:">
          <el-input :disabled="currentStatus == 0" v-model="formInline.uname" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="发货地址:">
          <el-input @focus="addressInputFocus" :disabled="currentStatus == 0" v-model="formInline.address" placeholder="请选择地址" />
        </el-form-item>
        <el-form-item label="联系电话:">
          <el-input :disabled="currentStatus == 0" v-model="formInline.account" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="操作:">
          <el-button :disabled="time != 0" v-if="currentStatus == 0" @click="changeCurrentStatus()">{{ time == 0 ? '修改' : `${time}秒后可修改` }}</el-button>
          <el-button v-if="currentStatus == 1" v-loading="currentStatus == isChanging" @click="sureChange()">确定</el-button>
        </el-form-item>
      </el-form>

      <el-dialog v-model="dialogVisible" title="选择位置" width="90%" height="80vh" draggable :destroy-on-close="true">
        <div class="content">
          <div class="address">
            {{ current_position_info.current_position_address }}
          </div>
          <Map ref="mapRef" @mapLoadComplete="mapAddressLoadComplete"></Map>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click.stop="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click.stop="sureSelect"> 确定 </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  name: 个人中心
</route>

<script setup>
import { ref } from 'vue';
import { useStorage } from '@vueuse/core';
import { changeUserInfo } from '../../service/home/index';
import useAppStore from '../../store/app';
let currentStatus = ref(0); // 0:禁止编辑状态 1:编辑状态
let isChanging = ref(false);
// let time = ref(0);
const time = useStorage('time', 0, sessionStorage);
if (time.value > 0) {
  setIn(time.value);
}

const appStore = useAppStore();
let current_position_info = reactive({
  current_position_address: '',
  current_position_address_geo: '',
});
const formInline = reactive({
  uname: appStore.userInfo.uname,
  address: appStore.userInfo.address,
  account: appStore.userInfo.account,
  address_geo: appStore.userInfo.address_geo,
});

let mapRef = ref();
let dialogVisible = ref(false);
function addressInputFocus() {
  dialogVisible.value = true;
}

function sureSelect() {
  formInline.address_geo = current_position_info.current_position_address_geo;
  formInline.address = current_position_info.current_position_address;
  dialogVisible.value = false;
}

function mapAddressLoadComplete() {
  const map = mapRef.value.getMap();

  var marker = new AMap.Marker({
    position: [0, 0],
    map: map,
    offset: new AMap.Pixel(-15, -15),
    icon: new AMap.Icon({
      image: '/image/map.png',
      imageSize: new AMap.Size(30, 30),
    }),
  });

  map.on('click', (e) => {
    current_position_info.current_position_address_geo = e.lnglat.lng + ',' + e.lnglat.lat;

    var geocoder = new AMap.Geocoder({
      // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
      city: '010',
    });

    var lnglat = [e.lnglat.lng, e.lnglat.lat];

    marker.setPosition(lnglat);

    geocoder.getAddress(lnglat, function (status, result) {
      if (status === 'complete' && result.info === 'OK') {
        current_position_info.current_position_address = result.regeocode.formattedAddress;
      }
    });
  });
}

function sureChange() {
  isChanging.value = true;
  appStore.userInfo.uname = formInline.uname;
  appStore.userInfo.address = formInline.address;
  appStore.userInfo.account = formInline.account;
  appStore.userInfo.address_geo = formInline.address_geo;

  changeUserInfo({ ...formInline }).then((res) => {
    if (res.data.code == 200) {
      ElMessage({
        type: 'success',
        message: '修改成功',
      });
    } else if (res.data.code == 400) {
      ElMessage({
        type: 'error',
        message: '修改失败',
      });
    }
    currentStatus.value = 0;
    isChanging.value = false;
    setIn(10);
  });
}

function changeCurrentStatus() {
  currentStatus.value = 1;
}

function setIn(outTime) {
  time.value = outTime;
  let timer = setInterval(() => {
    time.value--;
    if (time.value == 0) {
      clearInterval(timer);
      time.value = 0;
    }
  }, 1000);
}
</script>

<style scoped lang="less">
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .right {
    display: flex;
    gap: 0 10px;
  }
  .upload {
    display: flex;
    flex-direction: row-reverse;
  }
}

.content {
  position: relative;
  height: 70vh;
  .address {
    position: absolute;
    top: -50px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    font-size: 26px;
    font-weight: 800;
  }
}

.el-form {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}
</style>
