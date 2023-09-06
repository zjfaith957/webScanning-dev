<template>
  <div class="container">
    <div class="subNav">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">考试列表</el-breadcrumb-item>
        <el-breadcrumb-item>高三期中考试</el-breadcrumb-item>
        <el-breadcrumb-item>语文</el-breadcrumb-item>
        <el-breadcrumb-item>扫描答题卡</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="goBack">返回</div>
    </div>
    <div class="main-container">
      <el-tabs v-model="activeName">
        <el-tab-pane label="扫描答卷" name="scanPaper">
          <ScanPaper v-if="isRouterAlive" @refresh="refresh" />
        </el-tab-pane>
        <el-tab-pane label="扫描纪录" name="scanRecord">
          <ScanRecord v-if="activeName === 'scanRecord'" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import ScanPaper from './scan-paper/ScanPaper.vue'
import ScanRecord from './scan-record/ScanRecord.vue'

const activeName = ref('scanPaper')
const isRouterAlive = ref(true)
const refresh = () => {
  isRouterAlive.value = false
  nextTick(() => {
    isRouterAlive.value = true
  })
}
</script>

<style lang="scss" scoped>
.container {
  width: 1200px;
  height: 770px;
  margin: 0 auto;
  .subNav {
    display: flex;
    justify-content: space-between;
    height: 48px;
    line-height: 48px;
    font-size: 14px;
    color: #555657;
  }
  .el-breadcrumb {
    height: 48px;
    line-height: 48px;
    font-size: 14px;
    color: #555657;
  }
  .goBack {
    margin-right: 12px;
    cursor: pointer;
  }
}
.main-container {
  // height: 720px;
  background: #ffffff;
  border-radius: 5px;
  :deep(.el-tabs__header) {
    height: 64px;
    line-height: 64px;
    .el-tabs__nav {
      padding: 0 20px;
    }
    .el-tabs__nav > .el-tabs__item {
      font-size: 18px;
      font-weight: 600;
    }
  }
}
</style>
