<template>
  <!-- 定位异常 -->
  <div class="position-exception">
    <!-- 左侧图片区域 -->
    <div class="left-exception">
      <div class="scan-info">
        <div class="first-info">
          <span class="first">异常原因：</span>
          <span class="second">定位信息印刷残缺或扫错答卷</span>
          <span class="last" @click="tipsEv">操作提示</span>
        </div>
        <div class="last-info">
          <span>扫描时间：</span>
          <span>2021-12-23 12:00:00</span>
        </div>
      </div>
      <!-- 图片区域 -->
      <ImgView :imgList="imgList" ref="imageRef" />
    </div>
    <!-- 右侧列表 -->
    <div class="right-list">
      <div class="first-right">
        <div class="school">学校：深圳宝安第一实验中学</div>
        <div class="batch-opt">
          <div class="pending">待处理 （{{ data.length }}）</div>
          <div class="operation" v-if="operationFlag" @click="operationEv(false)">退出批量操作</div>
          <div class="operation" v-else @click="operationEv(true)">批量操作</div>
        </div>
      </div>
      <div class="list-exception">
        <div v-for="(item, index) in data" :key="index" :class="index === selectIndex ? 'active' : ''">
          <img v-if="index === selectIndex" src="../../../assets/imgs/selected.png" alt="" />
          <div class="batch" @click="getdetailsEv(item, index)">
            <span>{{ item.batchId }}</span> -<span>第{{ item.batchIndex }}张</span>
          </div>
          <div v-if="operationFlag" class="checkbox"><el-checkbox v-model="item.selected" label=""></el-checkbox></div>
        </div>
      </div>
      <div class="last-right">
        <el-button class="first-btn" plain size="small" :disabled="operationFlag" @click="reidentification"
          >重新识别</el-button
        >
        <el-button class="last-btn" plain size="small" @click="delExamEv">删除考试</el-button>
      </div>
    </div>
    <!-- 提示弹框 -->
    <TipsDialog :dialogVisible="dialogVisible" @closeDialog="closeDialog" />
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, reactive, onMounted } from 'vue'
import Api from '@/api/scan/exception-api'
import ImgView from '../components/ImgView.vue'
import TipsDialog from '../components/TipsDialog.vue'
import { normalMessage, successMessage, warnMessage, errorMessage } from '@/utils/notice/message'

// 提示弹框事件
const dialogVisible = ref(false)
const closeDialog = () => {
  dialogVisible.value = false
}

onMounted(() => {
  getExceptionList()
})

const imageRef: any = ref('imageRef') // 获取子组件
const state = reactive({
  selectIndex: 0, //列表选中index
  repeatCheckFourPointExceptionId: '', // 异常Id
  cardImgDistinguishVo: {},
  operationFlag: false, // 批量操作
  data: <any[]>[], // 异常列表
  imgList: <any[]>[], // 图片列表
  current: 1,
  size: 100,
})
const {
  data,
  imgList,
  operationFlag,
  selectIndex,
  repeatCheckFourPointExceptionId,
  cardImgDistinguishVo,
  current,
  size,
} = toRefs(state)

// 获取异常列表
const getExceptionList = async () => {
  let params = {
    current: current.value,
    size: size.value,
    examId: '042164143783496700287',
    paperId: '042164143783498600288',
    schoolId: '196163040965860000280',
    exceptionState: 1,
    exceptionType: 1, //异常类型 1:定位异常 2:考号异常 3:考号重复异常 4:缺考异常 5:主观题选做题异常 6:客观题异常 7:手阅打分异常 8:图像异常
  }
  const res: any = await Api.getExceptionList(params)
  data.value = res.data.records
  if (res.data.records.length > 0) {
    getdetailsEv(data.value[0], 0, 'init')
  }
}

// 点击列表获取详情
const getdetailsEv = async (item: any, index: number, type?: string) => {
  if (selectIndex.value === index && type !== 'init') {
    return false
  }
  selectIndex.value = index
  repeatCheckFourPointExceptionId.value = item.id
  cardImgDistinguishVo.value = JSON.parse(item.exceptionRemark).cardImgDistinguishVo
  const imgRes: any = await Api.getExamImg(
    '042164143783496700287',
    '042164143783498600288',
    item.studentKey,
    item.batchIndex
  )
  console.log('imgRes------>', imgRes.data)
  imgList.value = imgRes.data
}
// 批量操作
const operationEv = (flag: boolean) => {
  if (flag) {
    data.value.map((item: any) => {
      item.selected = false
    })
  }
  operationFlag.value = flag
}
// 重新识别
const reidentification = async () => {
  console.log('totalRect-------->', imageRef.value.totalRect)
  let arr: any = []
  imageRef.value.totalRect.map((val: any) => {
    let obj = {
      x: val.beforex,
      y: val.beforey,
      width: val.rectW,
      height: val.rectH,
      area: val.rectW * val.rectH,
      positionTag: val.positionTag,
    }
    arr.push(obj)
  })
  let params = {
    ...cardImgDistinguishVo.value,
    examId: '042164143783496700287',
    paperId: '042164143783498600288',
    schoolId: '196163040965860000280',
    repeatCheckFourPointExceptionId: repeatCheckFourPointExceptionId.value,
    rightPositions: arr,
  }
  const res: any = await Api.reidentification(params)
  if (res.result) {
    successMessage('提交成功！')
  }
}
// 删除考试
const delExamEv = async () => {
  let arr = []
  if (operationFlag.value) {
    data.value.map((val) => {
      if (val.selected) {
        arr.push(val.id)
      }
    })
  } else {
    arr.push(repeatCheckFourPointExceptionId.value)
  }
  let params = {
    examId: '042164143783496700287',
    paperId: '042164143783498600288',
    schoolId: '196163040965860000280',
    ids: arr,
  }
  console.log('params----->', params)
  const res: any = await Api.delExamOfException(params)
  if (res.result) {
    successMessage('删除成功')
    getExceptionList()
  }
}
const tipsEv = () => {
  dialogVisible.value = true
}
</script>

<style lang="scss" scoped>
.position-exception {
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
  > .first-right {
    box-sizing: border-box;
    height: 90px;
    padding: 20px 20px 10px;
    font-size: 14px;
    .school {
      color: #606266;
    }
    .batch-opt {
      margin-top: 20px;
      color: #303030;
      display: flex;
      justify-content: space-between;
      .operation {
        margin-right: 50px;
        cursor: pointer;
      }
    }
  }
  .list-exception {
    flex: 1;
    padding: 10px 20px;
    border-top: 1px solid #e7e7e7;
    border-bottom: 1px solid #e7e7e7;
    max-height: 600px;
    overflow: auto;
    > div {
      position: relative;
      height: 50px;
      padding: 0px 30px;
      line-height: 50px;
      font-size: 14px;
      color: #303030;
      display: flex;
      cursor: pointer;
      img {
        position: absolute;
        width: 8px;
        height: 12px;
        left: 0;
        top: 20px;
      }
      .checkbox {
        margin-left: 50px;
        line-height: 55px;
      }
    }
    .active {
      background: #f5f7fa;
    }
  }
  > .last-right {
    box-sizing: border-box;
    height: 68px;
    line-height: 68px;
    text-align: center;
    font-size: 14px;
    > .el-button {
      width: 146px;
      height: 36px;
      padding: 6px;
      &.first-btn {
        color: #0090ff;
      }
      &.last-btn {
        color: #f45554;
      }
    }
  }
}
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
