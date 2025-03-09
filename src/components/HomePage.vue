<template>
  <div class="map-container">
    <div id="map" class="map"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-canvas-marker'
import { MapCore } from '@/GeoMatrixCore/MapCore'
import { MapType, MapStyle } from '@/GeoMatrixCore/common/constants'
import { getDeviceByLatLng } from '@/api/map'
import { getImageUrl } from '@/utils'

let mapInstance: MapCore | null = null
let activeMarkerLayer: any = null

// 创建设备图标
const createDeviceIcon = (status: number) => {
  const getIconUrl = () => {
    switch (status) {
      case 1: return 'map_images/lamp_on'
      case 2: return 'map_images/lamp_off'
      case 3: return 'map_images/lamp_error'
      default: return 'map_images/lamp_unknown'
    }
  }

  return L.icon({
    iconUrl: getImageUrl(`${getIconUrl()}.png`),
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  })
}
let markersCopy: any[] = []
// 更新设备数据
const updateDevices = async () => {
  if (!mapInstance) return

  const bounds = mapInstance.getBounds()
  if (!bounds) return
  try {
    const response = await getDeviceByLatLng({
      ...bounds,
      projectId: '1',
      level: 12,
      repeatTime: 0,
      poleView: false
    })

    if (response.code === 200) {
      // 初始化双缓冲图层
        activeMarkerLayer = L.canvasIconLayer({}).addTo(mapInstance.getMap()!)
      // 在缓冲图层上准备新的标记
      const markers = response.data.lamp.map(device => {
        return L.marker(
          [parseFloat(device.lat), parseFloat(device.lng)],
          { icon: createDeviceIcon(device.ls) }
        )
      })
      if (markersCopy.length > 0) {
        // 移除旧的标记
        console.log(markersCopy)
        markersCopy.forEach(marker => {
          activeMarkerLayer.removeMarker(marker)
        })
      }
      markersCopy = markers
      activeMarkerLayer.addMarkers(markers)
    }
  } catch (error) {
    console.error('获取设备数据失败:', error)
  }
}

onMounted(() => {
  // 初始化地图
  mapInstance = new MapCore({
    container: 'map',
    center: [39.908678, 116.397473], // 默认中心点（北京）
    zoom: 12,
    mapType: MapType.BAIDU
  })

  // 监听地图移动事件
  mapInstance.getMap()?.on('moveend', () => {
    updateDevices()
  })

  // 初始加载设备数据
  updateDevices()
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
