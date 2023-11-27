/*
 * @Author: zgx 2324461523@qq.com
 * @Date: 2023-10-18 15:19:55
 * @LastEditors: zgx 2324461523@qq.com
 * @LastEditTime: 2023-11-27 19:17:19
 * @FilePath: \vue3-web\src\api\product\attr\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request'
// 引入ts类型
import {
  categoryListResponseData,
  attrInfoResponseData,
  attrInfoResponseDataItem,
} from './type'
enum API {
  CATEGORY1_URL = '/admin/product/getCategory1',
  CATEGORY2_URL = '/admin/product/getCategory2/',
  CATEGORY3_URL = '/admin/product/getCategory3/',
  ATTRINFOLIST_URL = '/admin/product/attrInfoList/',
  ADDORUPDATEATTRINFO_URL = '/admin/product/saveAttrInfo',
}

// 获取一级分类商品列表
export const reqCategory1List = () => {
  return request.get<categoryListResponseData, any>(API.CATEGORY1_URL)
}

// 根据一级分类id获取二级分类商品列表
export const reqCategory2List = (category1Id: string | number) => {
  return request.get<categoryListResponseData, any>(
    API.CATEGORY2_URL + category1Id,
  )
}

// 根据二级分类id获取三级分类商品列表
export const reqCategory3List = (category2Id: string | number) => {
  return request.get<categoryListResponseData, any>(
    API.CATEGORY3_URL + category2Id,
  )
}

// 获取商品基础属性列表
export const reqAttrInfoList = (
  category1Id: string | number,
  category2Id: string | number,
  category3Id: string | number,
) => {
  return request.get<attrInfoResponseData, any>(
    API.ATTRINFOLIST_URL + category1Id + '/' + category2Id + '/' + category3Id,
  )
}

// 添加或者修改商品基础属性
export const reqAddOrUpdateAttrInfo = (attr: attrInfoResponseDataItem) => {
  return request.post<any, any>(API.ADDORUPDATEATTRINFO_URL, attr)
}
