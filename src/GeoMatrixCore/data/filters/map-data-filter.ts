import type { MapItem, MapData, DataChangeEvent } from '../types'
import { DEVICE_VALUE, DATA_CHANGE_TYPE } from '../../common/constants'
import EventEmitter from 'eventemitter3'
export abstract class MapDataFilter extends EventEmitter{
  private mname: string
  private mtypes: DEVICE_VALUE
  private mlayerSetting: boolean
  private isEnabled: boolean = true
  private items: MapItem[] = []
  private itemsMap: Map<string, MapItem> = new Map()
  public _isVue: boolean = true

  constructor(name: string, types: DEVICE_VALUE, layerSetting: boolean) {
    super()
    this.mname = name
    this.mtypes = types
    this.mlayerSetting = layerSetting

    // this.boundsAll = {
    //   minLat: 90,
    //   minLng: 180,
    //   maxLat: -90,
    //   maxLng: -180,
    //   bounds: undefined,
    //   childCount: 0,
    //   _isVue: true
    // }
  }

  public addData(data:MapData[], type: DEVICE_VALUE) {
    const added: MapItem[] = [];
    for (const d of data) {
      const item = this.filter(d, type);
      if (item) {
        this.items.push(item)
        this.itemsMap.set(item.id, item)
        added.push(item);
      }   
    }
    if (added.length > 0) {
      this.emit('dataChanged', {
        type: DATA_CHANGE_TYPE.ADD,
        deviceType: type,
        itemsAll: this.items,
        itemsChange: added,
        timestamp: Date.now()
      } as DataChangeEvent)
    }
  }
  /**
     * 执行地图数据过滤处理
     * @param data 当前的地图数据（不为 undefined 和 null）
     * @param type 当前地图数据种类，不会存在: MapDataTypeID.ALL 值
     * @returns 过滤结果（若不需要增加到过滤器则返回 undefined 或 null ）
     */
  public abstract filter(data: MapData, type: DEVICE_VALUE): MapItem | undefined | null;

  // Getters & Setters
  public get name(): string {
    return this.mname
  }

  public get types(): DEVICE_VALUE {
    return this.mtypes
  }

  public get layerSetting(): boolean {
    return this.mlayerSetting
  }

  public get enabled(): boolean {
    return this.isEnabled
  }
  
  public set enabled(value: boolean) {
    if (this.isEnabled === value) return
    this.isEnabled = value
  }


  public get itemSize(): number {
    return this.items.length
  }

  // 数据操作方法
  public getItems(): MapItem[] {
    return [...this.items]
  }

  public hasItem(id?: string): boolean {
    return id ? this.itemsMap.has(id) : false
  }

  public getItemByNativeID(id?: string): MapItem | undefined {
    return id ? this.itemsMap.get(id) : undefined
  }

  /**
     * 清理过滤器内部数据（此方法仅清理数据，不清空回调对象）
     */
  public clear() {
    // 获取当前数据
    // const items = this.items.concat([]);
    // 清空数据
    this.items.length = 0;
    // 清理集合
    this.itemsMap.clear();
}

}
