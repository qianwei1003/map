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

let mapInstance: MapCore | null = null
let markerLayer: any = null

// 创建设备图标
const createDeviceIcon = (status: number) => {
  const iconUrl = `/map_images/lamp_${status === 1 ? 'on' : status === 0 ? 'off' : 'unknown'}@2x.png`
  return L.icon({
    iconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  })
}

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
      // 初始化 canvas 图层
      if (!markerLayer) {
        markerLayer = L.canvasIconLayer({}).addTo(mapInstance.getMap()!)
      }

      // 准备批量添加的标记
      const markers = response.data.lamp.map(device => {
        return L.marker(
          [parseFloat(device.lat), parseFloat(device.lng)],
          { icon: createDeviceIcon(device.ls) }
        )
      })

      // 清除现有标记并批量添加新标记
      markerLayer.removeMarkers()
      markerLayer.addMarkers(markers)
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

onUnmounted(() => {
  // 销毁地图实例和图层
  if (markerLayer) {
    markerLayer.clearLayers()
    markerLayer = null
  }
  if (mapInstance) {
    mapInstance.destroy()
    mapInstance = null
  }
})
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100vh;
  position: relative;
}

.map {
  width: 100%;
  height: 100%;
}
</style>
