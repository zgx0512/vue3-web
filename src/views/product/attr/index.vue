<!--
 * @Author: zgx 2324461523@qq.com
 * @Date: 2023-10-09 14:38:17
 * @LastEditors: zgx 2324461523@qq.com
 * @LastEditTime: 2023-12-15 09:54:56
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
      @click="openAddorUpdate"
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
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            title="编辑"
            @click="openAddorUpdate(JSON.parse(JSON.stringify(row)))"
          ></el-button>
          <el-popconfirm
            :title="`确定删除${row.attrName}?`"
            @confirm="removeAttr(row.id)"
          >
            <template #reference>
              <el-button
                type="danger"
                size="small"
                icon="Delete"
                title="删除"
              ></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <!-- 添加|修改属性卡片 -->
  <addOrUpdate
    v-else
    @cancel="cancel"
    ref="addOrUpdateRef"
    :category3Id="category3Id"
    @loadAttrList="loadAttrList"
  ></addOrUpdate>
</template>

<script lang="ts" setup>
// 引入组合式api
import { nextTick, ref } from 'vue'
// 引入仓库
import { useAttrStore } from '@/store/modules/product/attr'
import addOrUpdate from './addOrUpdate.vue'
// 引入ts类型
import type { attrInfoResponseDataItem } from '@/api/product/attr/type'
import { ElMessage } from 'element-plus'
// 创建仓库对象
const attrStore = useAttrStore()
// 加载效果
const loading = ref<boolean>(false)
// tag标签的类型
const tagType = ['', 'success', 'danger']
// 控制切換添加|修改属性卡片
const showData = ref<boolean>(true)
// 添加属性按钮能否点击
const addAttrBtnDisabled = ref<boolean>(true)
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
// 添加|修改属性卡片的ref
const addOrUpdateRef = ref<typeof addOrUpdate>()
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
// 打开添加|修改属性卡片
const openAddorUpdate = (row: attrInfoResponseDataItem) => {
  // 切换显示添加|修改属性卡片
  showData.value = false
  nextTick(() => {
    // 判断是新增还是修改
    if (row.attrName) {
      // 修改
      // 调用子组件的open函数
      addOrUpdateRef.value?.open(row)
    }
  })
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
// 删除属性的回调
const removeAttr = async (id: number) => {
  try {
    // 调用仓库的接口函数
    await attrStore.removeAttrInfo(id)
    // 删除成功，提示用户
    ElMessage.success('删除成功')
    // 重新获取属性列表
    getAttrInfoList({
      category1Id: category1Id.value,
      category2Id: category2Id.value,
      category3Id: category3Id.value,
    })
  } catch (error) {
    // 删除失败，提示用户
    ElMessage.error('删除失败')
    console.log(error)
  }
}
</script>

<style lang="" scoped></style>
