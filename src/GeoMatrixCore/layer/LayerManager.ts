import L from 'leaflet'
import { LayerCore } from './LayerCore'

export class LayerManager {
  private map: L.Map | null = null
  private layers: Map<string, LayerCore> = new Map()
  constructor() {}
  public setMap(map: L.Map): void {
    this.map = map;
  }
  public addLayer(layer: LayerCore): void {
    if (!this.map || !this.map.hasLayer) return
    if (!this.layers.has(layer.id)) {
      this.layers.set(layer.id, layer)
      layer.addTo(this.map)
    }
  }
  public addLayers(layers: Array<LayerCore>): void {
    layers.forEach(layer => {
      this.addLayer(layer)
    })
  }
  public getLayerById(id: string): LayerCore | undefined {
    return this.layers.get(id)
  }
  public destroy(): void {
    if (this.map) {
      this.layers.forEach(layer => {
        layer.destroy()
      })
      this.layers.clear()
      this.map = null
    }
  }
}
