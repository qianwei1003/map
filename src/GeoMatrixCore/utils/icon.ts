import { getImageUrl } from '@/utils'
export class IconUtil {
  private static iconCache = new Map<string, HTMLImageElement>()

  static async preloadIcon(url: string): Promise<HTMLImageElement> {
    if (this.iconCache.has(url)) {
      return this.iconCache.get(url)!
    }

    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        this.iconCache.set(url, img)
        resolve(img)
      }
      img.onerror = (error) => {
        console.error(`Failed to load icon: ${url}`, error)
        // 加载失败时使用默认图片或者空图片
        const defaultImg = new Image()
        defaultImg.src = getImageUrl('map_images/default.png')  // 添加一个默认图片
        this.iconCache.set(url, defaultImg)
        resolve(defaultImg)
      }
      
      img.src = getImageUrl(`map_images/${url}.png`)  // 添加路径前缀和后缀
    })
  }

  static getIcon(url: string): HTMLImageElement | undefined {
    return this.iconCache.get(url)
  }
}
