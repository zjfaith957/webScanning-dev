<template>
  <!-- ↓路由视图 -->
  <router-view></router-view>
</template>

<script lang="ts" setup></script>

<style>
html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  box-sizing: border-box;
  background: #f5f7fa;
  -webkit-touch-callout: none; /*系统默认菜单被禁用*/
  -webkit-user-select: none; /*webkit浏览器*/
  -khtml-user-select: none; /*早期浏览器*/
  -moz-user-select: none; /*火狐*/
  -ms-user-select: none; /*IE10*/
  user-select: none;
}
#app {
  font-family: '苹方-简', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
}
/* 分页样式修改 */
.el-pagination {
  margin-top: 8px;
  text-align: right;
}
</style>
