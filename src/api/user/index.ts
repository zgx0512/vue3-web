import request from '@/utils/request'
import type {
  loginFormData,
  loginResponseData,
  userInfoResponseData,
} from './type'
enum API {
  LOGIN_URL = '/admin/acl/index/login',
  GETUSERINFO_URL = '/admin/acl/index/info',
  LOGOUT_URL = '/admin/acl/index/logout',
}

// 登录接口
export const reqLogin = (data: loginFormData) => {
  return request<any, loginResponseData>({
    url: API.LOGIN_URL,
    method: 'post',
    data,
  })
}

// 获取用户信息接口
export const reqUserInfo = () => {
  return request.get<userInfoResponseData, any>(API.GETUSERINFO_URL)
}

// 退出登录接口
export const reqLogout = () => {
  return request.post<any, any>(API.LOGOUT_URL)
}
