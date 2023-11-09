<!--
 * @Author: zgx 2324461523@qq.com
 * @Date: 2023-10-18 14:59:43
 * @LastEditors: zgx 2324461523@qq.com
 * @LastEditTime: 2023-11-08 14:55:14
 * @FilePath: \vue3-web\src\components\Category\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select placeholder="请选择" v-model="attrStore.category1Id">
          <el-option
            :label="category1.name"
            :value="category1.id"
            v-for="category1 in attrStore.category1List"
            :key="category1.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select placeholder="请选择" v-model="attrStore.category2Id">
          <el-option
            v-for="category2 in attrStore.category2List"
            :key="category2.id"
            :label="category2.name"
            :value="category2.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select placeholder="请选择" v-model="attrStore.category3Id">
          <el-option
            v-for="category3 in attrStore.category3List"
            :key="category3.id"
            :label="category3.name"
            :value="category3.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
// 引入仓库
import { useAttrStore } from '@/store/modules/product/attr'
// 实例化仓库对象
const attrStore = useAttrStore()
// 页面挂载后执行
onMounted(() => {
  // 获取一级分类列表
  attrStore.getCategory1List()
})
// 监听一级分类id变化
watch(
  () => attrStore.category1Id,
  (newVal) => {
    // 获取二级分类列表
    attrStore.getCategory2List(newVal)
  },
)
// 监听二级分类id变化
watch(
  () => attrStore.category2Id,
  (newVal) => {
    // 获取三级分类列表
    attrStore.getCategory3List(newVal)
  },
)
</script>

<style scoped></style>
