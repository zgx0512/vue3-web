<template>
  <div class="tabbar">
    <!-- 顶部栏左边 -->
    <div class="left" style="cursor: pointer">
      <!-- 侧边菜单展示/隐藏的图标 -->
      <el-icon @click="handleMenuShow">
        <Expand v-if="!isShowMenu" />
        <Fold v-else></Fold>
      </el-icon>
      <!-- 菜单面包屑 -->
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item
          :to="breadcrumb.path"
          v-for="breadcrumb in breadcrumbList"
          :key="breadcrumb.path"
          v-show="breadcrumb.title"
          class="breadcrumb-item"
        >
          <el-icon class="breadcrumb-icon">
            <component :is="breadcrumb.icon"></component>
          </el-icon>
          {{ breadcrumb.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 顶部栏右边 -->
    <div class="right">
      <!-- 刷新按钮 -->
      <el-button icon="Refresh" circle size="small" @click="refresh"></el-button>
      <!-- 全屏 -->
      <el-button
        icon="FullScreen"
        circle
        size="small"
        @click="toggleFullScreen"
      ></el-button>
      <!-- 设置 -->
      <el-button icon="Setting" circle size="small"></el-button>
      <!-- 头像 -->
      <img :src="userInfo.avatar" class="avatar" />
      <!-- 名称 -->
      <el-dropdown>
        <span class="el-dropdown-link">
          {{ userInfo.name }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// 引入user仓库
import { useUserStore } from '@/store/modules/user'
// 引入$bus对象
import $bus from '@/bus'
// 实例化仓库对象
const userStore = useUserStore()
// 解构对象
const { userInfo } = userStore
const isShowMenu = ref<boolean>(false)
// 创建当前的路由对象
const route = useRoute()
// 实例化路由对象
const router = useRouter()
// 面包屑列表
let breadcrumbList = ref<any[]>([])
// 监听路由的变化
watch(
  route,
  (newVal) => {
    breadcrumbList.value = newVal.matched.map((item) => {
      if (item.meta.title) {
        return {
          path: item.path,
          title: item.meta.title,
          icon: item.meta.icon,
        }
      }
      return ''
    })
  },
  { immediate: true },
)
// 退出登录业务
const logout = async () => {
  try {
    await userStore.logout()
    // 退出登录成功, 回到登录页
    router.push('/login')
  } catch (error) {
    console.log(error)
  }
}
// 点击控制菜单的显示与隐藏
const handleMenuShow = () => {
  isShowMenu.value = !isShowMenu.value
  // 将控制菜单显示与隐藏的值传递出去
  $bus.emit('getMenuStatus', isShowMenu.value)
}
// 窗口是否处于全屏的判断条件
let isFullScreen = ref<boolean>(false)
// 实现网页全屏
const toggleFullScreen = () => {
  if (!isFullScreen.value) {
    const elem = document.documentElement
    // 不是处于全屏, 点击按钮, 变成全屏
    elem.requestFullscreen() // 全屏模式
  } else {
    if (document.fullscreenElement !== null) {
      // 从F11进入的全屏特殊, 只能按F11退出全屏(点击按钮跟esc键都无效)
      document.exitFullscreen()
    }
  }
}
// 窗口大小发生改变的回调
window.addEventListener('resize', () => {
  // 每次窗口大小发生改变, 都要取反一次
  isFullScreen.value = !isFullScreen.value
})
// 点击刷新按钮, 刷新页面
const refresh = () => {
  window.location.reload()
}
</script>

<style lang="scss" scoped>
.tabbar {
  display: flex; // 弹性布局
  justify-content: space-between; // 两端布局
  align-items: center; // 垂直居中
  height: 100%; // 高度跟父亲同高
  .left {
    display: flex;
    .breadcrumb {
      margin-left: 10px;
      .breadcrumb-icon {
        vertical-align: bottom; // 图标跟文字底部对齐
      }
    }
  }
  .right {
    display: flex;
    align-items: center;
    .avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      margin: 0 10px;
    }
  }
}
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
