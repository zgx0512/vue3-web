import request from '@/utils/request'
// 引入定义的ts类型
import type { menuResponseData, menuListResponseData } from './type'
enum API {
  MENULIST_URL = '/admin/acl/permission',
  ADDEMENU_URL = '/admin/acl/permission/save',
  UPDATEMENU_URL = '/admin/acl/permission/update',
  DELETE_URL = '/admin/acl/permission/remove/',
}
// 获取菜单数据的接口
export const reqMenuList = () => {
  return request.get<menuListResponseData, any>(API.MENULIST_URL)
}
// 添加|修改菜单的接口的函数
export const reqAddOrUpdateMenu = (menuInfo: menuResponseData) => {
  if (menuInfo.id) {
    // 修改的接口
    return request({
      url: API.UPDATEMENU_URL,
      method: 'put',
      data: menuInfo,
    })
  } else {
    // 添加的接口
    return request({
      url: API.ADDEMENU_URL,
      method: 'post',
      data: menuInfo,
    })
  }
}
// 递归删除菜单的接口
export const reqRemoveMenu = (id: number) => {
  return request<any>({
    url: API.DELETE_URL + id,
    method: 'delete',
  })
}
