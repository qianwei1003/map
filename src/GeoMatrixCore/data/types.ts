import { DEVICE_MODEL, DEVICE_VALUE, DATA_CHANGE_TYPE } from '../common/constants'


export interface DataChangeEvent {
  type: DATA_CHANGE_TYPE
  deviceType: DEVICE_VALUE
  itemsAll: MapItem[]
  itemsChange: MapItem[]
  timestamp: number
}
export interface Project {
  id: string
  projectId: string
  name: string
  lat: number
  lng: number
  level?: number
  children?: Project[]
}

export interface Device {
  id: string
  dId: string
  dName: string
  deviceModel: DEVICE_MODEL
  deviceTypeValue: DEVICE_VALUE
  lat: number
  lng: number
  dStatus: number
  projectId: string
  properties?: Record<string, any>
}

export interface DeviceType {
  rtu: Device[]
  station: Device[]
  lamp: Device[]
  cabinet: Device[]
  showingMaster: Device[]
  camera: Device[]
  pole: Device[]
  anti: Device[]
  sensor: Device[]
  wellcover: Device[]
  dustbin: Device[]
  spraypile: Device[]
  smartBox: Device[]
  radar: Device[]
}

export interface DeviceGroup {
  id: string
  name: string
  devices: Device[]
}
/**
 * 地图数据类型
 */
export type MapData = MapDataDevice;


/**
 * 地图设备数据（控制柜，灯具）
 */
export interface MapDataDevice {

  /**
   * 配电柜或灯具序号
   */
  dId: string;
  /**
   * 项目ID
   */
  pid: string
  /**
   * 区域ID
   */
  areaId?: string;
  /**
   * 道路ID
   */
  roadId?: string;
  /**
   * 灯具所属回路序号
   */
  kmId?: string;
  /**
   * 灯杆ID
   */
  poleId?: string;
  /**
   * 灯杆型号序号
   */
  poleModelId?: string;
  /**
   * 1. 控制柜所属父节点标识（可能是道路/区域/城市）
   * 2. 灯具所属控制柜标识（不存在时使用道路或区域或项目序号自动补全）
   */
  parentId?: string;
  /**
   * 终端序号
   */
  lcuId?: string;
  /**
   * 设备类型（配电柜：7；单灯：5）
   */
  deviceTypeValue: number,
  /**
   * 数据类型：1 - 配电柜 2 - 灯具
   */
  type: number;
  /**
   * 灯具设备类型：1 - 非直连
   */
  ctype: number;
  /**
   * 灯具数据的集控 UID
   */
  cuid?: string;
  /**
   * 唯一编码
   */
  uid: string;
  /**
   * 集控ID
   */
  rtuId?: string;
  /**
   * 设备名称或灯杆名称
   */
  dName: string;
  /**
   * 灯具名称
   */
  lampName?: string;
  /**
   * 纬度
   */
  lng?: string;
  /**
   * 经度
   */
  lat?: string;

  /**
   * 通讯模式 1-GRPS 2-网线 3-NB
   */
  smode?: number;
  /**
   * 信号强度（0-100）
   */
  signals?: number;
  /**
   * 网络状态(0:离线; 1:在线)
   */
  networkStatus?: number;
  /**
   * 设备使用状态; 1-启动; 2-停用; 3-检修; 4-拆除; 5-未启用; 6-闲置; 7-报废
   */
  dStatus?: number;
  /**
   * 设备使用状态; 1-启动; 2-停用; 3-检修; 4-拆除; 5-未启用; 6-闲置; 7-报废
   */
  deviceStatus?: number;
  /**
   * 灯头号
   */
  num?: number;
  /**
   * 灯具状态; 1-开灯; 2-关灯; 3-故障; 4-未知
   */
  ls: number;
  /**
   * 调光值
   */
  dim?: number;

  /**
   * 单灯的报警状态：1-有告警，0-无告警
   */
  aStatus: number;
  /**
   * 控制柜报警状态：1-报警 0-不报警
   */
  aValue: number;
  /**
   * 设备警报类型集合（501-灯具故障；502-电源故障, 401-节点丢失（通信中断））
   */
  aValues?: number[];
  /**
   * 设备所属监控分组数据（如灯具所属分组的 ID 数组）
   * @see {@link MapDeviceGroup.id }
   */
  groups?: number[];
  
  /**
   * 开关状态消息递增序列号（非原生消息消息）
   */
  _sortNum?: number;
  /**
   * 是否默认情况下不需要显示名称文本（非原生消息消息）
   */
  _noText?: boolean;
  /**
   * 是否默认情况下不显示信号（非原生消息消息）
   */
  _noSignal?: boolean;
  /**
   * 是否可选高亮灯具（非原生消息消息，用于选中一个灯具后高亮同一个灯杆下的其它灯具的标识）
   */
  _optLight?: boolean;

}
export interface Area {
  id: string
  name: string
  bounds: [number, number][]
  properties?: Record<string, any>
}
export type MapItem  = {
  id: string,
  type: DEVICE_VALUE,
  model: DEVICE_MODEL,
  lat: number,
  lng: number,
  data: MapData
}
/**
 * 灯杆数据
 */
export interface MapPole extends MapItem {

  /**
   * 灯杆序号
   */
  id: string;
  /**
   * 灯具所属父节点序号
   */
  parentId: string;
  /**
   * 当前灯杆取值的灯具序号（dId）
   */
  lampId: string;
  /**
   * 灯杆名称
   */
  name: string;
  /**
   * 是否不显示文本信息标识
   */
  noText: boolean;
  /**
   * 灯杆在连线中的排序号
   */
  poleNum: number;
  /**
   * 灯杆下的灯头总数
   */
  lamps: number;
  /**
   * 正在绘制的数量
   */
  drawingCount: number;
  /**
   * 灯具所属回路序号
   */
  kmId?: string;
  /**
   * 灯头排列的角度
   */
  angle: number;
  /**
   * 下一个灯杆
   */
  next?: MapPole;
  /**
   * 前一个灯杆
   */
  prev?: MapPole;
  /**
   * 在数组内的序号（临时）
   */
  index: number;
  /**
   * 灯杆的灯具角度方向（0 - 非平行连线（不变）；负数 - 灯杆角度与灯具角度方向相反；正数 - 灯杆角度与灯具角度方向相同）
   */
  direciton: number;
  /**
   * 多个灯具的排列角度（-360 ~ 0 ~ +360；以X坐标系正向为 0 度）
   */
  lampAngle: number;
  /**
   * 灯杆图标的排列角度（-360 ~ 0 ~ +360；以X坐标系正向为 0 度，与灯具排列角度刚好相反）
   */
  poleAngle: number;
  /**
   * 测试的角度值
   */
  testAngle: number;

}
