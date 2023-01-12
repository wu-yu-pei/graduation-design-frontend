<template>
  <div class="item" my-10 p-10 b-rd-10 @click="handelDetialClick">
    <div lh-25>
      <span mr-10>商品名称:</span>
      {{ info.name }}
    </div>
    <div lh-25>
      <span mr-10>发货地址:</span>
      {{ info.start_position }}
    </div>
    <div lh-25>
      <span mr-10>收获地址:</span>
      {{ info.end_position }}
    </div>
    <div lh-25>
      <span mr-10>发货时间:</span>
      {{ dayjs(info.time * 1).format('YYYY MM-DD HH:mm:ss') }}
    </div>
    <div mt-5>
      <el-button size="small" @click.stop="handelDetialClick">详细信息</el-button>
      <el-tooltip placement="right" trigger="hover">
        <template #content> <img :src="info.qr_code" alt="" /> </template>
        <el-button size="small">二维码</el-button>
      </el-tooltip>
      <el-button size="small" @click.stop="getRoundLine">物流</el-button>
    </div>
  </div>

  <!-- 弹出框 -->
  <el-dialog v-model="isShowDialog" title="Tips" width="30%" :append-to-body="true" draggable :show-close="false">
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        {{ info.name }}
      </div>
    </template>
    <ul>
      <li mt-10 mb-10 ml--10>收货地址：{{ info.end_position }}</li>
      <li mt-10 mb-10 ml--10 v-if="info.current_position">
        {{ dayjs(info.current_time * 1).format('YYYY MM-DD HH:mm:ss') }}
        到达
        {{ info.current_position }}
      </li>
      <li mt-10 mb-10 ml--10 v-else>未发货</li>
      <template v-for="item in detialInfo" :key="item">
        <li v-if="item.road" mt-10 mb-10 ml--10>{{ item.road }}</li>
      </template>
      <li mt-10 mb-10 ml--10>发货地址：{{ info.start_position }}</li>
    </ul>
  </el-dialog>
</template>

<script setup>
import dayjs from 'dayjs';
import { storeToRefs } from 'pinia';
import useAppStore from '../../store/app';

const props = defineProps({
  info: {
    type: Object,
  },
});
const appSotre = useAppStore();
const { mapRef } = storeToRefs(appSotre);

// 弹窗
let isShowDialog = ref(false);
let detialInfo = ref([]);
function handelDetialClick() {
  isShowDialog.value = true;
  const driving = new AMap.Driving({
    policy: AMap.DrivingPolicy.LEAST_TIME,
    showTraffic: false,
  });

  const allFollowPoints = [];
  const startPos = props.info.start_position_geo.split(',');
  const endPos = props.info.end_position_geo.split(',');
  const currentPos = props.info.current_position_geo.split(',');

  driving.search(startPos, endPos, function (status, result) {
    if (status === 'complete') {
      result.routes.forEach((route) => {
        allFollowPoints.push(...route.steps);
      });

      const diss = [];
      for (let i = 0; i < allFollowPoints.length; i++) {
        const dis = AMap.GeometryUtil.distance(allFollowPoints[i].path[0], new AMap.LngLat(currentPos[0], currentPos[1]));
        diss.push(dis);
      }
      const index = diss.indexOf(Math.min(...diss));
      detialInfo.value = allFollowPoints.slice(0, index + 1);
      console.log(detialInfo.value);
    }
  });
}

function getRoundLine() {
  const driving = new AMap.Driving({
    map: mapRef.value.getMap(),
    policy: AMap.DrivingPolicy.LEAST_TIME,
    showTraffic: false,
  });

  const allFollowPoints = [];
  const startPos = props.info.start_position_geo.split(',');
  const endPos = props.info.end_position_geo.split(',');
  const currentPos = props.info.current_position_geo.split(',');

  // 绘制路线
  driving.search(startPos, endPos, function (status, result) {
    if (status === 'complete') {
      result.routes.forEach((route) => {
        allFollowPoints.push(...route.steps);
      });
      // 重新绘制路线 原来的颜色不好看
      const path = allFollowPoints.reduce((pre, cur) => {
        pre.push(...cur.path);
        return pre;
      }, []);

      var polylineFull = new AMap.Polyline({
        path: path,
        borderWeight: 2,
        strokeWeight: 10,
        strokeColor: 'gray',
        strokeOpacity: 1,
        lineJoin: 'round',
      });
      mapRef.value.getMap().add(polylineFull);

      // 开始绘制已完成的路线
      const diss = [];
      for (let i = 0; i < path.length; i++) {
        const dis = AMap.GeometryUtil.distance(path[i], new AMap.LngLat(currentPos[0], currentPos[1]));
        diss.push(dis);
      }
      const completeEndPoint = path[diss.indexOf(Math.min(...diss))];

      const completePath = path.slice(
        0,
        path.findIndex((item) => item == completeEndPoint)
      );
      console.log(completePath);
      var polylineComplete = new AMap.Polyline({
        path: completePath,
        borderWeight: 2,
        strokeWeight: 10,
        strokeColor: 'blue',
        strokeOpacity: 1,
        lineJoin: 'round',
        showDir: true,
        lineCap: 'round',
      });
      mapRef.value.getMap().add(polylineComplete);

      // 绘制当前位置的marker
      var marker = new AMap.Marker({
        position: completeEndPoint,
        title: props.info.current_position,
      });
      mapRef.value.getMap().add(marker);
    }
  });
}
</script>

<style scoped lang="less">
.item {
  background-color: #f1f1f1;
  cursor: pointer;
}

ul li {
  position: relative;
  list-style: none;
  &:first-child {
    color: green;
    list-style: disc;
    &::before {
      opacity: 0;
    }
  }
  &:nth-child(2) {
    list-style: disc;
    color: blue;
    &::before {
      opacity: 0;
    }
  }
  &:last-child {
    list-style: disc;
    &::before {
      opacity: 0;
    }
  }
  &::before {
    position: absolute;
    top: 0;
    left: -18px;
    content: '↑';
  }
}

.my-header {
  padding-bottom: 10px;
  border-bottom: 1px solid blue;
}
</style>
