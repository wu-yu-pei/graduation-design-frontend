<template>
  <div id="map" absolute top-0 left-0 right-0 bottom-0 z1></div>
</template>

<script setup>
import AMapLoader from '@amap/amap-jsapi-loader';
function initMap() {
  AMapLoader.load({
    key: '62bf752ab1f963e58a757af1298be24c',
    version: '2.0',
    plugins: ['AMap.Driving'],
    Loca: {
      // 是否加载 Loca， 缺省不加载
      version: '2.0', // Loca 版本
    },
  })
    .then((AMap) => {
      const map = new AMap.Map('map', {
        zoom: 11, //级别
        mapStyle: 'amap://styles/darkblue', //设置地图的显示样式
        viewMode: '3D', //使用3D视图
      });
      var loca = new Loca.Container({
        map,
      });
      map.on('complete', () => {
        var linkLayer = new Loca.LinkLayer({
          zIndex: 20,
          opacity: 1,
          visible: true,
          zooms: [2, 22],
        });
        const source = new Loca.GeoJSONSource({
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {
                  type: 1,
                },
                geometry: {
                  type: 'LineString',
                  coordinates: [
                    [116.46, 39.92],
                    [127.303, 40.2421],
                  ],
                },
              },
              {
                type: 'Feature',
                properties: {
                  type: 0,
                },
                geometry: {
                  type: 'LineString',
                  coordinates: [
                    [116.45, 39.91],
                    [107.3, 40.221],
                  ],
                },
              },
            ],
          },
        });
        linkLayer.setSource(source);
        linkLayer.setStyle({
          lineColors: function (index, item) {
            return item.link.properties.type === 0 ? ['#25CDEA', '#12BFBF'] : ['#FFD87B', '#FF4F00'];
          },
          height: function (index, item) {
            console.log(item);
            return item.distance / 3;
          },
          smoothSteps: function (index, item) {
            return 200;
          },
        });
        loca.add(linkLayer);
      });
    })
    .catch((e) => {
      console.error(e); //加载错误提示
    });
}

onMounted(() => {
  initMap();
});
</script>

<style scoped></style>
