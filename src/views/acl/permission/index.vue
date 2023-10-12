<template>
  <!-- 菜单展示区域 -->
  <el-table
    :data="menuList"
    style="width: 100%; margin-bottom: 20px"
    row-key="id"
    border
  >
    <el-table-column prop="name" label="名称" />
    <el-table-column prop="code" label="权限名称" />
    <el-table-column prop="updateTime" label="修改时间" />
    <el-table-column label="操作">
      <template #default="{ row }">
        <el-button
          type="warning"
          icon="Plus"
          size="small"
          :disabled="row.level === 4"
          @click="openAddorUpdateDialog(row)"
        >
          {{ row.level === 3 ? '添加功能' : '添加菜单' }}
        </el-button>
        <el-button
          type="primary"
          icon="Edit"
          size="small"
          :disabled="row.level === 1"
          @click="openAddorUpdateDialog(row, 1)"
        >
          编辑
        </el-button>
        <el-popconfirm
          :title="`确定删除${row.name}?`"
          @confirm="deleteMenu(row.id)"
          width="200"
        >
          <template #reference>
            <el-button
              type="danger"
              icon="Delete"
              size="small"
              :disabled="row.level === 1"
            >
              删除
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <!-- 添加|修改菜单对话框 -->
  <el-dialog
    v-model="addOrupdateDialogVisible"
    :title="dialogTItle"
    width="50%"
  >
    <el-form
      :model="menuForm"
      :rules="rules"
      label-width="70"
      ref="menuFormRef"
    >
      <el-form-item label="名称" prop="name">
        <el-input
          :placeholder="placeholderName"
          v-model="menuForm.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="权限值" prop="code">
        <el-input
          placeholder="请输入权限名称"
          v-model="menuForm.code"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addOrupdateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, nextTick, computed } from 'vue'
// 引入接口函数
import {
  reqMenuList,
  reqAddOrUpdateMenu,
  reqRemoveMenu,
} from '@/api/acl/permission'
// 引入ts类型
import {
  menuResponseData,
  menuListResponseData,
} from '@/api/acl/permission/type'
// 引入lodash的深拷贝函数
import { cloneDeep } from 'lodash'
import { ElMessage } from 'element-plus'
let menuList = ref<menuResponseData[]>([])
// 组件挂载完毕后
onMounted(() => {
  // 调用函数
  getMenuList()
})
// 获取菜单数据的函数
const getMenuList = async () => {
  // 发送请求
  const result: menuListResponseData = await reqMenuList()
  if (result.code === 200) {
    menuList.value = result.data
  }
}
// 控制添加|修改菜单对话框显示与隐藏
const addOrupdateDialogVisible = ref<boolean>(false)
// 表单对象
const menuFormRef = ref()
// 添加|修改菜单表单
let menuForm = ref<menuResponseData>({
  id: '',
  name: '',
  code: '',
  pid: 0,
})
// 选择的菜单的level
let level = ref<number>(0)
// 计算对话框的标题
const dialogTItle = computed(() => {
  if (level.value === 3) {
    return menuForm.value.id ? '修改功能' : '添加功能'
  } else {
    return menuForm.value.id ? '修改菜单' : '添加菜单'
  }
})
// 表单名称的提示信息
let placeholderName = ref<string>('请输入菜单名称')
// 添加|修改菜单的回调
const openAddorUpdateDialog = (row: menuResponseData, num: number = 0) => {
  // 获取level
  level.value = row.level as number
  if (row.level === 3) {
    // 是三级菜单，点击的是添加功能
    placeholderName.value = '请输入功能名称'
  }
  if (num !== 0) {
    // 点击的是修改按钮
    menuForm.value = cloneDeep(row)
    console.log(menuForm.value)
  } else {
    // 点击的是添加按钮
    menuForm.value.pid = row.id as number
    nextTick(() => {
      // 将表单复原
      menuForm.value.name = ''
      menuForm.value.code = ''
      menuForm.value.id = ''
    })
  }
  // 打开对话框
  addOrupdateDialogVisible.value = true
  nextTick(() => {
    // 清空表单校验规则的提示消息
    menuFormRef.value.clearValidate()
  })
}
// 表单校验规则
const rules = reactive({
  name: [{ required: true, message: '名称不能为空！', trigger: 'blur' }],
  code: [{ required: true, message: '权限名称不能为空！', trigger: 'blur' }],
})
// 对话框确定按钮的回调
const submit = () => {
  if (!menuFormRef.value) return
  menuFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      // 表单验证通过
      try {
        // 发送请求
        await reqAddOrUpdateMenu(menuForm.value)
        // 成功的提示信息
        ElMessage({
          message: menuForm.value.id ? '修改成功' : '添加成功',
          type: 'success',
        })
        // 关闭对话框
        addOrupdateDialogVisible.value = false
        // 重新获取菜单数据
        getMenuList()
      } catch (error) {
        // 失败的提示信息
        ElMessage({
          message: menuForm.value.id ? '修改失败' : '添加成功',
          type: 'error',
        })
      }
    }
  })
}
// 删除菜单的回调
const deleteMenu = async (id: number) => {
  try {
    // 发送请求
    await reqRemoveMenu(id)
    // 成功的提示信息
    ElMessage({
      message: '删除成功',
      type: 'success',
    })
    // 重新获取菜单表格数据
    getMenuList()
  } catch (error) {
    // 失败的提示信息
    ElMessage({
      message: '删除失败',
      type: 'error',
    })
  }
}
</script>

<style lang="" scoped></style>
