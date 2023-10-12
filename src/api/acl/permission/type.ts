//定义全部接口返回数据都拥有ts类型
interface responseData {
  code: number
  message: string
  ok: boolean
}
// 定义每个菜单的ts类型
export type menuResponseData = {
  id?: number | string
  createTIme?: string
  updateTime?: string
  pid?: number
  name: string
  code: string
  toCode?: null
  type?: number
  status?: null
  level?: number
  children?: menuResponseData[] | []
  select?: boolean
}
// 定义获取菜单数据接口的返回值的ts类型
export interface menuListResponseData extends responseData {
  data: menuResponseData[]
}
