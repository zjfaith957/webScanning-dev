<template>
  <!-- 客观题异常 -->
  <div class="objective-exception">
    <!-- 左侧区域 -->
    <div class="left-exception">
      <div class="scan-info">
        <div class="first-info">
          <span class="first">异常原因：</span>
          <span class="second">选做题标记未涂或多涂</span>
          <span class="last" @click="tipsEv">操作提示 {{ name }}</span>
        </div>
        <div class="last-info">
          <span>点击图片查看原卷</span>
        </div>
      </div>
      <!-- 异常题区域 -->
      <div class="content">
        <div class="content-info" v-for="(item, index) in data" :key="index">
          <div class="stu-info">
            <div class="first-stu">{{ item.schoolName }}</div>
            <div class="last-stu">
              <span>姓名：{{ item.studentName }}</span>
              <span>考号：{{ item.zkzh }}</span>
            </div>
          </div>
          <div class="img-info">
            <el-image style="width: 230px; height: 60px" :src="item.imagePaths[0]" fit="fill"></el-image>
          </div>
          <div class="options-info">
            <span>{{ item.exceptionRemark.th }}.</span>
            <el-checkbox-group v-model="item.checkboxGroup" size="mini">
              <el-checkbox-button v-for="option in item.options" :key="option" :label="option">{{
                option
              }}</el-checkbox-button>
            </el-checkbox-group>
            <el-radio-group v-model="radio" size="medium" style="margin-left: 20px">
              <el-radio-button label="多涂">多涂</el-radio-button>
            </el-radio-group>
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
import { ref, toRefs, reactive, watch, nextTick } from 'vue'
import { normalMessage, successMessage, warnMessage, errorMessage } from '@/utils/notice/message'
import Api from '@/api/scan/exception-api'
import ExceptionList from '../components/ExceptionList.vue' // 异常列表
import TipsDialog from '../components/TipsDialog.vue'

const url = ref('https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg')
const childRef: any = ref('childRef')

const state = reactive({
  exceptionType: 6, //异常类型 1:定位异常 2:考号异常 3:考号重复异常 4:缺考异常 5:选做题异常 6:客观题异常 7:手阅打分异常 8:图像异常
  data: <any[]>[], //客观题异常
  optStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', // 定义选项
  // checkboxGroup: ['A'],
  // options: ['A', 'B'],
  radio: ref('未涂'),
})
const { exceptionType, data, optStr, radio } = toRefs(state)

// 获取子组件中列表--详情数据
const getDetails = (val: any) => {
  val.map((item: any) => {
    item.exceptionRemark = JSON.parse(item.exceptionRemark)
    // 处理选项数据
    item.options = optStr.value.substring(0, item.exceptionRemark.kgAnswerNum).split('')
    item.checkboxGroup = item.exceptionRemark.omrAnswer.split('')
  })
  data.value = val
  console.log('val------->', val)
}
// 提示弹框事件
const dialogVisible = ref(false)
const closeDialog = () => {
  dialogVisible.value = false
}
const tipsEv = () => {
  dialogVisible.value = true
}

// 提交本页
const submit = async () => {
  // console.log('data-------->', data.value)
  let params = {
    examId: '234163825709982807152',
    paperId: '234163825709984007153',
    schoolId: '196163040965860000280',
    answers: <any[]>[],
  }
  data.value.map((item: any) => {
    let obj: any = {}
    obj.scanExceptionId = item.id
    obj.answer = item.checkboxGroup.join('')
    params.answers.push(obj)
  })
  console.log('params------>', params)
  const res: any = await Api.submitObjective(params)
  if (res.result) {
    successMessage('提交成功！')
    nextTick(() => {
      // 执行子组件方法
      childRef.value.getExceptionList()
    })
  }
}

// 监听count
watch(
  () => data,
  (newVal, oldVal) => {
    console.log('newVal----->', newVal)
    console.log('oldVal----->', oldVal)
  }
)
</script>

<style lang="scss" scoped>
.objective-exception {
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
  //content
  .content {
    min-height: 744px;
    background: #ffffff;
    box-sizing: border-box;
    margin: 20px 40px;
    padding: 32px 36px;
    .content-info {
      height: 112px;
      box-sizing: border-box;
      padding: 22px;
      background: #f7f9fa;
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
      .stu-info {
        width: 246px;
        > .first-stu {
          font-weight: 600;
          font-size: 16px;
          color: #000000;
        }
        > .last-stu {
          margin-top: 12px;
          font-size: 14px;
          color: #565657;
          span:last-child {
            margin-left: 30px;
          }
        }
      }
      .options-info {
        line-height: 68px;
        display: flex;
        font-size: 16px;
        //多选样式
        :deep(.el-checkbox-group) {
          box-sizing: border-box;
          font-size: 14px;
          .el-checkbox-button {
            margin: 0 5px;
            span {
              border: 1px solid #dcdfe6;
              border-radius: 0;
            }
          }
          > .is-checked > span {
            border: 1px solid #409eff;
          }
        }
        //单选样式
        :deep(.el-radio-group) {
          box-sizing: border-box;
          font-size: 14px;
          .el-radio-button {
            margin: 0 5px;
            span {
              border: 1px solid #dcdfe6;
              border-radius: 5px;
            }
          }
          > .is-active > span {
            border: 1px solid #409eff;
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
