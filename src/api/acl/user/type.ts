//定义全部接口返回数据都拥有ts类型
export interface responseData {
  code: number
  message: string
  ok: boolean
}
// 每一个用户的ts类型
export interface userResponseData {
  id?: number | string
  createTime?: string
  updateTime?: string
  username: string
  password: string
  name: string
  phone?: string | null
  roleName?: string
}
// 全部用户组成的列表ts类型
export type records = userResponseData[]
// 用户分类列表返回值的ts类型
export interface userListResponseData extends responseData {
  data: {
    records: records
    total: number
    size: number
    current: number
    orders: string[]
    optimizeCountSql: boolean
    hitCount: boolean
    countId?: null
    maxLimit?: null
    searchCount?: boolean
    pages: number
  }
}

// 每一个角色的ts类型
export type roleResponseData = {
    id: number,
    createTime: string,
    updateTime: string,
    roleName: string,
    remark: null
}
// 获取角色列表的返回值ts类型
export interface rolesListResponseData extends responseData {
    data: {
        assignRoles: roleResponseData[],
        allRolesList: roleResponseData[]
    }
}

