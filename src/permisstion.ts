// 路由鉴权
// 引入路由
import router from './router'
// 引入user仓库
import { useUserStore } from './store/modules/user'
import pinia from './store'
// 引入进度条插件
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import { ElNotification } from 'element-plus'
// 引入欢迎语
import getTime from '@/utils/getTime'
nprogress.configure({
  showSpinner: false, // 关闭进度环 默认true
  easing: 'ease',
})
// 实例化仓库对象
const userStore = useUserStore(pinia)
// 解构出userInfo, getUserInfo
const { userInfo, getUserInfo, logout } = userStore
router.beforeEach(async (to: any, from: any, next: any) => {
  if (from.name === 'login' && userStore.token) {
    ElNotification({
      title: `HI，${getTime}`,
      message: '欢迎回来',
      type: 'success',
      duration: 3000,
    })
  }
  // 开启进度条
  nprogress.start()
  // 判断是否有token
  if (userStore.token) {
    // 登录状态
    if (to.name === 'login') {
      // 登录状态下不允许前往登录页, 直接重定向到首页
      next('/home')
    } else {
      if (!userInfo.name || !userInfo.avatar) {
        // 用户名或头像为空, 要重新发送获取用户信息的请求
        try {
          await getUserInfo()
          // 放行
          next()
        } catch (error) {
          // token失效情况: 直接退出登录
          logout()
        }
      } else {
        next()
      }
    }
  } else {
    if (to.name === 'login') {
      next()
    } else {
      next('/login')
    }
  }
})
router.afterEach((to: any) => {
  document.title = '后台管理平台 - ' + to.meta.title
  // 关闭进度条
  nprogress.done()
})
