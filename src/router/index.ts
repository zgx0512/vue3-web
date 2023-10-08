import { createRouter, createWebHashHistory }  from 'vue-router'
import { constantRoute } from './routes'

const router = createRouter({
    // 路由模式：hash
    history: createWebHashHistory(),
    routes: constantRoute,
    // 让每次路由跳转时，都回到顶部
    scrollBehavior() {
        return {
            left: 0,
            top: 0
        }
    }
})

export default router