import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  loginFormData,
  loginResponseData,
  userInfoResponseData,
} from '@/api/user/type'
// 引入token相关函数
import { setToken, getToken, reomveToken } from '@/utils/token'
export const useUserStore = defineStore('userStore', () => {
  // token存储
  const token = ref<string>(getToken() as string)
  // 登录相关业务
  const login = async (data: loginFormData) => {
    const result: loginResponseData = await reqLogin(data)
    if (result.code === 200) {
      // 登录成功, 将token存储起来
      token.value = result.data
      // 将token存储到本地存储中
      setToken(result.data)
      return 'ok'
    }
    return Promise.reject(new Error(''))
  }
  // 存储用户头像跟名称
  const userInfo = ref({
    avatar: '',
    name: '',
  })
  // 得到登录用户的信息
  const getUserInfo = async () => {
    const result: userInfoResponseData = await reqUserInfo()
    if (result.code === 200) {
      userInfo.value.avatar = result.data.avatar
      userInfo.value.name = result.data.name
      return 'ok'
    } 
    return Promise.reject(new Error(''))
  }
  // 退出登录
  const logout = async () => {
    const result = await reqLogout()
    if (result.code === 200) {
      // 清空头像跟用户名
      userInfo.value.avatar = ''
      userInfo.value.name = ''
      // 清空token
      token.value = ''
      // 清空本地存储的token
      reomveToken()
      return 'ok'
    }
    return Promise.reject(new Error(''))
  }
  return {
    login,
    token,
    getUserInfo,
    userInfo,
    logout,
  }
})
