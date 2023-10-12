/*
 * @Author: 93354 93354@sangfor.com
 * @Date: 2023-10-09 14:38:17
 * @LastEditors: 93354 93354@sangfor.com
 * @LastEditTime: 2023-10-09 17:41:10
 * @FilePath: \vue3-web\src\api\acl\role\type.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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
  remark?: null | string
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
  code: string
  createTime: string
  id: number
  level: number
  name: string
  pid: number
  select: boolean
  status?: null
  toCode: string
  type: number
  updateTime: string
}
// 获取菜单列表返回值的ts类型
export interface menuListResponseData extends responseData {
  data: menuResponseData[]
}
// 分配权限的参数的ts类型
export interface permissionVoResponseData {
  permissionIdList: number[]
  roleId: number | string
}
