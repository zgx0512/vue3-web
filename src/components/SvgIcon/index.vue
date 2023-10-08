<template>
  <svg :style="{width, height}">
    <!-- xlink:href: 执行用哪一个图标 -->
    <!-- fill：指定svg的颜色 -->
    <use :xlink:href="`${prefix}${name}`" fill="color"></use>
  </svg>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
defineProps({
  name: String,
  width: {
    type: String,
    default: '16px'
  },
  height: {
    type: String,
    default: '16px'
  },
  color: {
    type: String,
    default: ''
  }
})
let prefix = ref<String>('#icon-')
</script>

<style lang="scss" scoped>
</style>