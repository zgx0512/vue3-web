// vue3的全局事件总线, 借助mitt插件实现
import mitt from 'mitt'
const $bus = mitt()
export default $bus