import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
// import proj4 from 'proj4'
import 'proj4leaflet';
import { MapType, MapStyle } from '../common/constants'
export const BaiduCRS = new (L as any).Proj.CRS(
  'EPSG:900913',
  '+proj=merc +a=6378206 +b=6356584.314245179 +lat_ts=0.0 +lon_0=0.0 +x_0=0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs',
  {
    resolutions: (() => {
      const res = []
      const scale = 2 ** 18
      for (let i = 0; i < 19; i++) {
        res[i] = scale / (2 ** i)
      }
      return res
    })(),
    origin: [0, 0],
    bounds: L.bounds([20037508.342789244, 0], [0, 20037508.342789244])
  }
)

export const MapConfig = {
  [MapType.BAIDU]: {
    crs: BaiduCRS,
    tileUrl: {
      [MapStyle.NORMAL]: 'http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=pl&udt=20230712&scaler=1',
      [MapStyle.SATELLITE]: 'http://shangetu{s}.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46'
    },
    tileOptions: {
      subdomains: ['0', '1', '2', '3'],
      tms: true
    }
  },
  [MapType.GOOGLE]: {
    crs: L.CRS.EPSG3857,
    tileUrl: {
      [MapStyle.NORMAL]: 'http://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      [MapStyle.SATELLITE]: 'http://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
    },
    tileOptions: {
      subdomains: ['0', '1', '2', '3'],
      tms: false
    }
  }
}
