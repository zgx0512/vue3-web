import request from '@/utils/request'
// 引入ts类型
import {
  rolesListResponseData,
  roleResponseData,
  menuListResponseData,
  permissionVoResponseData,
} from './type'
enum API {
  ROLESLIST_URL = '/admin/acl/role/',
  ADDROLE_URL = '/admin/acl/role/save',
  UPDATEROLE_URL = '/admin/acl/role/update',
  BATCHREMOVE_URL = '/admin/acl/role/batchRemove',
  REMOVE_URL = '/admin/acl/role/remove/',
  MENULIST_URL = '/admin/acl/permission/toAssign/',
  ASSIGNACL_URL = '/admin/acl/permission/doAssignAcl',
}

// 获取角色列表的接口
export const reqRolesList = (
  page: number,
  limit: number,
  roleName?: string,
) => {
  return request.get<rolesListResponseData, any>(
    API.ROLESLIST_URL + `${page}/${limit}?roleName=${roleName}`,
  )
}
// 添加|修改角色的接口
export const reqAddOrUpdateRoleInfo = (roleInfo: roleResponseData) => {
  if (roleInfo.id) {
    // 有id, 是修改角色
    return request({
      url: API.UPDATEROLE_URL,
      method: 'put',
      data: roleInfo,
    })
  } else {
    // 没有id，是新增角色
    return request({
      url: API.ADDROLE_URL,
      method: 'post',
      data: roleInfo,
    })
  }
}
// 批量删除角色的接口
export const reqBatchRemove = (idList: number[]) => {
  return request<any, any>({
    url: API.BATCHREMOVE_URL,
    method: 'delete',
    data: idList,
  })
}
// 根据id删除角色
export const reqRemove = (id: number) => {
  return request<any, any>({
    url: API.REMOVE_URL + id,
    method: 'delete',
  })
}
// 根据角色用户获取菜单列表
export const reqMenuList = (roleId: number) => {
  return request.get<menuListResponseData, any>(API.MENULIST_URL + roleId)
}
// 给角色分配权限的接口
export const reqAssignAcl = (permissionVo: permissionVoResponseData) => {
  return request<any, any>({
    url: API.ASSIGNACL_URL,
    method: 'post',
    data: permissionVo,
  })
}
