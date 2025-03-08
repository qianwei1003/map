import { MapType, MapStyle, DEVICE_MODEL } from './constants'

export interface MapOptions {
  container: HTMLElement | string
  center: [number, number]
  zoom?: number
  minZoom?: number
  maxZoom?: number
  mapType?: MapType
  mapStyle?: MapStyle
}

export interface LayerOptions {
  visible?: boolean
  zIndex?: number
  opacity?: number
}

export interface TileLayerOptions extends LayerOptions {
  subdomains?: string[]
  tms?: boolean
}

export interface DeviceLayerOptions extends LayerOptions {
  iconSize?: [number, number]
  iconAnchor?: [number, number]
  popupAnchor?: [number, number]
}





