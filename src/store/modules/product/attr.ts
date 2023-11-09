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
} from '@/api/product/attr'
// 引入ts类型
import {
  categoryResponseData,
  categoryListResponseData,
  attrInfoResponseData,
  attrInfoResponseDataItem,
} from '@/api/product/attr/type'

export const useAttrStore = defineStore('attrStore', () => {
  // 选择的一级分类id
  const category1Id = ref<number | string>('')
  // 选择的二级分类id
  const category2Id = ref<number | string>('')
  // 选择的三级分类id
  const category3Id = ref<number | string>('')
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
  const getAttrInfoList = async () => {
    // 发送请求
    const result: attrInfoResponseData = await reqAttrInfoList(
      category1Id.value,
      category2Id.value,
      category3Id.value,
    )
    console.log(result)
    if (result.code === 200) {
      attrInfoList.value = result.data
      return 'ok'
    }
    return Promise.reject(new Error('获取商品基础属性列表失败'))
  }
  return {
    category1Id,
    category2Id,
    category3Id,
    category1List,
    getCategory1List,
    category2List,
    getCategory2List,
    category3List,
    getCategory3List,
    attrInfoList,
    getAttrInfoList,
  }
})
