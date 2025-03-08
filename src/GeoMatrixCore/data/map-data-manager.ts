import { Device, Project, DeviceType } from './types'
import { DataEventType, DEVICE_MODEL, DEVICE_VALUE } from '../common/constants'
import EventEmitter from 'eventemitter3'
import { MapData, MapDataDevice, MapItem } from './types'
import { MapDataFilter } from './filters/map-data-filter'
export class DataManager extends EventEmitter {
  private filters: Map<string, MapDataFilter> = new Map()
  private showPoleMode: boolean = false
  private lamps: MapDataDevice[] = []
  
  constructor() {
    super()
  }
  
  public init() {
    this.clear()
  }
  
  
  
  public get isPoleMode(): boolean {
    return this.showPoleMode
  }
  
  public set isPoleMode(value: boolean) {
    if (this.showPoleMode === value) return
    this.showPoleMode = value
    this.emit(DataEventType.FILTERED, { type: 'device' })
  }
  
  private addFiltersData(data: MapData[], type: DEVICE_VALUE) {
    this.filters.forEach((filter) => {
      if (filter.types === type) {
        filter.addData(data, type)
      }
    })
  }
  public getFilteredDevicesData() {
    const devices: MapItem[] = []
    this.filters.forEach((filter) => {
      if (filter.types === DEVICE_VALUE.LAMP) {
        devices.push(...filter.getItems())
      }
    })
    return devices
  }
  public initData(data) {
    this.clearData()
    const {
      rtu,
      station,
      lamp,
      cabinet,
      showingMaster,
      camera,
      pole,
      anti,
      sensor,
      wellcover,
      dustbin,
      spraypile,
      smartBox,
      radar
    } = data
    if (!this.showPoleMode) {
      this.initLamp(lamp)
    }
  }
  
  public initLamp(data: MapDataDevice[]) {
    if (!data) return
    this.lamps = []
    for (const d of data) {
      if (!d.dim) d.dim = 0
      if (!d.ls) d.ls = 4
      this.lamps.push(d)
    }
    const filter = this.getFilter(DEVICE_MODEL.LAMP)
    if (filter) {
      filter.clear()
    }
    this.addFiltersData(data, DEVICE_VALUE.LAMP)
  }
  
  public addFilter(filter: MapDataFilter): boolean {
    if (!filter || this.filters.has(filter.name)) return false
    this.filters.set(filter.name, filter)
    return true
  }
  
  public getFilter(name: string): MapDataFilter | undefined {
    if (!name) return undefined
    return this.filters.get(name)
  }
  
  public removeFilter(name: string): MapDataFilter | undefined {
    if (!name) return undefined
    const filter = this.filters.get(name)
    return this.filters.delete(name) ? filter : undefined
  }
  
  public clearData() {
    this.lamps = []
    this.filters.forEach((filter) => {
      filter.clear()
    })
  }

  public clear() {
    this.filters.forEach(filter => filter.clear())
    this.filters.clear()
  }
}
