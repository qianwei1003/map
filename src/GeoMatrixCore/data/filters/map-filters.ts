import { MapDataFilter } from './map-data-filter'
import { DEVICE_MODEL, DEVICE_VALUE, getDeviceModelByValue } from '../../common/constants'
import type { MapItem,MapData,MapDataDevice,MapPole,  } from '../types'

/**
 * 灯具数据过滤器
 */
export class MapLampFilter extends MapDataFilter {
    private linesIndex: number = 0
    private roads: Map<string, string[]> = new Map()
    private poleLamps: Map<string, Map<string, MapItem[]>> = new Map()
    private loadPoles: Map<string, MapPole[]> = new Map()
    // private loadLines: Map<string, MapPoleLine> = new Map()
    private allPoles: Map<string, MapPole | MapPole[]> = new Map()
    private multiPoles: Map<string, MapPole> = new Map()
    private updateParents: Set<string> = new Set()
    private testNodes: MapItem[] = []

    private readonly prefixReg = /^[^0-9]+/ig
    private readonly angleForMath = Math.PI / 180
    private readonly distanceLimited = 0.000988571489925 * 1.5
    private readonly distanceLineLimited = 0.000988571489925 * 0.8
    private readonly multiLampDistance = 0.00008
    private readonly radiusOfLamps = 0.000045
    private readonly angleLimits: number[] = [5, 12, 22, 25, 30, 60]
    private readonly distanceLimits: number[] = [1.2, 1.4, 1.8, 2, 2.5, 2]
    private readonly angleLineLimited = 25

    constructor(layerSetting: boolean) {
        super(DEVICE_MODEL.LAMP, DEVICE_VALUE.LAMP, layerSetting)
    }

    public getConfigurationID(): string {
        return "10"
    }

    public getNativeID(data: MapData, type: DEVICE_VALUE): string | undefined {
        return (data as MapDataDevice).dId
    }

    public filter(data: MapData, type: DEVICE_VALUE): MapItem | null | undefined {
        // if (this.layerSetting && !this.manager.hasServerLayerConfig("10")) return
        const lamp = data as MapDataDevice
        // const id = lamp.uid && lamp.uid.length > 0 
        //     ? `${lamp.pid}_${lamp.uid}_${lamp.num || 1}` 
        //     : lamp.dId
        const id = lamp.dId
        return {
            id: id,
            model: getDeviceModelByValue(type),
            lat: Number(lamp.lat),
            lng: Number(lamp.lng),
            type: type,
            data: data
        }
    }

    public getRoads(parentId?: string): string[] | undefined {
        return parentId ? this.roads.get(parentId) : undefined
    }

    public getLampsByRoadName(parentId?: string, prefixName?: string): MapItem[] | undefined {
        if (!parentId || !prefixName) return

        const poles = this.poleLamps.get(parentId)
        if (!poles) return

        const lamps: MapItem[] = []
        
        for (const [_, value] of poles) {
            if (!value?.length) continue
            
            for (const lamp of value) {
                const data = lamp.data as MapDataDevice
                const name = data.dName || data.lampName || ''
                
                if (name.startsWith(prefixName)) {
                    lamps.push(lamp)
                }
            }
        }

        return lamps.length > 0 ? lamps : undefined
    }

    public getPoles(parentId?: string): MapPole[] | undefined {
        return parentId ? this.loadPoles.get(parentId) : undefined
    }

    public getLampsByPoleId(parentId?: string, poleId?: string): MapItem[] | undefined {
        if (!parentId || !poleId) return
        const poles = this.poleLamps.get(parentId)
        return poles?.get(poleId)
    }

    public getFirstPole(poleId?: string): MapPole | undefined {
        if (!poleId) return
        const poles = this.allPoles.get(poleId)
        if (!poles) return undefined
        return Array.isArray(poles) ? poles[0] : poles
    }
}


export class MapFilters {
  /**
     * 灯具数据过滤器
     */
  public static readonly FILTER_LAMP = new MapLampFilter(true);

  /**
     * 根据地图项获取地图项内数据的原生数据序号
     * @param item 地图项对象
     */
  public static getItemNativeID(item?: MapItem) {
    // 判断是否有效
    if (!item || !item.id || !item.data) return;
    // 未获取成功，分析地图项的数据字段
    let id: string | undefined;
    // 判断数据项类型
    switch (item.type) {
        case DEVICE_VALUE.DUSTBIN:
        case DEVICE_VALUE.LAMP:
            id = (item.data as MapDataDevice).dId;
            break;
        // case DEVICE_VALUE.CAMERA:
        //     id = (item.data as MapDataCamera).deviceId;
        //     break;
        // case DEVICE_VALUE.LUX_METER:
        //     id = (item.data as MapDataLuxMeter).deviceId;
        //     break;
        // case DEVICE_VALUE.AIBOX:
        //     id = (item.data as MapDataAIBOX).deviceId;
        //     break;
        // case DEVICE_VALUE.ROAD:
        // case DEVICE_VALUE.AREA:
        //     id = (item.data as MapDataAreaAndRoad).id;
        //     break;
        // case DEVICE_VALUE.PROJECT:
        //     id = (item.data as ProjectInfo).projectId;
        //     break;
        // case DEVICE_VALUE.CITY:
        //     id = (item.data as City).id;
        //     break;
        default:
            break;
    }
    // 返回数据
    return id;
}
}
