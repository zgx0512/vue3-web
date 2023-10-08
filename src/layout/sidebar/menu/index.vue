<template>
  <template v-for="menu in menuList" :key="menu.path">
    <!-- 没有子路由 -->
    <el-menu-item :index="menu.path" v-if="!menu.children && menu.meta.isShow">
      <el-icon>
        <component :is="menu.meta.icon"></component>
      </el-icon>
      <template #title>
        <span>{{ menu.meta.title }}</span>
      </template>
    </el-menu-item>
    <!-- 路由里面只有一个子路由 -->
    <template v-if="menu.children && menu.children.length === 1">
      <el-sub-menu :index="menu.path" v-if="menu.meta.isShow">
        <template v-if="menu.meta.isShow" #title>
          <el-icon>
            <component :is="menu.meta.icon"></component>
          </el-icon>
          <span>{{ menu.meta.title }}</span>
        </template>
        <el-menu-item :index="menu.children[0].path">
          <el-icon>
            <component :is="menu.children[0].meta.icon"></component>
          </el-icon>
          <template #title>
            <span>{{ menu.children[0].meta.title }}</span>
          </template>
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item v-else :index="menu.children[0].path">
        <el-icon>
          <component :is="menu.children[0].meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ menu.children[0].meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 路由里面有多个子路由 -->
    <el-sub-menu
      v-if="menu.children && menu.children.length > 1"
      :index="menu.path"
    >
      <template #title>
        <el-icon>
          <component :is="menu.meta.icon"></component>
        </el-icon>
        <span>{{ menu.meta.title }}</span>
      </template>
      <Menu :menuList="menu.children"></Menu>
    </el-sub-menu>
  </template>
</template>

<script lang="ts" setup>
defineProps(['menuList'])
</script>
<script lang="ts">
export default {
  name: 'Menu',
}
</script>

<style lang="scss" scoped></style>
