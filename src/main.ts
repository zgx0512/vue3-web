import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//@ts-ignore忽略当前文件ts类型的检测否则有红色提示(打包会失败)
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// 导入svg
import 'virtual:svg-icons-register'
// 引入自定义插件
import gloalComponent from '@/components/index'
// 引入路由
import router from './router/index'
// 引入全局的样式
import './styles/index.scss'
// 引入仓库
import pinia from './store/index'
// 引入路由鉴权文件
import './permisstion'
// 创建实例对象
const app = createApp(App)
// 使用插件
app.use(gloalComponent)
// 使用ElementPlus插件
app.use(ElementPlus, {
  locale: zhCn,
})
// 注册路由
app.use(router)
// 注册pinia
app.use(pinia)
app.mount('#app')
