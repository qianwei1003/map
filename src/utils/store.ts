/**
 * 本地存储管理工具
 */
export const storage = {
  /**
   * 设置本地存储
   * @param key 存储键名
   * @param value 存储值
   */
  set(key: string, value: any): void {
    try {
      const serializedValue = JSON.stringify(value)
      localStorage.setItem(key, serializedValue)
    } catch (error) {
      console.error('存储数据失败:', error)
    }
  },

  /**
   * 获取本地存储
   * @param key 存储键名
   * @param defaultValue 默认值（可选）
   */
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const serializedValue = localStorage.getItem(key)
      if (serializedValue === null) return defaultValue ?? null
      return JSON.parse(serializedValue)
    } catch (error) {
      console.error('读取数据失败:', error)
      return defaultValue ?? null
    }
  },

  /**
   * 删除指定的本地存储
   * @param key 存储键名
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('删除数据失败:', error)
    }
  },

  /**
   * 清空所有本地存储
   */
  clear(): void {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('清空数据失败:', error)
    }
  }
}