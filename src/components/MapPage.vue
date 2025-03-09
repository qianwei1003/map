<template>
  <div class="map-container">
    <div id="map" ref="mapRef"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { MapManager } from '@/GeoMatrixCore/MapManager'

const mapRef = ref<HTMLElement | null>(null)
const mapManager = ref<MapManager | null>(null)

onMounted(() => {
  if (mapRef.value) {
    // 初始化地图管理器
    mapManager.value = new MapManager({
      container: mapRef.value,
      center: [0, 0],
      zoom: 2
    })
    mapManager.value.init()
  }
})
</script>

<style scoped>
.map-container {
  width: 100%;
  position: relative;
}

#map {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
}
</style>
