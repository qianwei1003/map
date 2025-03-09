import { getImageUrl } from '@/utils'
export class IconUtil {
  private static iconCache = new Map<string, HTMLImageElement>()

  static async preloadIcon(url: string): Promise<HTMLImageElement> {
    // 检查是否已经缓存了普通版本或高清版本
    if (this.iconCache.has(url)) {
      return this.iconCache.get(url)!
    }

    return new Promise((resolve, reject) => {
      const img = new Image()
      let retryWithNormalVersion = false

      const loadImage = (imagePath: string) => {
        img.src = getImageUrl(imagePath)
      }

      img.onload = () => {
        this.iconCache.set(url, img)
        resolve(img)
      }

      img.onerror = (error) => {
        if (!retryWithNormalVersion) {
          // 如果高清版本加载失败，尝试加载普通版本
          retryWithNormalVersion = true
          loadImage(`map_images/${url}.png`)
          return
        }
        console.error(`Failed to load icon: ${url}`, error)
        // 如果普通版本也加载失败，使用默认图片
        const defaultImg = new Image()
        defaultImg.src = getImageUrl('map_images/default.png')
        this.iconCache.set(url, defaultImg)
        resolve(defaultImg)
      }
      
      // 首先尝试加载高清版本
      loadImage(`map_images/${url}@2x.png`)
    })
  }

  static getIcon(url: string): HTMLImageElement | undefined {
    return this.iconCache.get(url)
  }
}
