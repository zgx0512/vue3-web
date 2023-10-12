/* 
根据时间显示不同的欢迎语
*/

// 获取当前的时间
const date = new Date()
// 获取当前的小时数
const hour = date.getHours()
// 欢迎语
let welMessage = ''
if (hour >= 7 && hour < 8) {
  welMessage = '早上好'
} else if (hour >= 8 && hour < 12) {
  welMessage = '上午好'
} else if (hour >= 12 && hour < 14) {
  welMessage = '中午好'
} else if (hour >= 14 && hour < 18) {
  welMessage = '下午好'
} else if (hour >= 18 && hour < 22) {
  welMessage = '晚上好'
} else if (hour >= 22 || hour < 7) {
  welMessage = '午夜凌晨，请注意身体'
}

export default welMessage
