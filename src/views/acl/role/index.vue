<template>
  <div>
    <!-- 搜索卡片 -->
    <el-card style="margin-bottom: 10px; height: 74px">
      <el-form :inline="true" class="roleForm">
        <el-form-item label="角色名: ">
          <el-input
            placeholder="请输入要搜索的角色名"
            v-model="roleName"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="roleName.length === 0" @click="searchRole">
            搜索
          </el-button>
          <el-button type="primary" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 角色数据展示卡片 -->
    <el-card>
      <el-button
        icon="Plus"
        type="primary"
        @click="openAddOrUpdateDialogVisible"
      >
        添加角色
      </el-button>
      <el-button
        type="danger"
        icon="Delete"
        :disabled="batchRemoveIdList.length === 0"
        @click="batchRemove"
      >
        批量删除
      </el-button>
      <el-table
        border
        style="width: 100%; margin: 10px 0"
        :data="rolesList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column
          type="index"
          label="#"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="id"
          label="ID"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="180"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间"
          width="180"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="{ row }">
            <el-button
              size="small"
              icon="User"
              type="warning"
              @click="openDrawer(row.id)"
            >
              分配权限
            </el-button>
            <el-button
              size="small"
              icon="Edit"
              type="primary"
              @click="updateRoleNameInfo(row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              :title="`确定删除${row.roleName}?`"
              width="200"
              @confirm="removeRole(row.id)"
            >
              <template #reference>
                <el-button size="small" icon="Delete" type="danger">
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="limit"
        :page-sizes="[3, 5, 10, 20]"
        :background="true"
        layout="prev, pager, next, jumper, ->, total, sizes"
        :total="total"
        @size-change="getRolesList(roleName)"
        @current-change="getRolesList(roleName)"
      />
    </el-card>
    <!-- 添加|修改角色对话框 -->
    <el-dialog
      v-model="addOrUpdateDialogVisible"
      :title="roleForm.id ? '修改角色' : '添加角色'"
      width="50%"
    >
      <el-form :model="roleForm" ref="roleFormRef" :rules="rules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            placeholder="请你输入角色名称"
            v-model="roleForm.roleName"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addOrUpdateDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitRoleInfo">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 分配权限的抽屉 -->
    <el-drawer v-model="drawer" title="分配菜单与按钮的权限">
      <el-tree
        ref="treeRef"
        :data="menuOrBtnList"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultCheckedKeys"
        :props="defaultProps"
      ></el-tree>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelClick">取消</el-button>
          <el-button type="primary" @click="confirmClick">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
// 引入组合式API
import { ref, onMounted, nextTick } from 'vue'
// 引入接口函数
import {
  reqRolesList,
  reqAddOrUpdateRoleInfo,
  reqBatchRemove,
  reqRemove,
  reqMenuList,
  menuListResponseData,
  reqAssignAcl,
} from '@/api/acl/role'
// 引入ts类型
import {
  rolesListResponseData,
  roleResponseData,
  permissionVoResponseData,
} from '@/api/acl/role/type'
// 引入自定义的用户名校验规则
import { validateRoleName } from '@/utils/validate'
import { ElMessage, ElMessageBox } from 'element-plus'
// 引入lodash的深拷贝函数
import { cloneDeep } from 'lodash'
// 当前页
let page = ref<number>(1)
// 每页条数
let limit = ref<number>(5)
// 总数
let total = ref<number>(10)
// 搜索的用户名
let roleName = ref<string>('')
// 角色表格列表
let rolesList = ref<roleResponseData[]>([])
// 组件挂载完毕
onMounted(() => {
  // 调用函数
  getRolesList()
})
// 获取角色表格数据的函数
const getRolesList = async (roleName: string = '') => {
  const result: rolesListResponseData = await reqRolesList(
    page.value,
    limit.value,
    roleName,
  )
  if (result.code === 200) {
    rolesList.value = result.data.records
    total.value = result.data.total
  }
}
// 根据角色名搜索角色
const searchRole = () => {
  page.value = 1
  getRolesList(roleName.value)
}
// 重置搜索
const reset = () => {
  page.value = 1
  roleName.value = ''
  getRolesList()
}
// 控制添加|修改角色对话框的显示与隐藏
let addOrUpdateDialogVisible = ref<boolean>(false)
// 添加|修改角色要发送给后台的数据
const roleForm = ref<roleResponseData>({
  id: '',
  roleName: '',
})
// 添加|修改角色的表单对象
const roleFormRef = ref()
// 表单验证规则
const rules = {
  roleName: [
    { required: true, message: '角色名称不能为空', trigger: 'blur' },
    { validator: validateRoleName, trigger: 'blur' },
  ],
}
// 添加角色按钮的回调
const openAddOrUpdateDialogVisible = () => {
  // 打开对话框
  addOrUpdateDialogVisible.value = true
  nextTick(() => {
    // 将form表单的数据清空
    Object.assign(roleForm.value, {
      id: '',
      roleName: '',
    })
    // 清空表单验证的提示信息
    roleFormRef.value.clearValidate()
  })
}
// 确定添加|修改角色
const submitRoleInfo = () => {
  if (!roleFormRef.value) return
  roleFormRef.value.validate(async (valid) => {
    if (valid) {
      // 判断输入的角色名是否存在于角色列表中
      const bool = rolesList.value.some(
        (item) => item.roleName === roleForm.value.roleName,
      )
      if (bool) {
        // 存在，提示用户
        ElMessage({
          message: '该角色名已经存在！',
          type: 'warning',
        })
        return
      }
      try {
        // 发送请求
        await reqAddOrUpdateRoleInfo(roleForm.value)
        // 成功的提示信息
        ElMessage({
          message: roleForm.value.id ? '修改成功' : '添加成功',
          type: 'success',
        })
        // 关闭对话框
        addOrUpdateDialogVisible.value = false
        if (roleForm.value.id) {
          // 修改角色
          getRolesList(roleName.value)
        } else {
          // 添加角色
          // 重新获取角色表格数据
          reset()
        }
      } catch (error) {
        // 失败的提示信息
        ElMessage({
          message: roleForm.value.id ? '修改失败' : '添加失败',
          type: 'error',
        })
      }
    }
  })
}
// 编辑按钮的回调
const updateRoleNameInfo = (row) => {
  // 打开对话框
  addOrUpdateDialogVisible.value = true
  roleForm.value = cloneDeep(row)
  nextTick(() => {
    // 清空表单验证的消息
    roleFormRef.value.clearValidate()
  })
}
// 批量删除存储的角色id列表
const batchRemoveIdList = ref<number[]>([])
// 多选框发生改变时的回调
const handleSelectionChange = (row) => {
  batchRemoveIdList.value = row.map((item) => item.id)
}
// 批量删除
const batchRemove = () => {
  ElMessageBox.confirm('确定要删除这些角色吗？', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        // 发送请求
        await reqBatchRemove(batchRemoveIdList.value)
        // 成功的提示信息
        ElMessage({
          message: '删除成功',
          type: 'success',
        })
        page.value = 1
        // 重新获取表格数据
        getRolesList(roleName.value)
      } catch (error) {
        // 失败的提示信息
        ElMessage({
          message: '删除失败',
          type: 'error',
        })
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })
}
// 根据id删除角色
const removeRole = async (id: number) => {
  try {
    // 发送请求
    await reqRemove(id)
    // 成功的提示信息
    ElMessage({
      message: '删除成功',
      type: 'success',
    })
    // 判断删除的是否是当前页的最后一项
    if (rolesList.length <= 1 && page.value !== 1) {
      page.value -= page.value
    }
    // 重新获取表格数据
    getRolesList(roleName.value)
  } catch (error) {
    // 失败的提示信息
    ElMessage({
      message: '删除失败',
      type: 'error',
    })
  }
}
// 控制抽屉显示与隐藏
const drawer = ref<boolean>(false)
// 树形控件展示的数据
const menuOrBtnList = ref<menuListResponseData[]>([])
// 默认选中的数组
const defaultCheckedKeys = ref<number[]>([])
// 合并要发送给后端的数据
const permissionVo = ref<permissionVoResponseData>({
  permissionIdList: [],
  roleId: '',
})
// 分配权限的回调
const openDrawer = async (id) => {
  // 打开抽屉
  drawer.value = true
  // 存储角色id
  permissionVo.value.roleId = id
  const result: menuListResponseData = await reqMenuList(id)
  if (result.code === 200) {
    menuOrBtnList.value = result.data
    recur(result.data)
  }
}
const defaultProps = {
  children: 'children',
  label: 'name',
}
// 递归函数
const recur = (arr) => {
  arr.forEach((item) => {
    if (item.children.length > 0 && item.children) {
      // 有孩子，不是叶子节点，继续递归
      recur(item.children)
    } else {
      if (item.select) {
        // 将叶子节点存入数组中
        defaultCheckedKeys.value.push(item.id)
      }
    }
  })
}
// 树形控件对象
const treeRef = ref()
// 抽屉确认按钮的回调
const confirmClick = async () => {
  // 合并所有选中和半选中的菜单节点id
  permissionVo.value.permissionIdList = [
    ...treeRef.value.getCheckedKeys(),
    ...treeRef.value.getHalfCheckedKeys(),
  ]
  try {
    // 发送请求
    await reqAssignAcl(permissionVo.value)
    // 成功的提示信息
    ElMessage({
      message: '分配成功',
      type: 'success',
    })
    // 重新获取角色表格数据
    getRolesList(roleName.value)
    // 关闭抽屉
    drawer.value = false
  } catch (error) {
    // 失败的提示信息
    ElMessage({
      message: '分配失败',
      type: 'error',
    })
  }
}
// 抽屉的取消按钮的回调
const cancelClick = () => {
  // 关闭抽屉
  drawer.value = false
}
</script>

<style lang="scss" scoped>
.roleForm {
  display: flex;
  justify-content: space-between;
}
</style>
