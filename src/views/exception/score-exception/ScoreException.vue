<template>
  <!--手阅打分异常 -->
  <div class="absent-exception">
    <!-- 左侧区域 -->
    <div class="left-exception">
      <div class="scan-info">
        <div class="first-div">
          <span class="first">异常原因：</span>
          <span class="second">手阅打分栏超分、打错分、未打分</span>
          <span class="last" @click="tipsEv">操作提示</span>
        </div>
        <div class="last-div">点击图片查看原卷</div>
      </div>
      <!-- 异常题区域 -->
      <div class="content">
        <div class="content-info" v-for="(item, index) in data" :key="index">
          <div class="stu-info">
            <div class="first-stu">
              <div class="school">{{ item.schoolName }}</div>
              <span>查看原卷>></span>
              <el-image
                v-if="item.imagePaths && item.imagePaths[0]"
                style="width: 70px; height: 12px"
                :src="item.imagePaths[0]"
                :preview-src-list="item.imagePaths"
                :initial-index="1"
              ></el-image>
            </div>
            <div class="last-stu">
              <span>姓名：{{ item.studentName }}</span>
              <span>考号：{{ item.zkzh }}</span>
              <span>分数：{{ item.exceptionRemark.omrScore }}</span>
            </div>
          </div>
          <div class="img-info">
            <el-image style="width: 100%; height: 61px" :src="item.imagePaths[0]" fit="fill"></el-image>
          </div>
          <div class="bottom-info">
            <el-button type="danger" plain size="mini">{{
              item.exceptionRemark.scoreExceptionType === '0'
                ? '未打分'
                : item.exceptionRemark.scoreExceptionType === '1'
                ? '超分'
                : '打错分'
            }}</el-button>
            <div class="setting-score">
              <span>设置分数：</span>
              <div class="demo-button-style">
                <el-radio-group v-model="item.exceptionRemark.finalScore" size="mini">
                  <el-radio-button v-for="item in item.exceptionRemark.scoreArr" :key="item" :label="item">{{
                    item
                  }}</el-radio-button>
                </el-radio-group>
              </div>
            </div>
            <div class="half-score">
              <el-checkbox-group
                v-model="item.exceptionRemark.halfScore"
                size="mini"
                :disabled="item.exceptionRemark.finalScore === item.exceptionRemark.score"
              >
                <el-checkbox-button :label="0.5">+ 0.5</el-checkbox-button>
              </el-checkbox-group>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 右侧列表 -->
    <ExceptionList :exceptionType="exceptionType" @getDetails="getDetails" ref="childRef">
      <div class="last-right">
        <el-button plain size="small" @click="submit">提交本页</el-button>
      </div>
    </ExceptionList>
    <!-- 提示弹框 -->
    <TipsDialog :dialogVisible="dialogVisible" @closeDialog="closeDialog" />
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, reactive, nextTick } from 'vue'
import { successMessage } from '@/utils/notice/message'
import Api from '@/api/scan/exception-api'
import ExceptionList from '../components/ExceptionList.vue' // 异常列表
import TipsDialog from '../components/TipsDialog.vue'

const url = ref('https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg')

const childRef: any = ref('childRef')

const state = reactive({
  exceptionType: 7, //异常类型 1:定位异常 2:考号异常 3:考号重复异常 4:缺考异常 5:选做题异常 6:客观题异常 7:手阅打分异常 8:图像异常
  params: <any[]>[],
  data: <any[]>[],
})
const { exceptionType, data } = toRefs(state)

// 获取子组件数据
const getDetails = (val: []) => {
  val.map((item: any) => {
    item.exceptionRemark = JSON.parse(item.exceptionRemark)
    item.exceptionRemark.scoreArr = []
    item.exceptionRemark.halfScore = <any[]>[]
    for (let index = 0; index <= item.exceptionRemark.score; index++) {
      item.exceptionRemark.scoreArr.push(index)
    }
  })
  data.value = val
  console.log('data------->', data.value)
}

// 提交本页
const submit = async () => {
  // console.log('data-------->', data.value)
  let params = {
    examId: '234163825709982807152',
    paperId: '234163825709984007153',
    schoolId: '196163040965860000280',
    scores: <any[]>[],
  }
  data.value.map((item) => {
    let obj: any = {}
    obj.scanExceptionId = item.id
    if (item.exceptionRemark.halfScore.length > 0) {
      obj.score = item.exceptionRemark.finalScore + item.exceptionRemark.halfScore[0]
    } else {
      obj.score = item.exceptionRemark.finalScore
    }
    params.scores.push(obj)
  })
  const res: any = await Api.submitScore(params)
  if (res.result) {
    successMessage('提交成功！')
    nextTick(() => {
      // 执行子组件方法
      childRef.value.getExceptionList()
    })
  }
}

// 提示弹框事件
const dialogVisible = ref(false)
const closeDialog = () => {
  dialogVisible.value = false
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
    > .first-div {
      span.first {
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
    > .last-div {
      color: #909090;
    }
  }
  //content
  .content {
    // min-width: 1100px;
    height: 744px;
    overflow-y: auto;
    background: #ffffff;
    box-sizing: border-box;
    margin: 20px 40px;
    padding: 32px 36px;
    .content-info {
      height: 228px;
      margin-bottom: 16px;
      box-sizing: border-box;
      padding: 22px;
      background: #f7f9fa;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .stu-info {
        > div.first-stu {
          font-size: 16px;
          color: #000000;
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
        > div.last-stu {
          margin-top: 12px;
          font-size: 14px;
          color: #565657;
          span {
            margin-right: 30px;
          }
        }
      }
      .img-info {
        position: relative;
        img {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 9;
        }
      }
      //
      .bottom-info {
        display: flex;
        justify-content: space-between;
        > :deep(.el-button) {
          height: 28px;
        }
        .setting-score {
          display: flex;
          flex: 1;
          padding: 0 20px;
          font-size: 14px;
          color: #000000;
          line-height: 28px;
          > span {
            display: inline-block;
            width: 76px;
          }
          .demo-button-style {
            flex: 1;
          }
        }
      }
    }
  }
}
.last-right {
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
</style>
