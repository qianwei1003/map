import type { MapDataDevice } from '@/GeoMatrixCore/data/types'
import { DEVICE_VALUE } from '@/GeoMatrixCore/common/constants'

interface GetDeviceByLatLngParams {
  latMax: number
  lngMax: number
  latMin: number
  lngMin: number
  deviceType?: string | number
  projectId: string
  level: number
  repeatTime: number
  poleView: boolean
}

// 模拟道路路径点
const roadPaths = [
  // 主干道1（东西向）
  [
    { lat: 39.9000, lng: 116.3800 },
    { lat: 39.9000, lng: 116.4000 },
    { lat: 39.9000, lng: 116.4200 }
  ],
  // 主干道2（南北向）
  [
    { lat: 39.8900, lng: 116.4000 },
    { lat: 39.9000, lng: 116.4000 },
    { lat: 39.9100, lng: 116.4000 }
  ],
  // 支路1（对角线）
  [
    { lat: 39.8950, lng: 116.3850 },
    { lat: 39.9000, lng: 116.4000 },
    { lat: 39.9050, lng: 116.4150 }
  ]
]

// 在路径点之间插值生成更多点
function interpolatePoints(start: { lat: number; lng: number }, end: { lat: number; lng: number }, count: number) {
  const points = []
  for (let i = 0; i <= count; i++) {
    const ratio = i / count
    points.push({
      lat: start.lat + (end.lat - start.lat) * ratio,
      lng: start.lng + (end.lng - start.lng) * ratio
    })
  }
  return points
}

// 生成路边的灯具位置
function generateRoadLights(path: { lat: number; lng: number }[], spacing: number) {
  const lights = []
  for (let i = 0; i < path.length - 1; i++) {
    const start = path[i]
    const end = path[i + 1]
    
    // 计算两点之间的距离（简化计算，实际应该使用球面距离）
    const distance = Math.sqrt(
      Math.pow(end.lat - start.lat, 2) + Math.pow(end.lng - start.lng, 2)
    )
    
    // 计算需要插入的灯具数量
    const count = Math.floor(distance / spacing)
    
    // 在路段上均匀分布灯具
    const interpolated = interpolatePoints(start, end, count)
    lights.push(...interpolated)
  }
  return lights
}

// 模拟设备数据生成函数
function generateMockDevices(params: GetDeviceByLatLngParams): MapDataDevice[] {
  const devices: MapDataDevice[] = []
  const lightSpacing = 0.0002 // 灯具间距（经纬度单位）
  
  // 为每条道路生成灯具
  roadPaths.forEach(path => {
    const lights = generateRoadLights(path, lightSpacing)
    
    lights.forEach((pos, index) => {
      // 添加随机偏移，模拟真实场景
      const offsetLat = (Math.random() - 0.5) * 0.0001
      const offsetLng = (Math.random() - 0.5) * 0.0001
      
      const device: MapDataDevice = {
        dId: `device_${devices.length}`,
        pid: params.projectId,
        deviceTypeValue: DEVICE_VALUE.LAMP,
        type: 2, // 灯具
        ctype: 1, // 非直连
        uid: `uid_${devices.length}`,
        dName: `灯具${devices.length + 1}`,
        lat: (pos.lat + offsetLat).toString(),
        lng: (pos.lng + offsetLng).toString(),
        ls: Math.floor(Math.random() * 4) + 1, // 1-4随机状态
        aStatus: Math.random() > 0.8 ? 1 : 0, // 20%概率有告警
        aValue: Math.random() > 0.8 ? 1 : 0, // 20%概率有告警
        networkStatus: Math.random() > 0.2 ? 1 : 0, // 80%概率在线
        signals: Math.floor(Math.random() * 100), // 0-100信号强度
        dStatus: 1, // 启用状态
        dim: Math.floor(Math.random() * 100) // 0-100调光值
      }
      
      // 只添加在可视范围内的设备
      if (pos.lat >= params.latMin && pos.lat <= params.latMax &&
          pos.lng >= params.lngMin && pos.lng <= params.lngMax) {
        devices.push(device)
      }
    })
  })

  return devices
}

// 获取设备接口
export async function getDeviceByLatLng(params: GetDeviceByLatLngParams) {
  // 模拟接口延迟
  await new Promise(resolve => setTimeout(resolve, 200))

  const mockDevices = generateMockDevices(params)

  return {
    code: 200,
    data: {
      lamp: mockDevices,
      rtu: [],
      station: [],
      cabinet: [],
      showingMaster: [],
      camera: [],
      pole: [],
      anti: [],
      sensor: [],
      wellcover: [],
      dustbin: [],
      spraypile: [],
      smartBox: [],
      radar: []
    }
  }
}
