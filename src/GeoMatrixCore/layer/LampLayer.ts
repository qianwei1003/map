import { LayerCore, type IconOptions }  from './LayerCore'
import { DEVICE_MODEL,DEVICE_VALUE  } from '../common/constants'
import type { MapItem } from '../data/types'
export class LampLayer extends LayerCore {
  constructor() {
    const imgArr = [
      'alarm_lamp_on',
      'alarm_lamp_off',
      'alarm_lamp_error',
      'alarm_lamp_unknown',
      'alarm_lamp_on@2x',
      'alarm_lamp_off@2x',
      'alarm_lamp_error@2x',
      'alarm_lamp_unknown@2x',
      'lamp_on',
      'lamp_off',
      'lamp_error',
      'lamp_unknown',
      'lamp_on@2x',
      'lamp_off@2x',
      'lamp_error@2x',
      'lamp_unknown@2x'
    ]
    const opt = {
      // autoRefresh: true,  // 自动刷新
      // refreshInterval: 16  // 刷新间隔，单位毫秒，约等于 60fps
    }
    super(DEVICE_MODEL.LAMP, imgArr, opt)
  }

  public async onDraw(items: MapItem[]): Promise<void> {
    const markers = await Promise.all(
      items.map(async item => {
        const iconOptions = this.getIconOptions(item)
        const icon = await this.createIcon(iconOptions)
        return {
          id: item.id,
          position: [item.lat, item.lng] as [number, number],
          icon
        }
      })
      
    )
    await this.initMarkers(markers)
  }

  private getIconOptions(item: MapItem): IconOptions {
    const { ls, aStatus, aValues = [] } = item.data
    const hasAlarm = aStatus === 1 || aValues.length > 0

    // 根据状态确定图标
    const getIconUrl = (isActive: boolean = false) => {
      const prefix = hasAlarm ? 'alarm_lamp_' : 'lamp_'
      const suffix = isActive ? '@2x' : ''
      
      switch (ls) {
        case 1: return `${prefix}on${suffix}`
        case 2: return `${prefix}off${suffix}`
        case 3: return `${prefix}error${suffix}`
        default: return `${prefix}unknown${suffix}`
      }
    }

    return {
      normal: {
        url: getIconUrl(),
        width: hasAlarm ? 24 : 20,
        height: hasAlarm ? 24 : 20
      },
      active: {
        url: getIconUrl(true),
        width: hasAlarm ? 36 : 24,
        height: hasAlarm ? 40 : 28
      }
    }
  }
}
