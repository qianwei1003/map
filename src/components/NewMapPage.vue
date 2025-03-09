<template>
  <div class="map-container">
    <div id="new-map" class="map"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import * as maptalks from 'maptalks'
import { MapType, MapStyle } from '@/GeoMatrixCore/common/constants'
import { getDeviceByLatLng } from '@/api/map'
import { getImageUrl } from '@/utils'

let map: maptalks.Map | null = null
let markerLayer: maptalks.VectorLayer | null = null
let markersCopy: maptalks.Marker[] = []

// 创建设备图标 URL
const getDeviceIconUrl = (status: number) => {
  switch (status) {
    case 1: return getImageUrl('map_images/alarm_lamp_on.png')
    case 2: return getImageUrl('map_images/alarm_lamp_off.png')
    case 3: return getImageUrl('map_images/alarm_lamp_error.png')
    default: return getImageUrl('map_images/alarm_lamp_unknown.png')
  }
}

// 更新设备数据
const updateDevices = async () => {
  if (!map) return

  const extent = map.getExtent()
  if (!extent) return

  const bounds = {
    latMin: extent.ymin,
    latMax: extent.ymax,
    lngMin: extent.xmin,
    lngMax: extent.xmax,
    deviceType: 'lamp'
  }
console.log(bounds,'bounds');

  const startTime = performance.now()
  try {
    const response = await getDeviceByLatLng({
      ...bounds,
      projectId: '1',
      level: 12,
      repeatTime: 0,
      poleView: false
    })
    const endTime = performance.now()
    console.log(`接口调用耗时: ${(endTime - startTime).toFixed(2)}ms`)
    console.log(response.data.lamp, 'response.data.lamp');
    if (response.code === 200) {
      // 初始化图层
      if (!markerLayer) {
        markerLayer = new maptalks.VectorLayer('devices').addTo(map)
      }

      // 清除旧标记
      markerLayer.clear()
      markersCopy = []

      // 添加新标记
      const markers = response.data.lamp.map(device => {
        return new maptalks.Marker(
          [parseFloat(device.lng), parseFloat(device.lat)],
          {
            symbol: {
              markerFile: getDeviceIconUrl(device.ls),
              markerWidth: 24,
              markerHeight: 24
            }
          }
        )
      })
      markersCopy = markers
      console.log(markers, 'markers');
      
      markerLayer.addGeometry(markers)
    }
  } catch (error) {
    console.error('获取设备数据失败:', error)
  }
}

onMounted(() => {
  // 初始化地图
  map = new maptalks.Map('new-map', {
    center: [116.397473, 39.908678],
    zoom: 14,
    zoomAnimationDuration: 100,
    seamlessZoom: true,
    baseLayer: new maptalks.TileLayer('base', {
      urlTemplate: 'https://maponline{s}.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&udt=20230712',
      subdomains: ['0', '1', '2', '3'],
      spatialReference: {
        projection: 'baidu'
      },
      fadeAnimation: true,  // 开启渐变过渡
  zoomAnimation: true,  // 开启缩放动画
  zoomAnimationDuration: 300 , // 动画时长（毫秒）
      renderOnMoving: true,
      renderOnZooming: true,
      maxCacheSize: 5000,
      crossOrigin: 'anonymous',
      tileSize: [256, 256],
      zoomOffset: 0,
      preloadTiles: true,
      bufferSize: 2,
  // 限制最大并发请求数（避免浏览器阻塞）
  tileLimit: 64
    })
  })

  // 监听地图移动事件
  map.on('moveend', updateDevices)

  // 初始加载设备数据
  updateDevices()
})

onUnmounted(() => {
  if (map) {
    map.remove()
  }
})
</script>

<style scoped>
.map-container {
  width: 100%;
  position: relative;
}

.map {
  width: 100%;
  height: 100%;
}
</style>
