<template>
  <!-- 添加|修改属性卡片 -->
  <el-card style="margin-top: 10px">
    <el-form :inline="true">
      <el-form-item label="属性名称">
        <el-input
          placeholder="请输入属性名称"
          v-model="attrInfo.attrName"
          :disabled="attrInfo.attrValueList.length > 0"
        ></el-input>
      </el-form-item>
    </el-form>
    <el-button
      type="primary"
      icon="Plus"
      :disabled="!attrInfo.attrName.length"
      @click="addAttrValue"
    >
      添加属性值
    </el-button>
    <el-table border style="margin: 10px 0" :data="attrInfo.attrValueList">
      <el-table-column
        type="index"
        label="序号"
        align="center"
        width="80"
      ></el-table-column>
      <el-table-column
        label="属性值名称"
        prop="valueName"
        ref="attrValueTableRef"
      >
        <template #default="{ row }">
          <el-input
            placeholder="请输入属性值名称"
            v-model="row.valueName"
            ref="attrValueInputRef"
            v-if="row.isEdit"
            @blur="changeInput(row)"
          ></el-input>
          <span v-else style="display: block" @click="handleClick(row)">
            {{ row.valueName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="属性值操作">
        <template #default="{ $index }">
          <el-button
            type="danger"
            icon="Delete"
            size="small"
            @click="removeAttrValueName($index)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" @click="save" :disabled="!attrInfo.attrName">
      保存
    </el-button>
    <el-button type="danger" @click="cancel">取消</el-button>
  </el-card>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
// 引入仓库
import { useAttrStore } from '@/store/modules/product/attr'
// 引入ts类型
import type {
  attrInfoResponseDataItem,
  attrValueResponseDataItem,
} from '@/api/product/attr/type'
// 创建仓库对象
const attrStore = useAttrStore()
// 接收父组件传过来的函数
const emits = defineEmits(['cancel', 'loadAttrList'])
// 接收父组件传过来的数据
const props = defineProps(['category3Id'])
// 属性对象
const attrInfo = ref<attrInfoResponseDataItem>({
  // 属性名称
  attrName: '',
  // 属性值数组
  attrValueList: [],
})
// 表格对象
const attrValueTableRef = ref()
// 属性值输入框对象
const attrValueInputRef = ref()
// 添加属性值按钮回调
const addAttrValue = () => {
  attrInfo.value?.attrValueList.push({
    valueName: '',
    isEdit: true,
  })
  nextTick(() => {
    // 最后一个输入框获得焦点
    attrValueInputRef.value.focus()
  })
}
// 文本框失去焦点的回调
const changeInput = (row: attrValueResponseDataItem) => {
  if (row.valueName.trim().length === 0) {
    // 文本框没输入值，提示用户
    ElMessage.warning('请输入属性值名称')
    return
  }
  // 文本框有值，修改isEdit的值
  row.isEdit = false
}
// 点击文本框的回调
const handleClick = (row: attrValueResponseDataItem) => {
  // 修改isEdit的值
  row.isEdit = true
  nextTick(() => {
    // 文本框获得焦点
    attrValueInputRef.value.focus()
  })
}
// 删除属性值的回调
const removeAttrValueName = (index: number) => {
  // 删除指定索引的数据
  attrInfo.value.attrValueList.splice(index, 1)
}
// 取消按钮的回调
const cancel = () => {
  // 清空数据
  attrInfo.value.attrName = ''

  emits('cancel')
}
// 保存按钮的回调
const save = async () => {
  // 去除attrValueList是否编辑的属性
  attrInfo.value.attrValueList.forEach((item) => {
    delete item.isEdit
  })
  // 整合数据
  const params = {
    attrName: attrInfo.value.attrName,
    attrValueList: attrInfo.value.attrValueList,
    categoryId: props.category3Id,
  }
  try {
    // 调用仓库的接口函数
    await attrStore.addOrUpdateAttrInfo(params)
    // 新增成功，提示用户
    ElMessage.success('新增成功')
    // 清空数据
    attrInfo.value.attrName = ''
    attrInfo.value.attrValueList = []
    // 通知父组件重新获取属性列表跟切换到属性列表卡片
    emits('loadAttrList')
  } catch (error) {
    console.log(error)
  }
}
</script>

<style scoped></style>
