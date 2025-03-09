import { createApp } from 'vue'
import './style.css'
import 'vant/lib/index.css'  // 导入Vant样式
import App from './App.vue'
import router from './router'
import { Tabbar, TabbarItem } from 'vant'

const app = createApp(App)

// 注册Vant组件
app.use(Tabbar)
app.use(TabbarItem)

// 使用路由
app.use(router)

app.mount('#app')
