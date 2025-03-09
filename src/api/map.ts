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
  // 主干道（东西向）- 增加密度
  ...Array(40).fill(0).map((_, i) => [
    { lat: 39.8800 + (i * 0.0025), lng: 116.3800 },
    { lat: 39.8800 + (i * 0.0025), lng: 116.3850 },
    { lat: 39.8800 + (i * 0.0025), lng: 116.3900 },
    { lat: 39.8800 + (i * 0.0025), lng: 116.3950 },
    { lat: 39.8800 + (i * 0.0025), lng: 116.4000 },
    { lat: 39.8800 + (i * 0.0025), lng: 116.4050 },
    { lat: 39.8800 + (i * 0.0025), lng: 116.4100 },
    { lat: 39.8800 + (i * 0.0025), lng: 116.4150 },
    { lat: 39.8800 + (i * 0.0025), lng: 116.4200 }
  ]),
  // 主干道（南北向）- 增加密度
  ...Array(40).fill(0).map((_, i) => [
    { lat: 39.8800, lng: 116.3800 + (i * 0.0025) },
    { lat: 39.8850, lng: 116.3800 + (i * 0.0025) },
    { lat: 39.8900, lng: 116.3800 + (i * 0.0025) },
    { lat: 39.8950, lng: 116.3800 + (i * 0.0025) },
    { lat: 39.9000, lng: 116.3800 + (i * 0.0025) },
    { lat: 39.9050, lng: 116.3800 + (i * 0.0025) },
    { lat: 39.9100, lng: 116.3800 + (i * 0.0025) },
    { lat: 39.9150, lng: 116.3800 + (i * 0.0025) },
    { lat: 39.9200, lng: 116.3800 + (i * 0.0025) }
  ]),
  // 对角线道路 - 增加密度
  ...Array(30).fill(0).map((_, i) => [
    { lat: 39.8800 + (i * 0.0025), lng: 116.3800 + (i * 0.0025) },
    { lat: 39.8825 + (i * 0.0025), lng: 116.3850 + (i * 0.0025) },
    { lat: 39.8850 + (i * 0.0025), lng: 116.3900 + (i * 0.0025) },
    { lat: 39.8875 + (i * 0.0025), lng: 116.3950 + (i * 0.0025) },
    { lat: 39.8900 + (i * 0.0025), lng: 116.4000 + (i * 0.0025) },
    { lat: 39.8925 + (i * 0.0025), lng: 116.4050 + (i * 0.0025) },
    { lat: 39.8950 + (i * 0.0025), lng: 116.4100 + (i * 0.0025) },
    { lat: 39.8975 + (i * 0.0025), lng: 116.4150 + (i * 0.0025) },
    { lat: 39.9000 + (i * 0.0025), lng: 116.4200 + (i * 0.0025) }
  ]),
  // 反向对角线道路
  ...Array(30).fill(0).map((_, i) => [
    { lat: 39.9200 - (i * 0.0025), lng: 116.3800 + (i * 0.0025) },
    { lat: 39.9175 - (i * 0.0025), lng: 116.3850 + (i * 0.0025) },
    { lat: 39.9150 - (i * 0.0025), lng: 116.3900 + (i * 0.0025) },
    { lat: 39.9125 - (i * 0.0025), lng: 116.3950 + (i * 0.0025) },
    { lat: 39.9100 - (i * 0.0025), lng: 116.4000 + (i * 0.0025) },
    { lat: 39.9075 - (i * 0.0025), lng: 116.4050 + (i * 0.0025) },
    { lat: 39.9050 - (i * 0.0025), lng: 116.4100 + (i * 0.0025) },
    { lat: 39.9025 - (i * 0.0025), lng: 116.4150 + (i * 0.0025) },
    { lat: 39.9000 - (i * 0.0025), lng: 116.4200 + (i * 0.0025) }
  ])
].flat()

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
  const R = 6371000 // 地球半径（米）

  // Haversine公式计算两点间距离
  function haversineDistance(p1: { lat: number; lng: number }, p2: { lat: number; lng: number }) {
    const dLat = (p2.lat - p1.lat) * Math.PI / 180
    const dLon = (p2.lng - p1.lng) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }
console.log(path.length - 1,'path.length - 1');

  for (let i = 0; i < path.length - 1; i++) {
    const start = path[i]
    const end = path[i + 1]
    console.log(start, end,'start, end');
    
    // 使用haversine公式计算实际距离（米）
    const distance = haversineDistance(start, end)
    
    // 将spacing从经纬度单位转换为米
    const spacingInMeters = spacing * 111000 // 粗略转换：1度≈111km
    
    // 计算需要插入的灯具数量，确保至少有1个
    const count = Math.max(1, Math.floor(distance / spacingInMeters))
    
    // 在路段上均匀分布灯具
    const interpolated = interpolatePoints(start, end, count)
    lights.push(...interpolated)
  }
  
  return lights
}

// 模拟设备数据生成函数
function generateMockDevices(params: GetDeviceByLatLngParams): MapDataDevice[] {
  const devices: MapDataDevice[] = []
  const lightSpacing = 0.0001 // 减小灯具间距，确保生成更多灯具
  
  // 为每条道路生成灯具
  const paths = roadPaths.reduce((acc, point, i, arr) => {
    if (i % 9 === 0) {
      acc.push(arr.slice(i, i + 9))
    }
    return acc
  }, [])
  
  paths.forEach(path => {
    const lights = generateRoadLights(path, lightSpacing)
    
    lights.forEach((pos, index) => {
      // 添加更小的随机偏移
      const offsetLat = (Math.random() - 0.5) * 0.00005
      const offsetLng = (Math.random() - 0.5) * 0.00005
      
      const device: MapDataDevice = {
        dId: `device_${devices.length}`,
        pid: params.projectId,
        deviceTypeValue: DEVICE_VALUE.LAMP,
        type: 2,
        ctype: 1,
        uid: `uid_${devices.length}`,
        dName: `灯具${devices.length + 1}`,
        lat: (pos.lat + offsetLat).toString(),
        lng: (pos.lng + offsetLng).toString(),
        ls: Math.floor(Math.random() * 4) + 1,
        aStatus: Math.random() > 0.8 ? 1 : 0,
        aValue: Math.random() > 0.8 ? 1 : 0,
        networkStatus: Math.random() > 0.2 ? 1 : 0,
        signals: Math.floor(Math.random() * 100),
        dStatus: 1,
        dim: Math.floor(Math.random() * 100)
      }
      devices.push(device)
    })
  })

  return devices
}

// 获取设备接口
export async function getDeviceByLatLng(params: GetDeviceByLatLngParams) {
  // 模拟接口延迟
  // await new Promise(resolve => setTimeout(resolve, 200))

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
