<!--
 * @Author: zgx 2324461523@qq.com
 * @Date: 2023-10-09 14:38:17
 * @LastEditors: zgx 2324461523@qq.com
 * @LastEditTime: 2023-10-12 19:02:26
 * @FilePath: \vue3-web\src\views\product\trademark\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-card>
    <!-- 按钮 -->
    <el-button type="primary" icon="Plus" @click="addTrademark">
      添加品牌
    </el-button>
    <!-- 品牌数据展示表格 -->
    <baseTable
      :data="trademarkList"
      :page="page"
      :limit="limit"
      :total="total"
      :pageSizes="[5, 10, 20, 30]"
      :loading="loading"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
    >
      <!-- 序号 -->
      <el-table-column label="序号" type="index"></el-table-column>
      <!-- 品牌名称 -->
      <el-table-column prop="tmName" label="品牌名称"></el-table-column>
      <!-- 品牌logo -->
      <el-table-column prop="logoUrl" label="品牌LOGO">
        <template #default="{ row }">
          <el-image
            style="width: 60px; height: 60px"
            :src="row.logoUrl"
            fit="contain"
          ></el-image>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作">
        <template #default="{}">
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            title="修改品牌"
          ></el-button>
          <el-button
            type="danger"
            size="small"
            icon="Delete"
            title="删除品牌"
          ></el-button>
        </template>
      </el-table-column>
    </baseTable>
  </el-card>
  <!-- 添加|修改品牌的对话框 -->
  <el-dialog
    v-model="addOrUpdateTrademarkDialogVisible"
    title="添加品牌"
    width="50%"
  >
    <el-form
      :model="addOrUpdateTrademarkForm"
      label-width="100"
      :rules="rules"
      ref="trademarkFormRef"
    >
      <el-form-item label="品牌名称" prop="tmName">
        <el-input
          placeholder="请您输入品牌名称"
          v-model="addOrUpdateTrademarkForm.tmName"
        ></el-input>
      </el-form-item>
      <el-form-item label="品牌LOGO" prop="logoUrl">
        <el-upload
          class="avatar-uploader"
          action="api/admin/product/fileUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addOrUpdateTrademarkDialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="assign">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
// 引入接口函数
import { reqTrademarkList } from '@/api/product/trademark'
// 引入ts类型
import {
  trademarkResponseData,
  trademarkListResponseData,
} from '@/api/product/trademark/type'
// 引入组合式API
import { ref, onMounted, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
// 引入自定义校验规则
import { validatetmName } from '@/utils/validate'
// 品牌数据列表
let trademarkList = ref<trademarkResponseData[]>([])
// 当前页
let page = ref<number>(1)
// 每页条数
let limit = ref<number>(5)
// 总条数
let total = ref<number>(0)
// 是否显示加载中
let loading = ref<boolean>(false)
// 获取品牌数据列表
const getTrademarkList = async () => {
  loading.value = true
  const res: trademarkListResponseData = await reqTrademarkList(
    page.value,
    limit.value,
  )
  if (res.code === 200) {
    trademarkList.value = res.data.records
    total.value = res.data.total
    loading.value = false
  }
}
// 在挂载完成后获取品牌数据列表
onMounted(() => {
  getTrademarkList()
})
// 当前页改变的回调
const handlePageChange = (val: number) => {
  page.value = val
  getTrademarkList()
}
// 每页条数改变的回调
const handleSizeChange = (val: number) => {
  limit.value = val
  getTrademarkList()
}
// 添加|修改品牌表单
const addOrUpdateTrademarkForm = ref<trademarkResponseData>({
  id: 0,
  tmName: '',
  logoUrl: '',
})
// 添加|修改品牌表单对象
const trademarkFormRef = ref<any>()
// 添加|修改品牌的对话框是否显示
let addOrUpdateTrademarkDialogVisible = ref<boolean>(false)
// 添加品牌按钮掉回调
const addTrademark = () => {
  nextTick(() => {
    // 清空表单
    addOrUpdateTrademarkForm.value = {
      id: 0,
      tmName: '',
      logoUrl: '',
    }
    // 重置表单校验规则
    trademarkFormRef.value.clearValidate()
    // 清空图片
    imageUrl.value = ''
  })
  // 显示对话框
  addOrUpdateTrademarkDialogVisible.value = true
}
// 上传的图片
const imageUrl = ref('')
// 上传图片成功的回调
const handleAvatarSuccess = (res: any) => {
  if (res.code === 200) {
    // 图片上传成功
    imageUrl.value = res.data
  }
}
// 上传图片之前的回调
const beforeAvatarUpload = (file: any) => {
  // 给上传的图片设置限制
  if (
    file.type !== 'image/jpeg' &&
    file.type !== 'image/png' &&
    file.type !== 'image/gif' &&
    file.type !== 'image/jpg' &&
    file.type !== 'image/webp'
  ) {
    // 上传的图片格式不正确
    ElMessage.error('上传的图片格式不正确')
    return false
  } else if (file.size / 1024 / 1024 > 2) {
    // 上传的图片大小不能超过2M
    ElMessage.error('上传的图片大小不能超过2M')
    return false
  }
  return true
}
// 表单验证规则
const rules = reactive({
  tmName: [
    {
      required: true,
      message: '品牌名称不能为空',
      trigger: 'blur',
    },
    {
      validator: validatetmName,
      trigger: 'blur',
    },
  ],
  logoUrl: {
    required: true,
    message: '品牌LOGO不能为空',
    trigger: 'blur',
  },
})
// 确认添加|修改品牌
const assign = () => {}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
