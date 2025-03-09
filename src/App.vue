<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Tabbar, TabbarItem } from 'vant'

const router = useRouter()
const active = ref(0)

const routes = [
  { name: 'home', icon: 'home-o', title: '首页' },
  { name: 'map', icon: 'location-o', title: '地图' },
  { name: 'settings', icon: 'setting-o', title: '设置' }
]

const onChange = (index: number) => {
  active.value = index
  router.push({ name: routes[index].name })
}
</script>

<template>
  <router-view />
  <van-tabbar v-model="active" @change="onChange">
    <van-tabbar-item v-for="(route, index) in routes" :key="index" :icon="route.icon">
      {{ route.title }}
    </van-tabbar-item>
  </van-tabbar>
</template>

<style>
#app {
  height: 100vh;
  display: flex;  
  width: 100%;
  flex-direction: column;
}

.van-tabbar {
  background-color: #ffffff;
  border-top: 1px solid #f5f5f5;
}
</style>
