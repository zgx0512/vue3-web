<template>
  <div class="login_box">
    <div class="form_box">
      <h1>Hello</h1>
      <p>欢迎来到后台管理平台</p>
      <el-form :model="loginInfo" :rules="loginRules" ref="loginForm">
        <el-form-item prop="username">
          <el-input
            placeholder="请输入用户名"
            v-model="loginInfo.username"
            prefix-icon="User"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            v-model="loginInfo.password"
            prefix-icon="Lock"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            style="width: 100%"
            color="#d94841"
            @click="login"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
// 引入user仓库
import { useUserStore } from '@/store/modules/user'
import { ElMessage } from 'element-plus'
// 引入路由
import { useRouter } from 'vue-router'
// 引入自定义校验规则
import { validatePassword } from '@/utils/validate'
// 存储用户登录信息
let loginInfo = ref({
  username: 'admin',
  password: 'atguigu123',
})
// 获取el-form组件
const loginForm = ref()
// 登录表单校验规则
let loginRules = reactive({
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { min: 5, message: '用户名长度至少为5位', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' },
  ],
})
// 实例化仓库
const userStore = useUserStore()
// 实例化路由对象
const router = useRouter()
// 登录业务
const login = async () => {
  // 如果表单校验规则不通过，不执行后面的代码
  await loginForm.value.validate()
  try {
    // 调用仓库的方法，发送登录请求
    await userStore.login(loginInfo.value)
    // 登录成功，弹出提示框
    ElMessage({
      message: '登录成功',
      type: 'success',
    })
    // 获取用户信息
    await userStore.getUserInfo()
    // 跳转到首页
    router.push('/home')
  } catch (error) {
    // 登录失败，弹出提示框
    ElMessage({
      message: '登录失败',
      type: 'error',
    })
  }
}
</script>

<style lang="scss" scoped>
.login_box {
  position: relative;
  width: 100%;
  height: 100vh;
  background: url('../../assets/images/login_bg.jpg') no-repeat;
  background-size: 100% 100%;
  overflow: hidden;

  .form_box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 508px;
    height: 330px;
    padding: 40px;
    background-color: rgba($color: #000000, $alpha: 0.3);
    color: #fff;
    border-radius: 5%;

    h1 {
      font-size: 40px;
    }

    p {
      margin: 15px 0;
      font-size: 20px;
    }
  }
}
</style>
