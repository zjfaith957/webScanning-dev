<template>
  <!-- 考号异常/考号重复 -->
  <div class="candidate-exception">
    <!-- 左侧图片区域 -->
    <div class="left-exception">
      <div class="scan-info">
        <div class="first-info">
          <span class="first">异常原因：</span>
          <span class="second">在考生计划列表内或无法识别考号</span>
          <span class="last" @click="tipsEv">操作提示</span>
        </div>
        <div class="last-info">
          <span>扫描时间：</span>
          <span>2021-12-23 12:00:00</span>
        </div>
      </div>
      <!-- 图片区域 -->
      <ImgView :imgList="imgList" />
    </div>
    <!-- 右侧列表 -->
    <div class="right-list">
      <div class="first-right">
        <div class="school">学校：深圳宝安第一实验中学</div>
        <div class="batch-opt">
          <div class="first-opt" :class="tabIndex === 1 ? 'tabActive' : ''" @click="getExceptionList(1)">
            待处理 （{{ data.length }}）
          </div>
          <div :class="tabIndex === 2 ? 'tabActive' : ''" @click="getExceptionList(2)">已处理（{{ data.length }}）</div>
        </div>
      </div>
      <div class="list-exception">
        <div v-for="(item, index) in data" :key="index" :class="index === selectIndex ? 'active' : ''">
          <img v-if="index === selectIndex" src="../../../assets/imgs/selected.png" alt="" />
          <div class="batch" @click="getdetailsEv(item, index)">
            <div class="first-bat">
              <span>{{ item.batchId }}</span> -<span>第{{ item.batchId }}批</span> -<span
                >第{{ item.batchIndex }}张</span
              >
            </div>
            <div class="last-bat">
              <span>{{ item.zkzh }}</span
              ><span style="margin-left: 15px">{{ item.studentName }}</span>
            </div>
          </div>
          <!-- <div v-if="operationFlag" class="checkbox"><el-checkbox v-model="item.selected" label=""></el-checkbox></div> -->
        </div>
      </div>
      <div class="search-container" :class="studentInfo.studentName ? 'search-active' : ''">
        <el-input v-model="zkzh" placeholder="考号查询" class="input-with-select" clearable>
          <template #append>
            <el-button :icon="Search" type="primary" @click="onSearch"></el-button>
          </template>
        </el-input>
        <div class="stu-in" v-if="studentInfo.studentName">
          <div class="first-stu">
            <span>{{ studentInfo.studentName }}</span
            ><span>{{ studentInfo.zkzh }}</span>
          </div>
          <div class="second-stu">{{ studentInfo.gradeName }} {{ studentInfo.className }}</div>
          <div class="last-stu"><el-button type="primary" size="mini" @click="submitEv">确认</el-button></div>
        </div>
      </div>
      <div class="last-right">
        <el-button plain size="small" @click="delExamEv">删除考试</el-button>
      </div>
    </div>
    <!-- 提示弹框 -->
    <TipsDialog :dialogVisible="dialogVisible" @closeDialog="closeDialog" />
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, reactive, onMounted } from 'vue'
import { normalMessage, successMessage, warnMessage, errorMessage } from '@/utils/notice/message'
import { Search } from '@element-plus/icons'
import Api from '@/api/scan/exception-api'
import ImgView from '../components/ImgView.vue'
import TipsDialog from '../components/TipsDialog.vue'

const props = defineProps({
  exceptionType: {
    type: Number,
    required: true,
  },
})

// 提示弹框事件
const dialogVisible = ref(false)
const closeDialog = () => {
  dialogVisible.value = false
}

onMounted(() => {
  getExceptionList(1)
})

const state = reactive({
  tabIndex: 1, // tab选中index
  selectIndex: 0, //列表选中index
  selectId: '', //列表选中index
  // operationFlag: false, // 批量操作
  data: <any[]>[], // 异常列表
  imgList: <any[]>[], // 图片列表
  zkzh: '', // 考号查询
  studentInfo: <any>{},
  current: 1,
  size: 50,
})
const { data, imgList, tabIndex, selectIndex, selectId, zkzh, studentInfo, current, size } = toRefs(state)

// 获取异常列表
const getExceptionList = async (type: number) => {
  tabIndex.value = type
  let params = {
    current: current.value,
    size: size.value,
    examId: '161163262882282700009',
    paperId: '161163262882284200010',
    schoolId: '1',
    exceptionState: type, // 1异常，2异常已处理
    exceptionType: props.exceptionType, //异常类型 1:定位异常 2:考号异常 3:考号重复异常 4:缺考异常 5:主观题选做题异常 6:客观题异常 7:手阅打分异常 8:图像异常
  }
  const res: any = await Api.getExceptionList(params)
  data.value = res.data.records
  if (res.data.records.length > 0) {
    getdetailsEv(data.value[0], 0, 'init')
  }
}

// 点击列表获取详情
const getdetailsEv = async (item: any, index: number, type?: string) => {
  selectId.value = item.id
  if (selectIndex.value === index && type !== 'init') {
    return false
  }
  selectIndex.value = index
  const imgRes: any = await Api.getExamImg(
    '161163262882282700009',
    '161163262882284200010',
    item.studentKey,
    item.batchIndex
  )
  imgList.value = imgRes.data
}

// 查询考生信息
const onSearch = async () => {
  if (!zkzh.value) return errorMessage('请输入准考证号')
  const stuRes: any = await Api.getStudentInfo('161163262882282700009', '161163262882284200010', '1', zkzh.value)
  studentInfo.value = stuRes.data
}
// 确认考生信息
const submitEv = async () => {
  let scanExceptionId
  data.value.map((item) => {
    if (item.zkzh === zkzh.value) {
      scanExceptionId = item.id
    }
  })
  let params: any = {
    examId: '161163262882282700009',
    paperId: '161163262882284200010',
    schoolId: '1',
    scanExceptionId: scanExceptionId,
    id: studentInfo.value.id,
  }
  const res: any = await Api.submitZkzh(params)
  if (res.result) {
    successMessage('确认成功！')
  }
}
// 删除考试
const delExamEv = async () => {
  let params: any = {
    examId: '161163262882282700009',
    paperId: '161163262882284200010',
    schoolId: '1',
    ids: [selectId.value],
  }
  const res: any = await Api.delExam(params)
  if (res.result) {
    successMessage('删除成功！')
    getExceptionList(tabIndex.value)
  }
}
const tipsEv = () => {
  dialogVisible.value = true
}
</script>

<style lang="scss" scoped>
.candidate-exception {
  display: flex;
}
.left-exception {
  flex: 0 0 75%;
  .scan-info {
    display: flex;
    justify-content: space-between;
    background: #fcfcfc;
    padding: 12px 20px;
    font-size: 14px;
    > .first-info {
      .first {
        color: #909090;
      }
      .second {
        color: #303030;
      }
      .last {
        margin-left: 20px;
        color: #ff8500;
        text-decoration: underline;
        cursor: pointer;
      }
    }
    > .last-info {
      color: #909090;
    }
  }
}
//
.right-list {
  flex: 0 0 25%;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-height: 788px;
  > .first-right {
    box-sizing: border-box;
    height: 90px;
    padding: 20px 20px 0px;
    font-size: 14px;
    .school {
      color: #606266;
    }
    .batch-opt {
      margin-top: 20px;
      color: #303030;
      display: flex;
      justify-content: space-between;
      height: 31px;
      cursor: pointer;
      > div {
        padding: 0 5px 0 10px;
      }
      > div:last-child {
        margin-right: 50px;
        cursor: pointer;
      }
      > .tabActive {
        color: #0090ff;
        border-bottom: 1px solid #0090ff;
      }
    }
  }
  .list-exception {
    flex: 1;
    padding: 10px 20px;
    border-top: 1px solid #e7e7e7;
    border-bottom: 1px solid #e7e7e7;
    overflow: auto;
    > div {
      position: relative;
      height: 70px;
      padding: 15px 30px;
      box-sizing: border-box;
      font-size: 14px;
      color: #909090;
      cursor: pointer;
      img {
        position: absolute;
        width: 8px;
        height: 12px;
        left: 0;
        top: 30px;
      }
      .batch {
        flex: 0 1 50%;
        > .last-bat {
          margin-top: 4px;
          font-size: 14px;
          color: #303030;
          font-weight: 600;
        }
      }
    }
    .active {
      background: #f6fbff;
    }
  }
  //搜索框样式
  .search-container {
    margin: 0 20px 10px;
    padding: 10px 20px;
    border-radius: 10px;
    font-size: 14px;
    .stu-in {
      > .first-stu {
        padding: 15px 0 5px;
        span {
          margin-right: 20px;
        }
      }
      > .second-stu {
        color: #909090;
      }
      > .last-stu {
        text-align: right;
        padding: 10px 5px 0;
      }
    }
  }
  .search-active {
    border: 1px solid #0090ff;
  }
  > .last-right {
    box-sizing: border-box;
    height: 68px;
    line-height: 68px;
    text-align: center;
    font-size: 14px;
    border-top: 1px solid #e7e7e7;
    > .el-button {
      width: 146px;
      height: 36px;
      padding: 6px;
      color: #f45554;
    }
  }
}
</style>
