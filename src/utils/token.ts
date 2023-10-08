// token相关业务
// 存储token
export const setToken = (token: string) => {
  sessionStorage.setItem('TOKEN', token)
}
// 获取token
export const getToken = () => {
  return sessionStorage.getItem('TOKEN')
}

// 清空token
export const reomveToken = () => {
  sessionStorage.removeItem('TOKEN')
}
