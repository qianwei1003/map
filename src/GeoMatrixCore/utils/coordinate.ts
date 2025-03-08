export class CoordinateUtil {
  // WGS84 转百度坐标
  static wgs84ToBd09(lng: number, lat: number): [number, number] {
    // 具体转换逻辑
    return [lng, lat]
  }

  // 百度坐标转 WGS84
  static bd09ToWgs84(lng: number, lat: number): [number, number] {
    // 具体转换逻辑
    return [lng, lat]
  }

  // 检查点是否在视野范围内
  static isPointInBounds(point: [number, number], bounds: L.LatLngBounds): boolean {
    return bounds.contains(point)
  }
}
