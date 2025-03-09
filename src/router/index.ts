import { createRouter, createWebHistory } from 'vue-router'
import MapPage from '@/components/MapPage.vue'
import HomePage from '@/components/HomePage.vue'
import SettingsPage from '@/components/SettingsPage.vue'
import NewMapPage from '@/components/NewMapPage.vue'

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
    },
    {
      path: '/new-map',
      name: 'new-map',
      component: NewMapPage
    }
  ]
})

export default router