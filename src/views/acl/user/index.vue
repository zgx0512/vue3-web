<template>
  <div>
    <!-- 搜索卡片 -->
    <el-card style="margin-bottom: 10px; height: 74px">
      <el-form :inline="true" class="searchForm">
        <el-form-item label="用户名: ">
          <el-input
            placeholder="请输入搜索用户名字"
            v-model="username"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="username.length === 0" @click="searchUserInfo">
            搜索
          </el-button>
          <el-button type="primary" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 数据展示卡片 -->
    <el-card>
      <!-- 按钮 -->
      <el-button type="primary" @click="openAddOrUpdateDrawer">
        添加用户
      </el-button>
      <el-button
        type="danger"
        :disabled="selectIdList.length === 0"
        @click="open"
      >
        批量删除
      </el-button>
      <!-- 数据表格 -->
      <el-table
        style="width: 100%; margin: 10px 0"
        ref="userListRef"
        border
        :data="userList"
        @selection-change="handleSelectionChange"
        :row-key="handleRowKey"
      >
        <el-table-column
          type="selection"
          width="50"
          align="center"
          :reserve-selection="true"
        />
        <el-table-column
          label="#"
          width="50"
          type="index"
          align="center"
        ></el-table-column>
        <el-table-column property="id" label="ID" width="80" align="center" />
        <el-table-column property="username" label="用户名字" width="100" />
        <el-table-column property="name" label="用户名称" width="100" />
        <el-table-column property="roleName" label="用户角色" width="100" />
        <el-table-column property="createTime" label="创建时间" width="100" />
        <el-table-column property="updateTime" label="更新时间" width="100" />
        <el-table-column label="操作" align="center">
          <template #default="{ row }">
            <el-button
              type="warning"
              size="small"
              icon="User"
              @click="openAssignRolesDrawer(row)"
            >
              分配角色
            </el-button>
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="updateUserInfo(row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              :title="`确定要删除${row.username}?`"
              width="200"
              @confirm="remove(row.id)"
            >
              <template #reference>
                <el-button type="danger" size="small" icon="Delete">
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
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
    <!-- 添加/修改用户抽屉 -->
    <el-drawer
      v-model="showAddOrUpdateDrawer"
      :title="userForm.id ? '修改用户' : '添加用户'"
      :with-header="true"
    >
      <!-- 表单 -->
      <el-form :rules="rules" :model="userForm" ref="userFormRef">
        <el-form-item label="用户姓名" prop="username">
          <el-input
            placeholder="请输入用户姓名"
            v-model="userForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input
            placeholder="请输入用户昵称"
            v-model="userForm.name"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="用户密码"
          prop="password"
          v-if="userForm.id === ''"
        >
          <el-input
            placeholder="请输入用户密码"
            v-model="userForm.password"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="showAddOrUpdateDrawer = false">取消</el-button>
          <el-button type="primary" @click="submit(userFormRef)">
            确认
          </el-button>
        </div>
      </template>
    </el-drawer>
    <!-- 分配角色抽屉 -->
    <el-drawer v-model="assignRolesDrawer" title="分配角色" :with-header="true">
      <el-form>
        <el-form-item label="用户名字">
          <el-input v-model="assignRolesUsername" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
          >
            全选
          </el-checkbox>
          <el-checkbox-group
            v-model="assignRoles"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox
              v-for="role in allRolesList"
              :key="role.id"
              :label="role.id"
            >
              {{ role.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelAssign">取消</el-button>
          <el-button type="primary" @click="submitSelectRoles">确认</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, nextTick } from 'vue'
// 引入接口函数
import {
  reqUserList,
  reqAddOrUpdateUser,
  reqBatchRemove,
  reqRemove,
  reqRolesList,
  reqAssignRole,
} from '@/api/acl/user'
// 引入ts类型
import {
  records,
  userListResponseData,
  userResponseData,
} from '@/api/acl/user/type'
// 引入自定义校验规则
import { validatePassword } from '@/utils/validate'
import { ElMessage } from 'element-plus'
// 引入lodash库, 实现深拷贝
import { cloneDeep } from 'lodash'
import { ElMessageBox } from 'element-plus'
// 当前页
let page = ref<number>(1)
// 每页条数
let limit = ref<number>(5)
// 总数
let total = ref<number>(0)
// 存储用户分页列表
let userList = ref<records>([])
// 搜索框的文字
let username = ref<string>('')
// 页面挂载完毕
onMounted(() => {
  // 调用获取用户分页列表的函数
  getUserList()
})
// 获取用户分页列表数据的函数
const getUserList = async (username?: string) => {
  // 发送获取用户分页列表的请求
  const result: userListResponseData = await reqUserList(
    page.value,
    limit.value,
    username,
  )
  if (result.code === 200) {
    // 将用户列表存储起来
    userList.value = result.data.records
    // 将总数存储起来
    total.value = result.data.total
  }
}
// 根据用户名字, 搜索用户列表数据
const searchUserInfo = () => {
  // 回到第一页
  page.value = 1
  getUserList(username.value)
}
// 重置
const reset = () => {
  // 清空文本框
  username.value = ''
  // 回到第一页
  page.value = 1
  // 重新发送请求
  getUserList(username.value)
}
// 当前页发生改变时的回调
const handleCurrentChange = () => {
  getUserList(username.value)
}
// 每页条数发生变化时的回调
const handleSizeChange = () => {
  getUserList(username.value)
}
// 控制添加/修改用户抽屉的显示与隐藏
let showAddOrUpdateDrawer = ref<boolean>(false)
// 表单对象
const userFormRef = ref()
// 点击添加用户按钮的回调
const openAddOrUpdateDrawer = () => {
  showAddOrUpdateDrawer.value = true
  nextTick(() => {
    // 将上一次的表单数据清空
    userForm.value.id = ''
    userForm.value.username = ''
    userForm.value.name = ''
    userForm.value.password = ''
    // 清空掉表单验证的警示信息
    userFormRef.value.clearValidate()
  })
}
// 添加/修改用户的表单
let userForm = ref<userResponseData>({
  id: '',
  username: '',
  name: '',
  password: '',
})
// 表单验证规则
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名字', trigger: 'blur' },
    { min: 3, message: '用户名字长度至少为3位', trigger: 'blur' },
  ],
  name: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    { min: 3, message: '用户昵称长度至少为3位', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' },
  ],
})
// 确认添加/修改
const submit = (formEl: any) => {
  if (!formEl) return
  formEl.validate(async (valid: boolean) => {
    if (valid) {
      // 表单验证通过
      // 发送添加|修改请求
      const result = await reqAddOrUpdateUser(userForm.value)
      if (result.code === 200) {
        ElMessage({
          message: userForm.value.id ? '修改成功' : '添加成功',
          type: 'success',
        })
      } else {
        ElMessage({
          message: userForm.value.id ? '修改失败' : '添加失败',
          type: 'error',
        })
      }
      // 关闭抽屉
      showAddOrUpdateDrawer.value = false
      if (userForm.value.id) {
        console.log(page.value)
        getUserList('')
      } else {
        // 调用重置按钮的回调, 重新获取表格数据
        reset()
      }
    }
  })
}
// 点击编辑按钮的回调
const updateUserInfo = (userInfo: userResponseData) => {
  // 打开抽屉
  showAddOrUpdateDrawer.value = true
  // 将要修改的用户赋值给表单
  userForm.value = cloneDeep(userInfo)
  nextTick(() => {
    // 清空掉表单验证的警示信息
    userFormRef.value.clearValidate()
  })
}
// 复选框选出来的id列表
let selectIdList = ref<number[]>([])
// 复选框发生改变时的回调
const handleSelectionChange = (selectList: any) => {
  selectIdList.value = selectList.map((item) => item.id)
  console.log(selectIdList.value)
}
const handleRowKey = (row) => {
  return row.id
}
// 用户表格对象
const userListRef = ref()
// 打开消息弹出框
const open = () => {
  ElMessageBox.confirm('确定删除这些用户?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        // 根据id列表批量删除用户
        await reqBatchRemove(selectIdList.value)
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
        // 重新加载用户表格数据
        getUserList(username.value)
        // 清空上一次复选框的状态
        userListRef.value.clearSelection()
      } catch (error) {
        ElMessage({
          type: 'error',
          message: '删除失败',
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
// 根据id删除用户
const remove = async (id) => {
  try {
    await reqRemove(id)
    // 删除成功提示
    ElMessage({
      message: '删除成功',
      type: 'success',
    })
    // 判断删除的用户是否是当前页的最后一项
    if (userList.value.length <= 1 && page.value !== 1) {
      page.value = page.value - 1
    }
    // 重新获取表格数据
    getUserList()
  } catch (error) {
    // 删除失败提示
    ElMessage({
      message: '删除失败',
      type: 'error',
    })
  }
}
// 分配角色抽屉的文本框绑定的变量
let assignRolesUsername = ref<string>('')
// 控制分配角色抽屉显示与隐藏的变量
let assignRolesDrawer = ref<boolean>(false)
const checkAll = ref<boolean>(false)
// 多选框的不确定状态
const isIndeterminate = ref<boolean>(true)
// 多选框默认选中的子选项
const assignRoles = ref<number[]>([])
// 多选框所有的子选项
const allRolesList = ref([])
// 最后分配角色发送请求所携带的参数
const roleVo = ref<{ userId: number; roleIdList: number[] }>({
  userId: 0,
  roleIdList: [],
})
// 点击分配角色按钮的回调
const openAssignRolesDrawer = async (row: userResponseData) => {
  // 打开抽屉
  assignRolesDrawer.value = true
  // 获取用户姓名
  assignRolesUsername.value = row.username
  // 将用户id保存起来
  roleVo.value.userId = row.id
  // 发送获取角色列表数据的请求
  const result = await reqRolesList(row.id)
  if (result.code === 200) {
    allRolesList.value = result.data.allRolesList
    assignRoles.value = result.data.assignRoles.map((item) => item.id)
    console.log(assignRoles.value)
  }
}
// 点击全选按钮的回调
const handleCheckAllChange = (val: boolean) => {
  assignRoles.value = val ? allRolesList.value.map((item) => item.id) : []
  isIndeterminate.value = false
}
// 点击多选框子选项按钮的回调
const handleCheckedCitiesChange = (value: number[]) => {
  assignRoles.value = value
  const checkedCount = value.length
  checkAll.value = checkedCount === allRolesList.value.length
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < allRolesList.value.length
}
// 提交选出来的角色列表
const submitSelectRoles = async () => {
  // 整合数据
  roleVo.value.roleIdList = assignRoles.value
  try {
    // 发送请求
    await reqAssignRole(roleVo.value)
    // 分配成功, 弹出成功提示框
    ElMessage({
      message: '分配角色成功',
      type: 'success',
    })
    // 关闭抽屉
    assignRolesDrawer.value = false
    // 重新获取用户表格数据
    getUserList(username.value)
  } catch (error) {
    // 分配失败
    ElMessage({
      message: '分配角色失败',
      type: 'error',
    })
  }
}
// 取消分配角色
const cancelAssign = () => {
    // 关闭抽屉
    assignRolesDrawer.value = false
    // 将数据复原
    assignRoles.value = []
}
</script>

<style lang="scss" scoped>
.searchForm {
  display: flex;
  justify-content: space-between;
}
</style>
