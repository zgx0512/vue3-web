<template>
  <div class="basa-table">
    <!-- 表格 -->
    <div class="table-content">
      <el-table
        border
        :max-height="maxHeight"
        ref="tableRef"
        v-bind="$attrs"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="50"
          align="center"
          fixed
          v-if="props.isShowCheckedBox"
          :reserve-selection="reserveSelection"
        />
        <!-- 展示数据的插槽 -->
        <slot></slot>
      </el-table>
    </div>
    <!-- 分页器 -->
    <div class="table-pagination">
      <el-pagination
        v-model:current-page="props.page"
        v-model:page-size="props.limit"
        :page-sizes="props.pageSizes"
        :small="props.small"
        :background="true"
        layout="prev, pager, next, jumper, ->, total, sizes"
        :total="props.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, useAttrs, computed } from 'vue'
import { ElTable } from 'element-plus'
// 表格对象
const tableRef = ref<InstanceType<typeof ElTable>>()
// 表格高度
const tableHeight = ref<string>('100%')
// 最大高度
const maxHeight = computed(() => {
  return props.maxHeight || tableHeight.value
})
// 父组件传递过来且没被props接收的数据
const $attrs = useAttrs()
// props接受的数据
const props = withDefaults(
  defineProps<{
    maxHeight?: string
    isShowCheckedBox?: boolean
    page?: number
    limit?: number
    pageSizes?: number[]
    small?: boolean
    total: number
    reserveSelection?: boolean
  }>(),
  {
    isShowCheckedBox: false,
    // 当前页
    page: 1,
    // 每页条数
    limit: 5,
    // 每页条数的数组(需要是函数)
    pageSizes: () => [3, 5, 10, 20],
    // 是否使用小型分页样式
    small: false,
    reserveSelection: false,
  },
)
const emits = defineEmits(['page-change', 'size-change', 'selection-change'])
// 当前页发生变化时的回调
const handleCurrentChange = (val: number) => {
  // 调用自定义事件，传递当前页参数
  emits('page-change', val)
}
// 每页条数发生变化时的回调
const handleSizeChange = (val: number) => {
  // 调用自定义事件，传递每页条数参数
  emits('size-change', val)
}
// 清空多选框的方法
const clearSelection = () => {
  tableRef.value?.clearSelection()
}
// 多选框发生改变时的回调
const handleSelectionChange = (val: any[]) => {
  // 调用自定义事件，传递选中的行
  emits('selection-change', val)
}
// 暴露给父组件的方法跟属性
defineExpose({
  clearSelection,
})
</script>

<style scoped lang="scss">
.table-content {
  margin: 10px 0;
}
</style>
