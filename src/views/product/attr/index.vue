<!--
 * @Author: zgx 2324461523@qq.com
 * @Date: 2023-10-09 14:38:17
 * @LastEditors: zgx 2324461523@qq.com
 * @LastEditTime: 2023-11-27 19:33:04
 * @FilePath: \vue3-web\src\views\product\attr\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <!-- 商品分类 -->
  <Category
    :isShow="showData"
    @getCategoryIdList="getCategoryIdList"
  ></Category>
  <!-- 数据展示卡片 -->
  <el-card v-if="showData" style="margin-top: 10px">
    <!-- 按钮 -->
    <el-button
      type="primary"
      icon="Plus"
      :disabled="addAttrBtnDisabled"
      @click="showData = false"
    >
      添加属性
    </el-button>
    <!-- 表格 -->
    <el-table
      :data="attrStore.attrInfoList"
      border
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column prop="attrName" label="属性名称" width="180" />
      <el-table-column prop="attrValueList" label="属性值名称">
        <template #default="{ row }">
          <el-tag
            v-for="(item, index) in row.attrValueList"
            :key="item.id"
            style="margin-right: 10px"
            :type="tagType[index]"
          >
            {{ item.valueName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{}">
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            title="编辑"
          ></el-button>
          <el-button
            type="danger"
            size="small"
            icon="Delete"
            title="删除"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <!-- 添加|修改属性卡片 -->
  <addOrUpdate
    v-else
    @cancel="cancel"
    :category3Id="category3Id"
    @loadAttrList="loadAttrList"
  ></addOrUpdate>
</template>

<script lang="ts" setup>
// 引入组合式api
import { ref } from 'vue'
// 引入仓库
import { useAttrStore } from '@/store/modules/product/attr'
import addOrUpdate from './addOrUpdate.vue'
// 创建仓库对象
const attrStore = useAttrStore()
// 加载效果
const loading = ref<boolean>(false)
// tag标签的类型
const tagType = ['', 'success', 'danger']
// 控制切換添加|修改属性卡片
const showData = ref<boolean>(true)
// 添加属性按钮能否点击
const addAttrBtnDisabled = ref<boolean>(false)
// 一级分类id
const category1Id = ref<number | string>('')
// 二级分类id
const category2Id = ref<number | string>('')
// 三级分类id
const category3Id = ref<number | string>('')
// 分类id的ts类型
interface categoryId {
  category1Id: number | string
  category2Id: number | string
  category3Id: number | string
}
// 获取分类id列表，发起获取属性列表的请求
const getCategoryIdList = async (params: categoryId) => {
  if (params.category3Id) {
    category1Id.value = params.category1Id
    category2Id.value = params.category2Id
    // 存储三级分类id
    category3Id.value = params.category3Id
    // 获取属性列表
    getAttrInfoList(params)
    // 有三级分类id，可以点击
    addAttrBtnDisabled.value = false
  } else {
    // 没有三级分类id，不能点击
    addAttrBtnDisabled.value = true
    // 清空属性列表
    attrStore.attrInfoList = []
  }
}
// 获取属性列表的回调
const getAttrInfoList = async (params: categoryId) => {
  // 开启加载效果
  loading.value = true
  // 有三级分类id, 才发送请求
  try {
    // 获取属性列表
    await attrStore.getAttrInfoList(
      params.category1Id,
      params.category2Id,
      params.category3Id,
    )
    // 关闭加载效果
    loading.value = false
  } catch (error) {
    console.log(error)
    loading.value = false
  }
}
const loadAttrList = () => {
  // 切换显示属性列表卡片
  showData.value = true
  // 重新获取属性列表
  getAttrInfoList({
    category1Id: category1Id.value,
    category2Id: category2Id.value,
    category3Id: category3Id.value,
  })
}
// 取消按钮的回调
const cancel = () => {
  // 切换显示添加|修改属性卡片
  showData.value = true
}
</script>

<style lang="" scoped></style>
