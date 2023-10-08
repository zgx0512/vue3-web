<template>
  <div>
    <!-- logo区域 -->
    <div class="logo">
      <img src="../../assets/images/logo.jpg" alt="" class="logoImg" />
      <p>后台管理平台</p>
    </div>
    <!-- 侧边菜单区域 -->
    <!-- 
      unique-opened: 是否只保持一个子菜单的展开
      default-active: 菜单加载时默认激活的index
     -->
    <el-scrollbar class="scrollbar">
      <el-menu
        router
        background-color="#324158"
        text-color="#fff"
        class="menu el-menu-vertical-demo"
        :default-active="route.path"
        :collapse="collapse"
      >
        <Menu :menuList="menuList"></Menu>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
// 引入菜单组件
import Menu from './menu/index.vue'
// 引入路由
import { useRouter, useRoute } from 'vue-router'
// 引入$bus对象
import $bus from '@/bus'
// 引入组合式API
import { ref } from 'vue'
// 创建路由对象
const router = useRouter()
// 获取当前页面的路由
const route = useRoute()
// 存储全部的路由信息
// router.options.routes 获取全部的路由
const menuList: any = router.options.routes
// 控制侧边栏菜单的显示与隐藏
let collapse = ref<boolean>(false)
// 接收顶部组件传递过来的值
$bus.on('getMenuStatus', (status) => {
  collapse.value = status as boolean
})
</script>

<style lang="scss" scoped>
.logo {
  display: flex;
  align-items: center;
  height: 50px;
  .logoImg {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin: 0 10px;
  }
  p {
    height: 50px;
    line-height: 50px;
    color: #fff;
    font-family: 'SimSun';
    font-size: 22px;
    font-weight: 700;
    overflow: hidden;
  }
}
.scrollbar {
  height: calc(100vh - 50px);
  .menu {
    border: 0 !important;
  }
}
</style>
