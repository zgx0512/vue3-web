import request from '@/utils/request'
// 引入ts类型
import {
  userListResponseData,
  userResponseData,
  rolesListResponseData,
} from './type'
enum API {
  USERLIST_URL = '/admin/acl/user/',
  ADDUSER_URL = '/admin/acl/user/save',
  UPDATEUSER_URL = '/admin/acl/user/update',
  BATCHREMOVE_URL = '/admin/acl/user/batchRemove',
  REMOVE_URL = '/admin/acl/user/remove/',
  ROLESLIST_URL = '/admin/acl/user/toAssign/',
  ASSIGNROLE_URL = '/admin/acl/user/doAssignRole',
}

// 获取用户分页列表  GET /admin/acl/user/{page}/{limit}
export const reqUserList = (page: number, limit: number, username?: string) => {
  return request<userListResponseData, any>({
    url: API.USERLIST_URL + `${page}/${limit}`,
    method: 'get',
    params: {
      username,
    },
  })
}

// 添加|修改用户
export const reqAddOrUpdateUser = (userForm: userResponseData) => {
  if (userForm.id) {
    // id 存在，是修改操作
    return request<any, any>({
      url: API.UPDATEUSER_URL,
      method: 'put',
      data: userForm,
    })
  } else {
    // id 不存在，添加操作
    return request<any, any>({
      url: API.ADDUSER_URL,
      method: 'post',
      data: userForm,
    })
  }
}

// 根据id列表批量删除用户
export const reqBatchRemove = (idList: number[]) => {
  return request<any, any>({
    url: API.BATCHREMOVE_URL,
    method: 'delete',
    data: idList,
  })
}

// 根据id删除用户
export const reqRemove = (id: number) => {
  return request<any, any>({
    url: API.REMOVE_URL + id,
    method: 'delete',
  })
}

// 根据用户id获取角色列表
export const reqRolesList = (id: number) => {
  return request.get<rolesListResponseData, any>(API.ROLESLIST_URL + id)
}

// 根据用户分配角色
export const reqAssignRole = (roleVo: any) => {
  return request<any, any>({
    url: API.ASSIGNROLE_URL,
    method: 'post',
    data: roleVo,
  })
}
