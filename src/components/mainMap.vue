<template>
  <div id="map" absolute top-0 left-0 right-0 bottom-0 z1></div>
</template>

<script setup>
import { createFeiXian } from '../utils/map.utils';
function initMap() {
  // todo 根据时间 动态切换地图
  const map = new AMap.Map('map', {
    zoom: 11, //级别
    mapStyle: 'amap://styles/darkblue', //设置地图的显示样式
    viewMode: '3D', //使用3D视图
  });

  map.on('complete', function () {
    const layer = new Loca.LinkLayer({
      map: map,
    });
    layer.setData(
      [
        {
          lnglat: [
            [113.619308, 34.748093],
            [113.347397, 34.553783],
          ],
          dis: 10,
        },
        {
          lnglat: [
            ['116.333204', '40.012601'],
            ['116.333204', '40.0036'],
          ],
          dis: 1550,
        },
      ],
      {
        lnglat: 'lnglat',
      }
    );
    layer.setOptions({
      blendMode: 'lighter',
      style: {
        // 曲率 [-1, 1] 区间
        curveness: function (data) {
          if (data.value.dis < 100) {
            return 0.07;
          } else if (data.value.dis < 300) {
            return 0.05;
          } else if (data.value.dis < 500) {
            return 0.02;
          } else if (data.value.dis < 700) {
            return 0.01;
          } else {
            return 0.005;
          }
        },
        opacity: 0.8,
        color: '#5DFBF9',
      },
    });

    // 渲染
    layer.render();
    // 路线规划
    AMap.plugin('AMap.Driving', function () {
      var driving = new AMap.Driving({
        // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
        policy: AMap.DrivingPolicy.LEAST_TIME,
        map: map,
      });
      var startLngLat = [113.623578, 34.745476];
      var endLngLat = [116.427281, 39.903719];
      driving.search(startLngLat, endLngLat, function (status, result) {
        if (status === 'complete') {
          const path = []; //路上所有的点
          console.log(result);
          const { routes } = result;
          routes[0].steps.forEach((step) => {
            step.path.forEach((position) => {
              path.push([position.lng, position.lat]);
            });
          });
          var polyline = new AMap.Polyline({
            path: path,
            isOutline: true,
            outlineColor: '#fff',
            borderWeight: 0,
            strokeColor: '#3366FF',
            strokeOpacity: 1,
            strokeWeight: 7,
            // 折线样式还支持 'dashed'
            strokeStyle: 'solid',
            // strokeStyle是dashed时有效
            strokeDasharray: [10, 5],
            lineJoin: 'round',
            lineCap: 'round',
            zIndex: 500,
          });
          polyline.setMap(map);
          // 轨迹回放
          const marker = new AMap.Marker({
            map: map,
            position: [113.623578, 34.745476],
            icon: 'https://webapi.amap.com/images/car.png',
            offset: new AMap.Pixel(-26, -13),
            autoRotation: true,
            angle: -90,
          });
          // 以通过的路线的颜色
          var passedPolyline = new AMap.Polyline({
            map: map,
            // path: lineArr,
            strokeColor: '#AF5', //线颜色
            // strokeOpacity: 1,     //线透明度
            strokeWeight: 6, //线宽
            // strokeStyle: "solid"  //线样式
            zIndex: 600,
          });
          // 监听marker的移动
          marker.on('moving', function (e) {
            passedPolyline.setPath(e.passedPath);
          });
          // 沿着path运行
          marker.moveAlong(path, 20000000);
        }
      });
    });

    //  3d线
    // 显示发往货物流向(基础的线)
    var object3Dlayer = new AMap.Object3DLayer({ zIndex: 10 });
    map.add(object3Dlayer);
    const line1 = [new AMap.LngLat(113.623578, 34.745476), new AMap.LngLat(116.427281, 39.903719)];
    var thinline = new AMap.Object3D.ThinLine({
      path: line1,
      color: '#0055ff',
    });
    object3Dlayer.add(thinline);
    createFeiXian([new AMap.LngLat(113.570707, 34.855987), new AMap.LngLat(113.570707, 34.855987), new AMap.LngLat(123.634183, 41.875107), new AMap.LngLat(123.634183, 41.875107)], object3Dlayer);
    createFeiXian([new AMap.LngLat(113.570707, 34.855987), new AMap.LngLat(113.570707, 34.855987), new AMap.LngLat(101.661527, 36.497961), new AMap.LngLat(101.661527, 36.497961)], object3Dlayer);
    createFeiXian([new AMap.LngLat(113.570707, 34.855987), new AMap.LngLat(113.570707, 34.855987), new AMap.LngLat(113.482816, 22.356964), new AMap.LngLat(113.482816, 22.356964)], object3Dlayer);
    createFeiXian([new AMap.LngLat(113.570707, 34.855987), new AMap.LngLat(113.570707, 34.855987), new AMap.LngLat(99.991605, 23.952903), new AMap.LngLat(99.991605, 23.952903)], object3Dlayer);
    map.setZoom(5);
    map.setPitch(60);
  });
}

onMounted(() => {
  initMap();
});
</script>

<style scoped></style>
