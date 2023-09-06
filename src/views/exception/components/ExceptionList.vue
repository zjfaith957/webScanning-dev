<template>
  <!-- 选做题异常/客观题异常/手阅打分异常列表组件 -->
  <!-- 右侧列表 -->
  <div class="right-list">
    <div class="first-right">
      <div class="school">学校：深圳宝安第一实验中学</div>
      <div class="batch-opt">
        <div :class="tabIndex === 1 ? 'tabActive' : ''" @click="getExceptionList(1)">待处理 （{{ data.length }}）</div>
        <div :class="tabIndex === 2 ? 'tabActive' : ''" @click="getExceptionList(2)">已处理（{{ data.length }}）</div>
      </div>
    </div>
    <div class="list-exception">
      <div v-for="(item, index) in data" :key="index" :class="index === selectIndex ? 'active' : ''">
        <img v-if="index === selectIndex" src="../../../assets/imgs/selected.png" alt="" />
        <div class="batch" @click="getdetailsEv(item, index)">
          <div>【{{ item.th }}】</div>
          <div style="margin-right: 20px">{{ item.exceptionNum }}</div>
        </div>
        <!-- <div v-if="operationFlag" class="checkbox"><el-checkbox v-model="item.selected" label=""></el-checkbox></div> -->
      </div>
    </div>
    <div class="optional-tips" v-if="exceptionType === 5">
      <el-checkbox v-model="checked" label=""></el-checkbox>勾选后选做题多涂或者为涂，点击【提交本页】
      默认以第1道题为选做题来计分处理
    </div>
    <slot></slot>
    <!-- <slot v-if="data.length"></slot> -->
  </div>
</template>

<script setup lang="ts">
import { toRefs, reactive, onMounted } from 'vue'
import { normalMessage, successMessage, warnMessage, errorMessage } from '@/utils/notice/message'
import Api from '@/api/scan/exception-api'

const props = defineProps({
  exceptionType: {
    type: Number,
    required: true,
  },
})
// 声明父组件事件
const emit = defineEmits(['getDetails'])

onMounted(() => {
  getExceptionList(1)
})

const state = reactive({
  tabIndex: 1, // tab选中index
  selectIndex: 0, //列表选中index
  operationFlag: false, // 批量操作
  checked: false,
  data: <any[]>[], // 异常列表
  current: 1,
  size: 50,
})
const { data, tabIndex, checked, selectIndex, current, size } = toRefs(state)

// 获取异常列表
const getExceptionList = async (type?: number) => {
  tabIndex.value = type || 1
  let params = {
    current: current.value,
    size: size.value,
    examId: '234163825709982807152',
    paperId: '234163825709984007153',
    schoolId: '196163040965860000280',
    exceptionState: tabIndex.value, // 1异常，2异常已处理
    exceptionType: props.exceptionType, //异常类型 1:定位异常 2:考号异常 3:考号重复异常 4:缺考异常 5:主观题选做题异常 6:客观题异常 7:手阅打分异常 8:图像异常
  }
  const res: any = await Api.getExceptionListByTitle(params)
  data.value = res.data.records || []
  if (res.data.records && res.data.records.length > 0) {
    getdetailsEv(data.value[0], 0, 'init')
  }
}

// 点击列表获取详情
const getdetailsEv = async (item: any, index: number, type?: string) => {
  if (selectIndex.value === index && type !== 'init') {
    return false
  }
  selectIndex.value = index
  let params = {
    current: current.value,
    size: size.value,
    examId: '234163825709982807152',
    paperId: '234163825709984007153',
    schoolId: '196163040965860000280',
    exceptionState: tabIndex.value, // 1异常，2异常已处理
    exceptionType: props.exceptionType,
    th: item.th,
  }
  const res: any = await Api.getDetailsByTitle(params)
  // 数据传递到父组件
  if (res.data.records && res.data.records.length > 0) {
    emit('getDetails', res.data.records)
  }
}

defineExpose({
  // 声明方法
  getExceptionList,
})
</script>

<style lang="scss" scoped>
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
      }
    }
    .active {
      background: #f5f7fa;
    }
  }
  // > .last-right {
  //   box-sizing: border-box;
  //   height: 68px;
  //   line-height: 68px;
  //   text-align: center;
  //   font-size: 14px;
  //   border-top: 1px solid #e7e7e7;
  //   > .el-button {
  //     width: 146px;
  //     height: 36px;
  //     padding: 6px;
  //     color: #f45554;
  //   }
  // }
  .optional-tips {
    padding: 0 20px 12px;
    font-size: 14px;
    color: #909090;
    line-height: 0.4;
    > .el-checkbox {
      margin-right: 6px;
    }
  }
}
</style>
