<template>
  <div class="settings-container">
    <h1 class="title">设置</h1>
    <div class="settings-content">
      <van-cell-group inset title="地图设置">
        <van-cell center title="默认缩放级别">
          <template #right-icon>
            <van-stepper v-model="mapZoom" min="1" max="20" />
          </template>
        </van-cell>
        <van-cell center title="夜间模式">
          <template #right-icon>
            <van-switch v-model="darkMode" />
          </template>
        </van-cell>
      </van-cell-group>

      <van-cell-group inset title="界面设置" class="mt-4">
        <van-cell center title="界面主题">
          <template #right-icon>
            <van-radio-group v-model="theme" direction="horizontal">
              <van-radio name="light">浅色</van-radio>
              <van-radio name="dark">深色</van-radio>
            </van-radio-group>
          </template>
        </van-cell>
        <van-cell center title="字体大小">
          <template #right-icon>
            <van-slider v-model="fontSize" :min="12" :max="20" :step="1" style="width: 100px" />
          </template>
        </van-cell>
      </van-cell-group>

      <van-cell-group inset title="关于" class="mt-4">
        <van-cell title="版本" value="1.0.0" />
        <van-cell title="开发者" value="GeoMatrix Team" />
      </van-cell-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  CellGroup,
  Cell,
  Switch,
  Stepper,
  RadioGroup,
  Radio,
  Slider
} from 'vant'

// 地图设置
const mapZoom = ref<number>(2)
const darkMode = ref<boolean>(false)

// 界面设置
const theme = ref<'light' | 'dark'>('light')
const fontSize = ref<number>(14)

// 监听设置变化并保存
watch([mapZoom, darkMode, theme, fontSize], () => {
  // 这里可以实现设置的持久化存储
  console.log('设置已更新')
})
</script>

<style scoped>
.settings-container {
  padding: 20px;
  height: 100vh;
  background-color: #f7f8fa;
}

.title {
  font-size: 24px;
  color: #323233;
  margin-bottom: 20px;
  padding-left: 16px;
}

.settings-content {
  margin-bottom: 24px;
}

.mt-4 {
  margin-top: 16px;
}
</style>