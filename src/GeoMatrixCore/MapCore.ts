import L from 'leaflet'
import { MapOptions, TileLayerOptions } from './common/types'
import { MapType, MapStyle, ZoomLevel } from './common/constants'
import { MapConfig } from './config/map'

export class MapCore  {
  private map: L.Map | null = null
  private tileLayer: L.TileLayer | null = null
  private currentType: MapType  = MapType.BAIDU
  private currentStyle: MapStyle = MapStyle.NORMAL
  constructor(options: MapOptions) {
    this.map = L.map(options.container, {
      center: options.center,
      zoom: options.zoom,
      zoomControl: false,
      crs: MapConfig[options.mapType || MapType.BAIDU].crs
    })
    this.setTileLayer()
  }

  private setTileLayer(): void {
    if (!this.map) {
      console.error('Map instance is null')
      return
    }
  
    if (this.tileLayer) {
      this.map.removeLayer(this.tileLayer)
    }
  
    const config = MapConfig[this.currentType]
    const url = config.tileUrl[this.currentStyle]
    this.tileLayer = L.tileLayer(url, config.tileOptions).addTo(this.map)
  }

  public setMapType(type: MapType): void {
    if (type === this.currentType) return

    const config = MapConfig[type]
    if (!config || !this.map) return

    this.currentType = type
    this.map.options.crs = config.crs
    
    this.setTileLayer()
    this.map.setView(this.map.getCenter(), this.map.getZoom())
  }

  public setMapStyle(style: MapStyle): void {
    if (style === this.currentStyle) return

    this.currentStyle = style
    this.setTileLayer()
  }

  public getMap(): L.Map | null {
    return this.map
  }

  public destroy(): void {
    if (this.map) {
      this.map.remove()
      this.map = null
    }
  }
  /**
   * 获取当前地图可视范围
   * @returns 返回地图边界的经纬度范围，如果地图未初始化则返回 null
   */
  public getBounds(): { latMax: number; lngMax: number; latMin: number; lngMin: number } | null {
    if (!this.map) return null
    
    const bounds = this.map.getBounds()
    return {
      latMax: bounds.getNorth(),
      lngMax: bounds.getEast(),
      latMin: bounds.getSouth(),
      lngMin: bounds.getWest()
    }
  }
  /**
   * 获取当前地图中心点
   * @returns {L.LatLng | null} 返回地图中心点，如果地图未初始化则返回 null
   */
  public getCenter(): L.LatLng | null {
    return this.map?.getCenter() || null
  }

  /**
   * 获取当前地图缩放级别
   * @returns {number | null} 返回地图缩放级别，如果地图未初始化则返回 null
   */
  public getZoom(): number | null {
    return this.map?.getZoom() || null
  }

  /**
   * 设置地图中心点
   * @param center 中心点坐标 [纬度, 经度]
   * @param zoom 可选的缩放级别
   */
  public setCenter(center: [number, number], zoom?: number): void {
    if (!this.map) return
    
    if (zoom !== undefined) {
      this.map.setView(center, zoom)
    } else {
      this.map.setView(center)
    }
  }
}
