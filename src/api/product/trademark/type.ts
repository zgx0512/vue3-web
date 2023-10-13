//定义全部接口返回数据都拥有ts类型
export interface responseData {
  code: number
  message: string
  ok: boolean
}

// 每个品牌的ts类型
export interface trademarkResponseData {
  id?: number
  createTime?: string
  updateTime?: string
  tmName?: string
  logoUrl?: string
}

// 获取品牌列表的返回数据的ts类型
export interface trademarkListResponseData extends responseData {
  data: {
    records: trademarkResponseData[]
    total: number
    size: number
    current: number
    orders?: any[]
    optimizeCountSql?: boolean
    hitCount?: boolean
    countId?: any
    maxLimit?: any
    searchCount?: boolean
    pages?: number
  }
}
