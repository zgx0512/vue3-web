/*
 * @Author: zgx 2324461523@qq.com
 * @Date: 2023-10-09 14:38:17
 * @LastEditors: zgx 2324461523@qq.com
 * @LastEditTime: 2023-10-16 19:15:33
 * @FilePath: \vue3-web\src\utils\validate.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 引入接口函数
import { reqTrademarkListAll } from '@/api/product/trademark'
// 引入ts类型
import { trademarkResponseData } from '@/api/product/trademark/type'
// 引入ref
import { ref } from 'vue'
// 自定义密码校验规则
export const validatePassword = (_: any, value: any, callback: any) => {
  // 密码正则：至少六位，且至少包含一个字母跟一个数字
  const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
  if (reg.test(value)) {
    // 符合正则规则，放行
    callback()
  } else {
    // 不符合，提示信息
    callback(new Error('密码长度至少为六位，且至少包含一个字母跟一个数字'))
  }
}

// 自定义角色名校验规则
export const validateRoleName = (_: any, value: any, callback: any) => {
  // 角色名正则: 不能全是数字
  const reg = /^(?!\d+$)[\u4e00-\u9fa5\w]+$/
  if (reg.test(value)) {
    // 符合正则规则, 放行
    callback()
  } else {
    // 不符合, 提示信息
    callback(new Error('角色名不能全是数字'))
  }
}
// 品牌名字列表
const tmNameList = ref<string[]>([])
// 获取全部的品牌数据列表
const getTrademarkAllList = async () => {
  const result: any = await reqTrademarkListAll()
  if (result.code === 200) {
    // 获取全部的品牌名称
    tmNameList.value = result.data.map(
      (item: trademarkResponseData) => item.tmName,
    )
  }
}
// 自定义品牌名称校验规则
export const validatetmName = (
  _: any,
  value: any,
  callback: any,
  tmName: string,
) => {
  // 调用函数
  getTrademarkAllList()
  // 移除掉当前修改的品牌名称
  tmNameList.value = tmNameList.value.filter((item) => item !== tmName)
  // 判断品牌名称是否存在于品牌名称列表中
  const result = tmNameList.value.includes(value)
  if (value.length < 2) {
    // 不符合, 提示信息
    callback(new Error('品牌名称不能小于2位'))
    return
  }
  if (result) {
    callback(new Error('品牌名称已存在'))
    return
  }
  // 放行
  callback()
}
// 自定义上传图片校验规则
export const validateUploadImage = (
  rule: any,
  file: any,
  callback: any,
  isUpload: boolean,
) => {
  if (isUpload) {
    // 图片上传成功
    callback()
  } else {
    // 图片上传失败
    callback(new Error('上传图片不能为空'))
  }
}
