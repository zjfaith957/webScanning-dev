<template>
  <header>
    <img alt="nav" src="../../assets/imgs/nav.png" />
  </header>
  <!-- ↓layout路由视图 -->
  <router-view />
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
header {
  width: 100%;
  height: 108px;
  background: #ffffff;
  text-align: center;
  img {
    width: 1200px;
  }
}
</style>
