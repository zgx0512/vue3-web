<!--
 * @Author: zgx 2324461523@qq.com
 * @Date: 2023-10-09 14:38:17
 * @LastEditors: zgx 2324461523@qq.com
 * @LastEditTime: 2023-11-09 19:50:54
 * @FilePath: \vue3-web\src\views\product\attr\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <!-- 商品分类 -->
  <Category></Category>
  <!-- 数据展示卡片 -->
  <el-card>
    <!-- 按钮 -->
    <el-button type="primary" icon="Plus">添加属性</el-button>
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
      <el-table-column label="操作"></el-table-column>
    </el-table>
  </el-card>
</template>

<script lang="ts" setup>
// 引入组合式api
import { ref, watch } from 'vue'
// 引入仓库
import { useAttrStore } from '@/store/modules/product/attr'
// 创建仓库对象
const attrStore = useAttrStore()
// 加载效果
const loading = ref<boolean>(false)
// tag标签的类型
const tagType = ['', 'success', 'danger']
// 监听三级分类的变化
watch(
  () => attrStore.category3Id,
  async () => {
    // 开启加载效果
    loading.value = true
    try {
      // 获取属性列表
      await attrStore.getAttrInfoList()
      // 关闭加载效果
      loading.value = false
    } catch (error) {
      console.log(error)
      loading.value = false
    }
  },
)
</script>

<style lang="" scoped></style>
