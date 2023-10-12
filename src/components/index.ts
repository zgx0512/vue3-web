// 暴露全部全局组件的插件

// 引入全局组件
import SvgIcon from './SvgIcon/index.vue'
import BaseTable from './BaseTable/index.vue'
// 引入element的所有图标，进行全局注册
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 将所有全局组件组合成一个对象
const gloalComponent: any = { SvgIcon, BaseTable }
export default {
  install(app: any) {
    // 遍历
    Object.keys(gloalComponent).forEach((key) => {
      // 注册全局组件
      app.component(key, gloalComponent[key])
    })
    // 全局注册element图标
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
