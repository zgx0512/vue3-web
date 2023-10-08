<template>
  <div class="common-layout">
    <el-container class="container">
      <el-aside class="sidebar" :class="{ miniSidebar: sidebarWidth }">
        <!-- 侧边栏区域 -->
        <Sidebar></Sidebar>
      </el-aside>
      <el-container>
        <el-header class="tabtar">
          <!-- 顶部区域 -->
          <Tabbar></Tabbar>
        </el-header>
        <el-scrollbar class="scrollbar">
          <el-main class="main">
            <!-- 内容区域 -->
            <Main></Main>
          </el-main>
        </el-scrollbar>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
// 引入子组件
import Main from './main/index.vue'
import Sidebar from './sidebar/index.vue'
import Tabbar from './tabbar/index.vue'
// 引入组合式API
import { ref } from 'vue'
// 引入$bus对象
import $bus from '@/bus'
// 控制侧边栏的宽度的变化
let sidebarWidth = ref<boolean>(false)
// 接收tabbar组件传递过来的数据
$bus.on('getMenuStatus', (status) => {
  sidebarWidth.value = status as boolean
})
</script>

<style lang="scss" scoped>
.common-layout {
  height: 100vh;
  .container {
    height: 100%;
    .sidebar {
      width: $max_sidebar_width;
      transition: width 0.5s; // 过渡效果
      background-color: #324158;
    }
    .miniSidebar {
      width: $min_sidebar_width;
      transition: width 0.5s; // 过渡效果
      overflow: hidden;
    }
    .tabtar {
      display: fixed;
      top: 0;
      left: 0;
      height: $tabbar_height;
      padding-right: 0;
    }
    .scrollbar {
      height: calc(100vh - $tabbar_height);
    }
  }
}
</style>
