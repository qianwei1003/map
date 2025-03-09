// 获取项目名称
export function getProjectName(): string {
  // 这里可以根据实际需求从配置或环境变量中获取项目名称
  return 'GeoMatrix'
}

// 获取图片URL
export function getImageUrl(path: string): string {
  // 根据环境判断是否需要添加基础路径
  const baseUrl = import.meta.env.BASE_URL || '/'
  // 如果路径以public开头，则移除它
  const normalizedPath = path.replace(/^public\//, '')
  return `${baseUrl}${normalizedPath.startsWith('/') ? normalizedPath.slice(1) : normalizedPath}`
}

// 全局时间戳
export const timestampGlobal = Date.now()
