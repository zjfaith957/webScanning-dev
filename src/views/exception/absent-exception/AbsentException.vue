<template>
  <!-- 缺考异常 -->
  <div class="absent-exception">
    <!-- 左侧区域 -->
    <div class="left-exception">
      <div class="scan-info">
        <div>
          <span class="first">异常原因：</span>
          <span class="second">缺考标记被填涂</span>
          <span class="last" @click="tipsEv">操作提示</span>
        </div>
        <!-- <div>
          <span>扫描时间：</span>
          <span>2021-12-23 12:00:00</span>
        </div> -->
      </div>
      <!-- 异常题区域 -->
      <div class="content">
        <div class="content-info" v-for="(item, index) in data" :key="index">
          <div class="stu-info">
            <div class="first-stu">{{ item.schoolName || '学校名称' }}</div>
            <div class="last-stu">
              <span>姓名：{{ item.studentName }}</span>
              <span style="margin-left: 30px">考号：{{ item.zkzh }}</span>
            </div>
          </div>
          <div class="img-info">
            <img class="qk" v-if="!item.exceptionRemark.qk" src="../../../assets/imgs/absent.png" alt="" />
            <el-image style="width: 100%; height: 200px" :src="item.imagePaths[0]" fit="fill"></el-image>
          </div>
          <div class="btn-info">
            <el-switch v-model="item.exceptionRemark.qk" inactive-text="设为非缺考"> </el-switch>
            <span>查看原卷>></span>
            <el-image
              v-if="item.imagePaths[0]"
              style="width: 70px; height: 12px"
              :src="item.imagePaths[0]"
              :preview-src-list="item.imagePaths"
              :initial-index="1"
            ></el-image>
          </div>
        </div>
      </div>
    </div>
    <!-- 右侧列表 -->
    <div class="right-list">
      <div class="first-right">
        <div class="school">学校：深圳宝安第一实验中学</div>
        <div class="batch-opt">
          <div :class="tabIndex === 1 ? 'tabActive' : ''" @click="getExceptionList(1)">
            待处理 （{{ data.length }}）
          </div>
          <div :class="tabIndex === 2 ? 'tabActive' : ''" @click="getExceptionList(2)">已处理（{{ data.length }}）</div>
        </div>
      </div>
      <div class="list-exception">
        <div v-if="data.length">
          <img src="../../../assets/imgs/selected.png" alt="" />
          <div class="batch">
            <div>【全部】</div>
            <div style="margin-right: 20px">{{ data.length }}</div>
          </div>
        </div>
      </div>
      <div class="last-right">
        <el-button plain size="small" @click="submitEv">提交本页</el-button>
      </div>
    </div>
    <!-- 提示弹框 -->
    <TipsDialog :dialogVisible="dialogVisible" @closeDialog="closeDialog" />
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, reactive, onMounted } from 'vue'
import { normalMessage, successMessage, warnMessage, errorMessage } from '@/utils/notice/message'
import Api from '@/api/scan/exception-api'
import TipsDialog from '../components/TipsDialog.vue'

const url = ref('https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg')

// 提示弹框事件
const dialogVisible = ref(false)
const closeDialog = () => {
  dialogVisible.value = false
}

onMounted(() => {
  getExceptionList(1)
})

const state = reactive({
  value: false,
  tabIndex: 1, // tab选中index
  selectIndex: 0, //列表选中index
  operationFlag: false, // 批量操作
  data: <any[]>[], // 异常列表
  imgList: <any[]>[], // 图片列表
  current: 1,
  size: 50,
})
const { value, data, imgList, tabIndex, selectIndex, current, size } = toRefs(state)

// 获取异常列表
const getExceptionList = async (type: number) => {
  tabIndex.value = type
  let params = {
    current: current.value,
    size: size.value,
    examId: '234163825709982807152',
    paperId: '234163825709984007153',
    schoolId: '196163040965860000280',
    exceptionState: type, // 1异常，2异常已处理
    exceptionType: 4, //异常类型 1:定位异常 2:考号异常 3:考号重复异常 4:缺考异常 5:主观题选做题异常 6:客观题异常 7:手阅打分异常 8:图像异常
  }
  const res: any = await Api.getExceptionOfAbsent(params)
  res.data.records.map((item: any) => {
    item.exceptionRemark = JSON.parse(item.exceptionRemark)
    item.exceptionRemark.qk = item.exceptionRemark.qk ? false : true
  })
  data.value = ref(res.data.records)
  console.log('data------->', data.value)
}

// 提交本页
const submitEv = async () => {
  let params = {
    examId: '234163825709982807152',
    paperId: '234163825709984007153',
    schoolId: '196163040965860000280',
    qks: <any[]>[],
  }
  data.value.map((item) => {
    console.log('item------->', item)
    let obj: any = {}
    obj.scanExceptionId = item.id
    obj.qk = item.exceptionRemark.qk ? 0 : 1
    params.qks.push(obj)
  })
  const res: any = await Api.submitExceptionOfAbsent(params)
  if (res.result) {
    successMessage('提交成功！')
    getExceptionList(tabIndex.value)
  }
}
const tipsEv = () => {
  dialogVisible.value = true
}
</script>

<style lang="scss" scoped>
.absent-exception {
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
    > div {
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
    > div:last-child {
      color: #909090;
    }
  }
  //content
  .content {
    min-height: 744px;
    background: #ffffff;
    box-sizing: border-box;
    margin: 20px 40px;
    padding: 32px 36px;
    display: flex;
    .content-info {
      width: 294px;
      height: 346px;
      box-sizing: border-box;
      padding: 22px;
      background: #f7f9fa;
      margin-right: 32px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .stu-info {
        > .first-stu {
          font-weight: 600;
          font-size: 16px;
          color: #000000;
        }
        > .last-stu {
          margin-top: 12px;
          font-size: 14px;
          color: #565657;
        }
      }
      .img-info {
        position: relative;
        img.qk {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 9;
          width: 80px;
          height: 66px;
        }
      }
      .btn-info {
        display: flex;
        justify-content: space-between;
        position: relative;
        > span {
          position: absolute;
          top: 0px;
          right: 0px;
          font-size: 14px;
          color: #0090ff;
          cursor: pointer;
          font-family: '中黑体';
        }
        .el-image {
          position: absolute;
          top: 4px;
          right: 6px;
          :deep(.el-image__preview) {
            opacity: 0;
          }
        }
      }
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
  max-height: 808px;
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
    overflow: auto;
    > div {
      position: relative;
      height: 50px;
      line-height: 50px;
      box-sizing: border-box;
      font-size: 14px;
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
        height: 50px;
        display: flex;
        justify-content: space-around;
        background: #f5f7fa;
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
    border-top: 1px solid #e7e7e7;
    > .el-button {
      width: 146px;
      height: 36px;
      padding: 6px;
      color: #0090ff;
    }
  }
}
</style>
