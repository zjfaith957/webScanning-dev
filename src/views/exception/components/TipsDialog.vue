<template>
  <el-dialog v-model="dialogVisible" title="操作提示" width="30%" style="font-size: 14px; color: #303030">
    <div>1、若答卷有效信息（定位区、考号区、作答区等）均完整,请点击“图像完整”，图像将自动进入下一个识别环节。</div>
    <div>2、若答卷有效信息不完整，请参考批次信息找到纸质答卷，重新扫描后，针对该图像请点击“删除答卷”。</div>
    <div>3、若误删除，可从回收站还原。</div>
    <div>4、若大量异常均属于同一类问题，请选择“批量操作”。</div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="closeDialog">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
// 声明props
const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false,
  },
})
// 声明事件
const emit = defineEmits(['closeDialog'])
const closeDialog = () => {
  emit('closeDialog')
}
</script>

<style lang="scss" scoped>
// 处理弹框样式
:deep(.el-dialog__body) {
  padding: 10px 20px;
  > div {
    font-size: 14px;
    color: #303030;
    line-height: 1.8;
  }
}
</style>
