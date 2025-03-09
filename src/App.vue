<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Tabbar, TabbarItem } from 'vant'

const router = useRouter()
const route = useRoute()
const active = ref(0)

const routes = [
  { name: 'home', icon: 'home-o', title: '首页' },
  { name: 'map', icon: 'location-o', title: '地图' },
  { name: 'new-map', icon: 'location-o', title: '新地图' },
  { name: 'settings', icon: 'setting-o', title: '设置' }
]

const onChange = (index: number) => {
  active.value = index
  router.push({ name: routes[index].name })
}

// 监听路由变化，更新tabbar激活状态
watch(() => route.name, (newRouteName) => {
  const index = routes.findIndex(route => route.name === newRouteName)
  if (index !== -1) {
    active.value = index
  }
})
</script>

<template>
  <router-view />
  <div class="tab">
    <van-tabbar v-model="active" @change="onChange">
    <van-tabbar-item v-for="(route, index) in routes" :key="index" :icon="route.icon">
      {{ route.title }}
    </van-tabbar-item>
  </van-tabbar>
  </div>
 
</template>

<style>
#app {
  height: 100vh;
  display: flex;
  width: 100%;
  flex-direction: column;
}

.map-container {
  flex: 1;
  overflow: hidden;
  height: calc(100vh - 80px);
}
.tab {
  flex-shrink: 0;
  height: 80px;
}
.van-tabbar {
  flex-shrink: 0;
  background-color: #ffffff;
  border-top: 1px solid #f5f5f5;
  height: 80px;
}

.van-tabbar {
  background-color: #ffffff;
  border-top: 1px solid #f5f5f5;
}
</style>
