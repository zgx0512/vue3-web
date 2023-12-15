/*
 * @Author: zgx 2324461523@qq.com
 * @Date: 2023-10-18 15:29:40
 * @LastEditors: zgx 2324461523@qq.com
 * @LastEditTime: 2023-11-21 15:31:23
 * @FilePath: \vue3-web\src\store\modules\product\attr.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 属性管理的仓库
import { defineStore } from 'pinia'
// 引入组合式API
import { ref } from 'vue'
// 引入接口函数
import {
  reqCategory1List,
  reqCategory2List,
  reqCategory3List,
  reqAttrInfoList,
  reqAddOrUpdateAttrInfo,
  reqRemoveAttrInfo,
} from '@/api/product/attr'
// 引入ts类型
import {
  categoryResponseData,
  categoryListResponseData,
  attrInfoResponseData,
  attrInfoResponseDataItem,
} from '@/api/product/attr/type'

export const useAttrStore = defineStore('attrStore', () => {
  // 定义一级分类商品列表
  const category1List = ref<categoryResponseData[]>([])
  // 获取一级分类商品列表的函数
  const getCategory1List = async () => {
    // 发送请求
    const result: categoryListResponseData = await reqCategory1List()
    if (result.code === 200) {
      category1List.value = result.data
    }
  }
  // 定义二级分类商品列表
  const category2List = ref<categoryResponseData[]>([])
  // 获取二级分类商品列表的函数
  const getCategory2List = async (category1Id: string | number) => {
    // 发送请求
    const result: categoryListResponseData = await reqCategory2List(category1Id)
    if (result.code === 200) {
      category2List.value = result.data
    }
  }
  // 定义三级分类商品列表
  const category3List = ref<categoryResponseData[]>([])
  // 获取三级分类商品列表的函数
  const getCategory3List = async (category2Id: string | number) => {
    // 发送请求
    const result: categoryListResponseData = await reqCategory3List(category2Id)
    if (result.code === 200) {
      category3List.value = result.data
    }
  }
  // 定义商品基础属性列表
  const attrInfoList = ref<attrInfoResponseDataItem[]>([])
  // 获取商品基础属性列表的函数
  const getAttrInfoList = async (
    category1Id: string | number,
    category2Id: string | number,
    category3Id: string | number,
  ) => {
    // 发送请求
    const result: attrInfoResponseData = await reqAttrInfoList(
      category1Id,
      category2Id,
      category3Id,
    )
    if (result.code === 200) {
      attrInfoList.value = result.data
      return 'ok'
    }
    return Promise.reject(new Error('获取商品基础属性列表失败'))
  }
  // 定义新增或者修改商品基础属性的函数
  const addOrUpdateAttrInfo = async (attr: attrInfoResponseDataItem) => {
    // 发送请求
    const result: any = await reqAddOrUpdateAttrInfo(attr)
    if (result.code === 200) {
      return 'ok'
    }
    return Promise.reject(new Error('新增或者修改商品基础属性失败'))
  }
  // 删除商品基础属性
  const removeAttrInfo = async (attrId: string | number) => {
    const result: any = await reqRemoveAttrInfo(attrId)
    if (result.code === 200) {
      return 'ok'
    }
    return Promise.reject(new Error('删除商品基础属性失败'))
  }
  return {
    category1List,
    getCategory1List,
    category2List,
    getCategory2List,
    category3List,
    getCategory3List,
    attrInfoList,
    getAttrInfoList,
    addOrUpdateAttrInfo,
    removeAttrInfo,
  }
})
