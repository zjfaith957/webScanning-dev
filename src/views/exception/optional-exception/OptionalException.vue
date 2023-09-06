<template>
  <!-- 选做题异常 -->
  <div class="optional-exception">
    <!-- 左侧区域 -->
    <div class="left-exception">
      <div class="scan-info">
        <div class="first-info">
          <span class="first">异常原因：</span>
          <span class="second">选做题标记未涂或多涂</span>
          <span class="last" @click="tipsEv">操作提示</span>
        </div>
        <div class="last-info">
          <span>点击图片查看原卷</span>
        </div>
      </div>
      <!-- 异常题区域 -->
      <div class="content">
        <div class="content-info">
          <div class="stu-info">
            <div class="fist-stu">深圳宝安第一实验中学</div>
            <div class="last-stu">
              <span>姓名：张艺山</span>
              <span>考号：2569780</span>
            </div>
          </div>
          <div class="img-info">
            <el-image style="width: 230px; height: 60px" :src="url" fit="fill"></el-image>
          </div>
          <div class="options-info">
            <el-checkbox-group v-model="checkboxGroup1" size="mini">
              <el-checkbox-button v-for="option in options" :key="option" :label="option">{{
                option
              }}</el-checkbox-button>
            </el-checkbox-group>
          </div>
        </div>
        <div class="content-info">
          <div class="stu-info">
            <div>深圳宝安第一实验中学</div>
            <div>
              <span>姓名：张艺山</span>
              <span>考号：2569780</span>
            </div>
          </div>
          <div class="img-info">
            <el-image style="width: 230px; height: 60px" :src="url" fit="fill"></el-image>
          </div>
          <div class="options-info">
            <el-checkbox-group v-model="checkboxGroup1" size="mini">
              <el-checkbox-button v-for="option in options" :key="option" :label="option">{{
                option
              }}</el-checkbox-button>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </div>
    <!-- 右侧列表 -->
    <ExceptionList :exceptionType="exceptionType" />
    <!-- 提示弹框 -->
    <TipsDialog :dialogVisible="dialogVisible" @closeDialog="closeDialog" />
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, reactive } from 'vue'
import { normalMessage, successMessage, warnMessage, errorMessage } from '@/utils/notice/message'
import Api from '@/api/scan/exception-api'
import ExceptionList from '../components/ExceptionList.vue' // 异常列表
import TipsDialog from '../components/TipsDialog.vue' // 提示弹框

const url = ref('https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg')

// 提示弹框事件
const dialogVisible = ref(false)
const closeDialog = () => {
  dialogVisible.value = false
}

const state = reactive({
  exceptionType: 5, //异常类型 1:定位异常 2:考号异常 3:考号重复异常 4:缺考异常 5:主观题选做题异常 6:客观题异常 7:手阅打分异常 8:图像异常
  checkboxGroup1: ['17', '18'],
  options: ['17', '18', '19', '20'],
})
const { exceptionType, checkboxGroup1, options } = toRefs(state)

const tipsEv = () => {
  dialogVisible.value = true
}
</script>

<style lang="scss" scoped>
.optional-exception {
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
        width: 278px;
        > .first-stu {
          font-weight: 600;
          font-size: 16px;
          color: #000000;
        }
        > .last-stu {
          margin-top: 12px;
          font-size: 14px;
          color: #565657;
          span {
            margin-right: 30px;
          }
        }
      }
      .options-info {
        line-height: 68px;
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
      }
    }
  }
}
</style>
