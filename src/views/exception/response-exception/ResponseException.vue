<template>
  <!-- 作答区异常 -->
  <div class="response-exception">
    <!-- 左侧图片区域 -->
    <div class="left-exception">
      <div class="scan-info">
        <div class="first-info">
          <span class="first">异常原因：</span>
          <span class="second">图像存在折角或残缺</span>
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
          <div class="pending">待处理 （{{ data.length }}）</div>
          <div class="operation" v-if="operationFlag" @click="operationEv(false)">退出批量操作</div>
          <div class="operation" v-else @click="operationEv(true)">批量操作</div>
        </div>
      </div>
      <div class="list-exception">
        <div v-for="(item, index) in data" :key="index" :class="index === selectIndex ? 'active' : ''">
          <img v-if="index === selectIndex" src="../../../assets/imgs/selected.png" alt="" />
          <div class="batch" @click="getdetailsEv(item, index)">
            <span>{{ item.batchId }}</span> -<span>第{{ item.batchId }}批</span> -<span>第{{ item.batchIndex }}张</span>
          </div>
          <div v-if="operationFlag" class="checkbox"><el-checkbox v-model="item.selected" label=""></el-checkbox></div>
        </div>
      </div>
      <div class="last-right">
        <el-button class="first-btn" plain size="small" :disabled="operationFlag">试卷正常</el-button>
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

// 提示弹框事件
const dialogVisible = ref(false)
const closeDialog = () => {
  dialogVisible.value = false
}

onMounted(() => {
  getExceptionList()
})

const state = reactive({
  selectIndex: 0, //列表选中index
  operationFlag: false, // 批量操作
  data: <any[]>[], // 异常列表
  imgList: <any[]>[], // 图片列表
  current: 1,
  size: 100,
})
const { data, imgList, operationFlag, selectIndex, current, size } = toRefs(state)

// 获取异常列表
const getExceptionList = async () => {
  let params = {
    current: current.value,
    size: size.value,
    examId: '161163262882282700009',
    paperId: '161163262882284200010',
    schoolId: '1',
    exceptionState: 1,
    exceptionType: 8,
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
  const imgRes: any = await Api.getExamImg(
    '161163262882282700009',
    '161163262882284200010',
    item.studentKey,
    item.batchIndex
  )
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
// 删除考试
const delExamEv = async () => {
  console.log('data-------->', data.value)
}
const tipsEv = () => {
  dialogVisible.value = true
}
</script>

<style lang="scss" scoped>
.response-exception {
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
    > div.first-info {
      span.fist {
        color: #909090;
      }
      span.second {
        color: #303030;
      }
      span.last {
        margin-left: 20px;
        color: #ff8500;
        text-decoration: underline;
        cursor: pointer;
      }
    }
    > div.last-info {
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
      .batch {
        flex: 0 1 50%;
      }
      .checkbox {
        margin-left: 50px;
        line-height: 55px;
      }
    }
    .active {
      background: #f6fbff;
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
