import L from 'leaflet'
import 'leaflet-canvas-marker'
import { IconUtil } from '../utils/icon'
import { getImageUrl } from '@/utils'
import type { MapItem } from '../data/types'
export abstract class LayerCore {
  public canvasLayer: any = null
  private map: L.Map | null = null
  private markers: Map<string, L.Marker> = new Map()
  private iconCache: Map<string, L.Icon> = new Map()
  private readonly layerId: string
  private items: MapItem[] = []
  private opt = {
    // pane: 'overlayPane',
    // // 设置图层的 z-index，控制图层叠加顺序
    // zIndex: 300,
    // // 是否启用缩放动画，默认为 true
    // zoomAnimation: true,
    // // 是否启用标记的缩放动画，默认为 true
    // markerZoomAnimation: true,
    // // 是否启用渐变动画，默认为 true
    // fadeAnimation: true
  }
  /**
   * 获取图层ID
   */
  public get id(): string {
    return this.layerId
  }

  constructor(layerId: string, preloadImages?: string[], opt) {
    this.opt = { ...this.opt, ...opt }
    this.layerId = layerId
    if (preloadImages?.length) {
      this.preloadImages(preloadImages)
    }
  }

  public init(items: MapItem[]) {
    this.items = items
  }
  
  public addTo(map: L.Map): void {
    this.map = map
    this.canvasLayer = L.canvasIconLayer(this.opt).addTo(map)
  }

  public async initMarkers(data: Array<{ id: string; position: [number, number]; icon: L.Icon }>): Promise<void> {
    if (!this.canvasLayer) return
    this.removeMarkers()
    this.addMarkers(data)
  }

  public async addMarker(id: string, position: [number, number], icon: L.Icon): Promise<void> {
    if (!this.canvasLayer) return
    const marker = L.marker(position, { icon })
    this.markers.set(id, marker)
    this.canvasLayer.addMarker(marker)
  }

  public async addMarkers(data: Array<{ id: string; position: [number, number]; icon: L.Icon }>): Promise<void> {
    if (!this.canvasLayer) return
    const markers = data.map(({ id, position, icon }) => {
      const marker = L.marker(position, { 
        icon
      })
      this.markers.set(id, marker)
      return marker
    })
    
    // 使用 addMarkers 批量添加
    this.canvasLayer.addMarkers(markers)
  }

  public removeMarker(id: string): void {
    const marker = this.markers.get(id)
    if (marker && this.canvasLayer) {
      this.canvasLayer.removeLayer(marker)
      this.markers.delete(id)
      this.canvasLayer.removeMarker(marker)
    }
  }
  public removeMarkers(): void {
    if (this.canvasLayer) {
      this.markers.forEach(marker => {
        this.canvasLayer.removeMarker(marker, true)
      })
      this.markers.clear()
      this.canvasLayer.redraw()
    }
  }
  public updateMarker(id: string, position: [number, number]): void {
    const marker = this.markers.get(id)
    if (marker) {
      marker.setLatLng(position)
      this.canvasLayer?.redraw()
    }
  }

  protected async createIcon(iconOptions: IconOptions): Promise<L.Icon> {
    const cacheKey = `${iconOptions.normal.url}_${iconOptions.normal.width}_${iconOptions.normal.height}`;
    if (!this.iconCache.has(cacheKey)) {
      const icon = L.icon({
        iconUrl: getImageUrl(`map_images/${iconOptions.normal.url}.png`),
        iconSize: [iconOptions.normal.width, iconOptions.normal.height],
        iconAnchor: [iconOptions.normal.width / 2, iconOptions.normal.height / 2],
        // iconActiveUrl: iconOptions.active ? getImageUrl(`map_images/${iconOptions.active.url}.png`) : undefined,
        // iconActiveSize: iconOptions.active ? [iconOptions.active.width, iconOptions.active.height] : undefined
      });
      console.log(cacheKey, 'cacheKey')
      this.iconCache.set(cacheKey, icon);
    }
    return this.iconCache.get(cacheKey)!;
  }

  public destroy(): void {
    if (this.canvasLayer && this.map) {
      // this.clear()
      this.map.removeLayer(this.canvasLayer)
      this.canvasLayer = null
      this.map = null
    }
  }

  /**
   * 预加载图标集合
   * @param iconUrls 图标URL数组
   * @returns Promise<void>
   */
  public async preloadIcons(iconOptionsList: IconOptions[]): Promise<void> {
    if (!iconOptionsList?.length) return;
    const loadPromises = iconOptionsList.map(async (options) => {
      const cacheKey = `${options.normal.url}_${options.normal.width}_${options.normal.height}`;
      if (!this.iconCache.has(cacheKey)) {
        await IconUtil.preloadIcon(options.normal.url);
        const icon = L.icon({
          iconUrl: getImageUrl(`${options.normal.url}.png`),
          iconSize: [options.normal.width, options.normal.height],
          iconAnchor: [options.normal.width / 2, options.normal.height / 2]
        });
        this.iconCache.set(cacheKey, icon);
      }
    });

    await Promise.all(loadPromises);
  }
  /**
 * 预加载图片资源
 * @param imageUrls 图片URL数组
 * @returns Promise<void>
 */
public async preloadImages(imageUrls: string[]): Promise<void> {
  if (!imageUrls?.length) return;
  const loadPromises = imageUrls.map(url => IconUtil.preloadIcon(url));
  await Promise.all(loadPromises);
}
abstract onDraw(data: any): void;

}

export interface IconOptions {
  normal: {
    url: string
    width: number
    height: number
  }
  active?: {
    url: string
    width: number
    height: number
  }
}
