<template>
  <!-- 图片预览录 -->
  <div class="image-preview" v-if="show">
    <!-- 预览原卷 -->
    <el-image-viewer @close="close" @switch="switchImg" :initial-index="pageIndex" :url-list="imgs" ref="imageRef" />
    <!-- 学生信息、分页拓展 -->
    <div class="stu-info">
      <div>姓名：{{ info.studentName }}</div>
      <div>班级：{{ info.gradeName }}（{{ info.className }}）</div>
      <div>考号：{{ info.zkzh }}</div>
    </div>
    <div class="page-container">
      <el-button
        v-for="(item, index) in imgs"
        :type="index === pageIndex ? 'primary' : ''"
        size="mini"
        @click="pageChange(index)"
        >第{{ index + 1 }}页</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs } from 'vue'
import ElImageViewer from 'element-plus/lib/components/image-viewer/index'

// 声明props
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  imgs: {
    type: <any>Array,
    required: true,
  },
  info: {
    type: <any>Object,
    required: true,
  },
})
// 声明事件
const emit = defineEmits(['close'])

const pageIndex = ref(0)
const imageRef: any = ref('imageRef')

const switchImg = (val: number) => {
  pageIndex.value = val
}
const close = () => {
  emit('close')
}
// 分页切换
const pageChange = (index: any) => {
  if (pageIndex.value === index) {
    return false
  }
  imageRef.value.index = index
}
</script>

<style lang="scss" scoped>
:deep(.el-image-viewer__wrapper > .el-image-viewer__actions) {
  display: none;
}
.image-preview {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
}
.stu-info {
  position: absolute;
  left: 50%;
  top: 50%;
  opacity: 0.4;
  background: #000;
  transform: translate(-50%, -50%);
  font-size: 14px;
  color: #fff;
  padding: 16px 36px;
  line-height: 2;
  z-index: 3000;
}
.page-container {
  position: absolute;
  left: 50%;
  top: 90%;
  transform: translate(-50%, -50%);
  z-index: 3000;
}
</style>
