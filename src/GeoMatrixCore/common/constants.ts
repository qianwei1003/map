export enum MapType {
    BAIDU = 'baidu',
    GOOGLE = 'google'
}

export enum MapStyle {
    NORMAL = 'normal',
    SATELLITE = 'satellite'
}

export enum DataEventType {
    ADDED = 'added',      // 数据添加
    UPDATED = 'updated',  // 数据更新
    REMOVED = 'removed',  // 数据删除
    FILTERED = 'filtered' // 数据过滤
} 

export enum DEVICE_MODEL {  
  PROD = 'prod',  
  LCU = 'lcu',  
  SMARTBOX = 'smartBox',  
  RTU = 'rtu',  
  LAMP = 'lamp',  
  POLE = 'pole',  
  STATION = 'station',  
  DUSTBIN = 'dustbin',  
  WELLCOVER = 'wellcover',  
  THEFT = 'theft',  
  SHOWING_MASTER = 'showingMaster',  
  WEATHER = 'weather',  
  CAMERA = 'camera',  
  SCREEN = 'screen',  
  AKEYHELP = 'aKeyHelp',  
  NETWORKAUDIO = 'networkAudio',  
  POWERBOX = 'powerBox',  
  SPRAYPILE = 'spraypile',  
  CABINET = 'cabinet',  
  INTELLIGENTLOCK = 'intelligentLock',  
  HYGROTHERMOGRAPH = 'hygrothermograph',  
  WATERDETECTOR = 'waterDetector',  
  SOLARTERMINAL = 'solarTerminal',  
  RADAR = 'radar',  
  SOLARCONTROLLER = 'solarController'
}

export enum DEVICE_VALUE {
  LCU = 2,
  SMARTBOX = 3,
  RTU = 4,
  LAMP = 5,
  POLE = 6,
  STATION = 7,
  DUSTBIN = 13,
  WELLCOVER = 14,
  THEFT = 15,
  SHOWING_MASTER = 16,
  WEATHER = 17,
  CAMERA = 18,
  SCREEN = 27,
  AKEYHELP = 28,
  NETWORKAUDIO = 29,
  POWERBOX = 32,
  SPRAYPILE = 46,
  CABINET = 47,
  INTELLIGENTLOCK = 51,
  HYGROTHERMOGRAPH = 52,
  WATERDETECTOR = 53,
  RADAR = 54,
  SOLARTERMINAL = 56,
  SOLARCONTROLLER = 60
}

export interface DeviceTypeInfo {
  model: DEVICE_MODEL;
  value: number | null;
}

type DeviceModelToValueType = Record<DEVICE_MODEL, number | null>;

export const DeviceModelValueMap: DeviceModelToValueType = {
  [DEVICE_MODEL.PROD]: null,
  [DEVICE_MODEL.LCU]: DEVICE_VALUE.LCU,
  [DEVICE_MODEL.SMARTBOX]: DEVICE_VALUE.SMARTBOX,
  [DEVICE_MODEL.RTU]: DEVICE_VALUE.RTU,
  [DEVICE_MODEL.LAMP]: DEVICE_VALUE.LAMP,
  [DEVICE_MODEL.POLE]: DEVICE_VALUE.POLE,
  [DEVICE_MODEL.STATION]: DEVICE_VALUE.STATION,
  [DEVICE_MODEL.DUSTBIN]: DEVICE_VALUE.DUSTBIN,
  [DEVICE_MODEL.WELLCOVER]: DEVICE_VALUE.WELLCOVER,
  [DEVICE_MODEL.THEFT]: DEVICE_VALUE.THEFT,
  [DEVICE_MODEL.SHOWING_MASTER]: DEVICE_VALUE.SHOWING_MASTER,
  [DEVICE_MODEL.WEATHER]: DEVICE_VALUE.WEATHER,
  [DEVICE_MODEL.CAMERA]: DEVICE_VALUE.CAMERA,
  [DEVICE_MODEL.SCREEN]: DEVICE_VALUE.SCREEN,
  [DEVICE_MODEL.AKEYHELP]: DEVICE_VALUE.AKEYHELP,
  [DEVICE_MODEL.NETWORKAUDIO]: DEVICE_VALUE.NETWORKAUDIO,
  [DEVICE_MODEL.POWERBOX]: DEVICE_VALUE.POWERBOX,
  [DEVICE_MODEL.SPRAYPILE]: DEVICE_VALUE.SPRAYPILE,
  [DEVICE_MODEL.CABINET]: DEVICE_VALUE.CABINET,
  [DEVICE_MODEL.INTELLIGENTLOCK]: DEVICE_VALUE.INTELLIGENTLOCK,
  [DEVICE_MODEL.HYGROTHERMOGRAPH]: DEVICE_VALUE.HYGROTHERMOGRAPH,
  [DEVICE_MODEL.WATERDETECTOR]: DEVICE_VALUE.WATERDETECTOR,
  [DEVICE_MODEL.RADAR]: DEVICE_VALUE.RADAR,
  [DEVICE_MODEL.SOLARTERMINAL]: DEVICE_VALUE.SOLARTERMINAL,
  [DEVICE_MODEL.SOLARCONTROLLER]: DEVICE_VALUE.SOLARCONTROLLER
} as const;

// 辅助函数
export const getDeviceValue = (model: DEVICE_MODEL): number | null => {
  return DeviceModelValueMap[model];
};

export const getDeviceModelByValue = (value: number): DEVICE_MODEL => {
  return Object.entries(DeviceModelValueMap).find(
    ([_, val]) => val === value
  )?.[0] as DEVICE_MODEL;
};
export enum LayerType {
  TILE = 'tile',
  MARKER = 'marker',
  DEVICE = 'device'
}

export enum ZoomLevel {
  MIN = 3,
  MAX = 18,
  DEFAULT = 12
}
// 查询级别( 1 : 显示集中器和配电柜 2:显示常用设备,3: 显示全部)
export enum MAP_MAKER_LEVEL {
  RTU_CABINET = 1,
  COMMON = 2,
  ALL = 3
}

export enum DATA_CHANGE_TYPE {
  ADD = 'add',
  REMOVE = 'remove',
  UPDATE = 'update',
  RESET = 'reset'
}


export enum FILTER_EVENTS {
  DATA_CHANGED = 'dataChanged',
  ENABLED_CHANGED = 'enabledChanged'
}
