//定义全部接口返回数据都拥有ts类型
export interface responseData {
  code: 200
  message: string
  ok: boolean
}
// 每个角色的ts类型
export interface roleResponseData {
  id?: number | string
  createTime?: string
  updateTime?: string
  roleName: string
  remark: null | string
}
// 获取角色列表的返回值的ts类型
export interface rolesListResponseData extends responseData {
  data: {
    records: roleResponseData[]
    countId?: number | null
    current: number
    hitCount?: boolean
    maxLimit?: null
    optimizeCountSql?: true
    orders?: any[]
    pages: number
    searchCount?: boolean
    size: number
    total: number
  }
}
// 每个菜单的ts类型
export interface menuResponseData {
    children?: menuResponseData[]
    code: string,
    createTime: string,
    id: number,
    level: number,
    name: string,
    pid: number,
    select: boolean,
    status?: null,
    toCode: string,
    type: number;
    updateTime: string
}
// 获取菜单列表返回值的ts类型
export interface menuListResponseData extends responseData {
    data: menuListResponseData[]
}
// 分配权限的参数的ts类型
export interface permissionVoResponseData {
  permissionIdList: number[],
  roleId: number | string
}
