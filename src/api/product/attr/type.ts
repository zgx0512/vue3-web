/*
 * @Author: zgx 2324461523@qq.com
 * @Date: 2023-10-18 15:20:00
 * @LastEditors: zgx 2324461523@qq.com
 * @LastEditTime: 2023-11-08 17:52:32
 * @FilePath: \vue3-web\src\api\product\attr\type.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
//定义全部接口返回数据都拥有ts类型
export interface responseData {
  code: number
  message: string
  ok: boolean
}

// 定义商品的ts类型
export interface categoryResponseData {
  id?: number
  createTime?: string
  updtaeTime?: string
  name?: string
  category1Id?: number
  category2Id?: number
}
// 定义获取分类商品的返回值的ts类型
export interface categoryListResponseData extends responseData {
  data: categoryResponseData[]
}
// 定义每个属性值列表的ts类型
export interface attrValueResponseDataItem {
  attrId?: number
  createTime?: string
  id?: number
  updtaeTime?: string
  valueName: string
  isEdit?: boolean
}
// 定义每个商品基础属性的ts类型
export interface attrInfoResponseDataItem {
  id?: number
  createTime?: string
  updtaeTime?: string
  attrName: string
  categoryId?: number
  categoryLevel?: number
  attrValueList: attrValueResponseDataItem[]
}

// 定义商品基础属性返回值的ts类型
export interface attrInfoResponseData extends responseData {
  data: attrInfoResponseDataItem[]
}
