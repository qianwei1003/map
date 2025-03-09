import { createRouter, createWebHistory } from 'vue-router'
import MapPage from '@/components/MapPage.vue'
import HomePage from '@/components/HomePage.vue'
import SettingsPage from '@/components/SettingsPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: HomePage
    },
    {
      path: '/map',
      name: 'map',
      component: MapPage
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsPage
    }
  ]
})

export default router