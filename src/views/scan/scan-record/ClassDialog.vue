<template>
  <div>
    <el-dialog v-model="visible" title="班级概况" top="20vh" :before-close="handleClose">
      <el-table :data="gridData" border v-if="radio === '按班级查看'">
        <el-table-column property="classId" label="班级" width="150" align="center"></el-table-column>
        <el-table-column property="planNum" label="计划人数" width="200" align="center"></el-table-column>
        <el-table-column property="scannedNum" label="已扫" align="center"></el-table-column>
      </el-table>
      <el-table :data="gridData" border v-else>
        <el-table-column property="batchId" label="扫描批次" width="150" align="center"></el-table-column>
        <el-table-column property="scanNum" label="已扫张数" width="200" align="center"></el-table-column>
        <el-table-column property="scanTime" label="扫描时间" align="center"></el-table-column>
      </el-table>
      <!-- <el-pagination
        layout="sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 30, 50]"
        :total="total"
        v-model:currentPage="current"
        :page-size="size"
        @current-change="currentChange"
        @size-change="sizeChange"
      >
      </el-pagination> -->
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, watch } from 'vue'
import Api from '@/api/scan/scan-api'

// 声明props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  radio: {
    type: String,
    default: '按班级查看',
  },
})

// 声明事件
const emit = defineEmits(['closeDialog'])
const handleClose = () => {
  emit('closeDialog')
}

const state = reactive({
  current: 1,
  size: 10,
  total: '',
  gridData: <any>[], //列表数据
})
// 使用toRefs解构
const { current, size, total, gridData } = toRefs(state)

// 监听count
watch(
  () => props.visible,
  (newVal, oldVal) => {
    if (newVal) {
      getList()
    }
  }
)

// 查询概况
const getList = async () => {
  let res
  if (props.radio === '按班级查看') {
    res = await Api.getClassOverview('161163262882282700009', '161163262882284200010', '1')
  } else {
    res = await Api.getBatchOverview('161163262882282700009', '161163262882284200010', '1')
  }
  gridData.value = res.data
}

const currentChange = (val: any) => {
  console.log(`current page: ${val}`)
}
const sizeChange = (val: any) => {
  console.log(`${val} items per page`)
}
</script>
<style lang="scss" scoped></style>
