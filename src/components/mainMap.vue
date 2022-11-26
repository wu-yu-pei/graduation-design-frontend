<template>
  <div id="map" absolute top-0 left-0 right-0 bottom-0 z1></div>
</template>

<script setup>
function initMap() {
  // todo 根据时间 动态切换地图
  const map = new AMap.Map('map', {
    zoom: 11, //级别
    mapStyle: 'amap://styles/darkblue', //设置地图的显示样式
    viewMode: '3D', //使用3D视图
  });

  map.on('complete', function () {
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
  });
}

onMounted(() => {
  initMap();
});
</script>

<style scoped></style>
