<template>
  <!-- 扫描记录 -->
  <div class="scan-record">
    <div class="school-container">
      <div><span class="first">学校：</span><span class="last">深圳宝安第一实验中学</span></div>
      <div><span class="first">年级学科：</span><span class="last">高二数学</span></div>
      <div><span class="first">计划人数：</span><span class="last">123</span></div>
      <div><span class="first">已扫人数：</span><span class="last">123</span></div>
      <div><span class="first">未扫人数：</span><span class="last">321</span></div>
    </div>
    <div class="main-container">
      <div class="search-container">
        <el-radio-group v-model="radio" size="small" @change="change">
          <el-radio-button label="按班级查看"></el-radio-button>
          <el-radio-button label="按批次查看"></el-radio-button>
        </el-radio-group>
        <!-- // 表单查询 -->
        <el-form :inline="true" :model="form" class="demo-form-inline" label-width="80px" size="small" ref="formRef">
          <el-form-item label="" v-if="radio === '按班级查看'" key="0">
            <el-select v-model="form.classId">
              <el-option label="全部班级" value=""></el-option>
              <el-option
                v-for="(item, index) in classOpts"
                :label="item.label"
                :value="item.value"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" v-if="radio === '按班级查看'" style="width: 150px" key="1">
            <el-select v-model="form.scanState">
              <el-option label="全部状态" value="-1"></el-option>
              <el-option label="未扫" value="0"></el-option>
              <el-option label="已扫" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" v-if="radio === '按批次查看'" key="2">
            <el-select v-model="form.batchId">
              <el-option label="全部批次" value=""></el-option>
              <el-option v-for="(item, index) in batchOpts" :label="item" :value="item" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="form.keyword" placeholder="考号或者姓名查询" class="input-with-select">
              <template #append>
                <el-button :icon="Search" @click="onSearch"></el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
        <div>
          <el-button size="small" @click="classEv">班级概况</el-button>
          <el-button type="primary" size="small" @click="exportRecord">导出记录</el-button>
        </div>
      </div>
      <div class="table-container">
        <el-table :data="tableData" border size="small" max-height="492">
          <el-table-column type="index" width="50" align="center" />
          <el-table-column prop="className" label="班级" align="center" />
          <el-table-column prop="studentName" label="姓名" align="center" />
          <el-table-column prop="zkzh" label="考号" align="center" />
          <el-table-column label="扫描状态" align="center">
            <template #default="scope">
              <span>{{ scope.row.scanState === 1 ? '已扫' : '未扫' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="试卷状态" align="center">
            <template #default="scope">
              <span>{{ scope.row.paperState === 0 ? '无状态' : scope.row.paperState === 1 ? '正常' : '异常' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <div class="btn-container">
                <el-button size="mini" @click="lookOver(scope.$index, scope.row)">查看原卷</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          layout="total,sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 30, 50]"
          :total="total"
          v-model:currentPage="current"
          :page-size="size"
          @current-change="currentChange"
          @size-change="sizeChange"
        >
        </el-pagination>
      </div>
    </div>
  </div>
  <!-- 班级概况 -->
  <ClassDialog :visible="visible" :radio="radio" @closeDialog="closeDialog" />
  <!-- 图片预览 -->
  <ImagePreview :show="show" :imgs="imgs" :info="info" @close="close" />
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, onMounted } from 'vue'
import Api from '@/api/scan/scan-api'
import { Search } from '@element-plus/icons'
import ClassDialog from './ClassDialog.vue'
import ImagePreview from '../components/ImagePreview.vue'

const formRef = ref<null | HTMLSelectElement>(null)
const state = reactive({
  visible: false, //  班级概况弹框
  classOpts: <any[]>[], // 班级选项
  batchOpts: <any[]>[], // 批次选项
  radio: '按班级查看',
  current: 1,
  size: 10,
  total: '',
  form: {
    classId: '',
    batchId: '',
    scanState: '-1',
    keyword: '23442',
  },
  tableData: <any>[], // 记录列表数据
  imgs: <any>[], // 图片预览列表
  info: <any>{}, // 图片预览列表
  show: false, // 图片预览显示隐藏
})
const { visible, radio, current, size, total, form, tableData, imgs, info, show, classOpts, batchOpts } = toRefs(state)

// 获取数据
onMounted(async () => {
  // 查询班级
  const classRes: any = await Api.getClass('161163262882282700009', '161163262882284200010', '1')
  classOpts.value = classRes.data
  // 查询批次
  const batchRes: any = await Api.getBatch('161163262882282700009', '161163262882284200010', '1')
  batchOpts.value = batchRes.data
  // 查询记录
  onSearch()
})

const closeDialog = () => {
  visible.value = false
}
// 查询按钮
const onSearch = async () => {
  let recordRes: any
  if (radio.value === '按班级查看') {
    let params = {
      current: current.value,
      size: size.value,
      examId: '161163262882282700009',
      paperId: '161163262882284200010',
      schoolId: '1',
      ...form.value,
    }
    recordRes = await Api.getRecordByClass(params)
  } else {
    let params = {
      current: current.value,
      size: size.value,
      examId: '161163262882282700009',
      paperId: '161163262882284200010',
      schoolId: '1',
      ...form.value,
    }
    recordRes = await Api.getRecordByBatch(params)
  }
  tableData.value = recordRes.data.records
  current.value = recordRes.data.current
  size.value = recordRes.data.size
  total.value = recordRes.data.total
}
// 班级批次切换
const change = () => {
  form.value = {
    classId: '',
    batchId: '',
    scanState: '-1',
    keyword: '',
  }
  onSearch()
}
// 导出记录
const exportRecord = async () => {
  let params = {
    current: current.value,
    size: size.value,
    examId: '161163262882282700009',
    paperId: '161163262882284200010',
    schoolId: '1',
  }
  const recordRes: any = await Api.exportRecord(params)
  const blob = new Blob([recordRes], {
    type: 'application/octet-stream',
  })
  const downName = 'test' // 下载的文件名
  if ('download' in document.createElement('a')) {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', `${downName}.xlsx`)
    document.body.appendChild(link)
    link.click()
  } else {
    const navigator: any = window.navigator
    navigator.msSaveBlob(blob, downName)
  }
}
// 查看原卷
const lookOver = async (index: any, row: any) => {
  info.value = row
  const res: any = await Api.getRecordmg('161163262882282700009', '161163262882284200010', row.zkzh)
  let arr: any = []
  res.data.map((item: any) => {
    arr.push(item.imagePath)
  })
  imgs.value = arr
  show.value = true
}
const handleDelete = (index: any, row: any) => {
  console.log(index, row)
}
const classEv = () => {
  visible.value = true
}
const close = () => {
  show.value = false
}
// 分页切换
const currentChange = (val: any) => {
  current.value = val
  onSearch()
}
const sizeChange = (val: any) => {
  size.value = val
  onSearch()
}
</script>

<style lang="scss" scoped>
.scan-record {
  box-sizing: border-box;
  padding: 0px 30px 10px;
}
.school-container {
  height: 62px;
  line-height: 62px;
  padding-right: 200px;
  display: flex;
  justify-content: space-around;
  background: #f9fbff;
  > div .first {
    font-size: 14px;
    color: #9b9b9b;
  }
  > div .last {
    font-size: 16px;
    color: #303030;
  }
}
.search-container {
  display: flex;
  justify-content: space-between;
  padding: 20px 0 0;
  .el-form.el-form--inline {
    flex: 1;
    text-align: right;
    > .el-form-item {
      &:first-of-type {
        margin-left: 150px;
        width: 150px;
      }
    }
  }
}
</style>
