import { MapCore } from './MapCore'
import { DataManager } from './data/map-data-manager'
import { MapOptions } from './common/types'
import EventEmitter from 'eventemitter3'
import { LayerManager } from './layer/LayerManager'
import { LampLayer} from './layer/LampLayer'
import { MAP_MAKER_LEVEL, FILTER_EVENTS, DEVICE_MODEL } from './common/constants'
import { countDeviceTotal, getDeviceByLatLng, getLampModelByLatLng, queryLcusOfPoleByLcuId } from '@/api/map'
import { storage } from '@/utils/store'
import { getProjectName, getImageUrl, timestampGlobal } from '@/utils'
import { MapFilters } from "./data/filters/map-filters";
import { DataChangeEvent } from './data/types'
import { debounce } from 'lodash'  // 添加 lodash 的 debounce

export class MapManager extends EventEmitter {
  private mapCore: MapCore
  private dataManager: DataManager
  private layerManager: LayerManager
  private level = MAP_MAKER_LEVEL.ALL
  private showLampOrPole: boolean = false
  private deviceTypeValue = -1
  // 添加防抖后的 setGis 方法
  private debouncedSetGis = debounce(() => this.setGis(), 300)

  constructor(options: MapOptions) {
    super()
    this.mapCore = new MapCore(options)
    this.dataManager = new DataManager()
    this.layerManager = new LayerManager()
}
  /**
   * init
   */
  public init() {
    const map = this.mapCore.getMap();
    if (map) {
      // 先设置地图中心
      const projectTree = storage.get('projectTree') || []
      const currentProject = projectTree.find((item: any) => item.projectId === storage.get('pid'))
      if (currentProject) {
        this.mapCore.setCenter([Number(currentProject.lat), Number(currentProject.lng)])
      }
      this.dataManager.clear();
      this.dataManager.addFilter(MapFilters.FILTER_LAMP);
      this.layerManager.setMap(map);
      const lampLayer = this.showLampOrPole ? new LampLayer() : new LampLayer();
      this.layerManager.addLayers([lampLayer]);
      MapFilters.FILTER_LAMP.on(FILTER_EVENTS.DATA_CHANGED, (data: DataChangeEvent) => {
        const { itemsAll } = data
        console.log(data,'xxx');
        this.layerManager.getLayerById(DEVICE_MODEL.LAMP)?.onDraw(itemsAll)
      })
      // 添加地图移动事件监听
      map.on('moveend', () => {
        this.debouncedSetGis()
      })

      this.setGis();
    }
  }
  public setGis() {
    const { latMax, lngMax, latMin, lngMin } = this.mapCore.getBounds()
    const params = {
        latMax,
        lngMax,
        latMin,
        lngMin,
        deviceType: this.deviceTypeValue === -1 ? '' : this.deviceTypeValue,
        projectId: storage.get('pid'),
        level: this.level,
        repeatTime: timestampGlobal(new Date().getTime(), false),
        poleView: this.showLampOrPole
    }
    getDeviceByLatLng(params).then((res: any) => {
      if (res.code === 200) {
        const data = res.data
        this.dataManager.initData(data)
      }
    })
  }
 
  // 资源清理
  public destroy(): void {
    this.dataManager.clear()
    this.layerManager.destroy()
    this.mapCore.destroy()
  }
}
