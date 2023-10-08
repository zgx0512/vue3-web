// 引入axios
import axios from 'axios'
// 引入 ElMessage
import { ElMessage } from 'element-plus'
// 引入得到token的函数
import { getToken } from './token'
// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
})
// 请求拦截器
request.interceptors.request.use((config) => {
  if (getToken()) {
    config.headers.token = getToken()
  }
  return config
})
// 响应拦截器
request.interceptors.response.use(
  (res) => {
    return res.data
  },
  (error) => {
    // 处理网络错误
    let msg = ''
    const status = error.response.status
    switch (status) {
      case 401:
        msg = 'token过期'
        break
      case 403:
        msg = '无权访问'
        break
      case 404:
        msg = '请求地址错误'
        break
      case 500:
        msg = '服务器出现问题'
        break
      default:
        msg = '无网络'
    }
    ElMessage({
      message: msg,
      type: 'error',
    })
    return Promise.reject(error)
  },
)

export default request
