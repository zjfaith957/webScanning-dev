<template>
  <div class="img-view">
    <div class="img-container" ref="imgContainerRef">
      <!-- <img src="../../../assets/imgs/ex_paper.png" alt="" /> -->
      <!-- <canvas ref="imgContainer" width="1000" height="760"></canvas> -->
      <canvas
        v-show="imgList.length"
        :style="{
          backgroundImage: 'url(' + imgUrl + ')',
          transform:
            'rotate(' +
            state.angle +
            'deg) scale(' +
            state.scaleIndex +
            ') translate(' +
            state.translateX +
            'px,' +
            state.translateY +
            'px) ',
        }"
        id="canvas"
        ref="canvas"
        @click="findRect"
        width="1000"
        height="1400"
        @mousedown="mousedown"
        @mouseup="mouseup"
        @mousemove="mousemove"
      >
      </canvas>
      <img v-show="!imgList.length" src="../../../assets/imgs/no_data.png" alt="" />
      <div class="dislog" ref="dislog" v-show="state.dialogVisible">
        <el-button type="danger" size="mini" @click="del">删除</el-button>
      </div>
    </div>
    <div class="btn-container">
      <div class="page-container">
        <el-button
          v-for="(item, index) in imgList"
          :type="index === pageIndex ? 'primary' : ''"
          size="mini"
          @click="currentChange(index)"
          >第{{ index + 1 }}页</el-button
        >
      </div>
      <div class="btn">
        <el-button type="primary" size="mini" @click="reset">重置</el-button>
        <el-tooltip class="item" effect="dark" content="旋转" placement="left">
          <el-icon :size="20" @click="rotateEv"><refresh-right /></el-icon>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="放大" placement="left">
          <el-icon :size="20" @click="zoomInEv"><zoom-in /></el-icon>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="缩小" placement="left">
          <el-icon :size="20" @click="zoomOutEv"><zoom-out /></el-icon>
        </el-tooltip>
      </div>
    </div>
    <!-- 选择弹框 -->
    <el-dialog v-model="dialogFormVisible" title="请选择类型" width="274px" :modal="false" top="16vh">
      <el-radio-group v-model="positionTag">
        <el-radio :label="0">左上角</el-radio>
        <el-radio :label="1">右上角</el-radio>
        <el-radio :label="2">左下角</el-radio>
        <el-radio :label="3">右下角</el-radio>
        <el-radio :label="4">下校验点</el-radio>
        <el-radio :label="5">右校验点</el-radio>
        <el-radio :label="6">线定位</el-radio>
      </el-radio-group>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="submitPoint">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, toRefs, onMounted, watch } from 'vue'
import Api from '@/api/scan/exception-api'
import { RefreshRight, ZoomIn, ZoomOut } from '@element-plus/icons'
import { normalMessage, successMessage, warnMessage, errorMessage } from '@/utils/notice/message'

const props = defineProps({
  imgList: <any[]>[],
  default: [],
})

//定义canvas
let canvas: any, context: any

const state = reactive({
  pageIndex: 0, // 默认页码
  imgUrl: '/src/assets/imgs/ex_paper.png', // 测试图片，默
  angle: 0, // 旋转角度
  angleIndex: 0, // 旋转倍数index
  scaleIndex: 0.5, // 缩放默认为1
  translateX: 0, // 平移X轴距离
  translateY: 0, // 平移Y轴距离
  flag: false, // 判断是否框选
  downX: 0, //鼠标点击图片落下时的位置（X）
  downY: 0, //鼠标点击图片落下时的位置（Y）
  rectWidth: 0, //矩形框的宽
  rectHeight: 0, //矩形框的高
  totalRect: <any[]>[], //画的所有的矩形坐标长度数据存储在数组中
  rectTag: false,
  delIndex: 0, //删除时选中的矩形框的index
  atime: 0,
  dialogVisible: false, //删除的弹出框

  positionTag: ref(0), // 弹框value值
  dialogFormVisible: false,
})
const { pageIndex, imgUrl, totalRect, positionTag, dialogFormVisible } = toRefs(state)
// 分页切换
const currentChange = (index: any) => {
  if (pageIndex.value === index) {
    return false
  }
  pageIndex.value = index
  imgUrl.value = props.imgList[index].imagePath
  reset()
}

// 提交框选的定位点
const submitPoint = async () => {
  console.log('downX------->', state.downX)
  console.log('downY------->', state.downY)
  console.log('rectWidth------->', state.rectWidth)
  console.log('rectHeight------->', state.rectHeight)
  let params = {
    x1: state.downX,
    y1: state.downY,
    x2: state.rectWidth,
    y2: state.rectHeight,
    picPath: imgUrl.value,
  }
  const res: any = await Api.submitPoint(params)
  if (res.result) {
    dialogFormVisible.value = false
    state.totalRect[state.totalRect.length - 1].positionTag = state.positionTag
    successMessage('提交成功！')
  }
}
// 1. DOM节点
const dislog = ref<null | HTMLElement>(null)
const imgContainerRef = ref<null | HTMLElement>(null)
onMounted(() => {
  console.log('props.imgList---->', props.imgList)
  canvas = document.getElementById('canvas')
  context = canvas.getContext('2d')
})
// 按下鼠标
const mousedown = (e: MouseEvent) => {
  state.atime = new Date().getTime()
  state.flag = true
  state.downX = e.offsetX // 鼠标落下时的X
  state.downY = e.offsetY // 鼠标落下时的Y
  mousemove(e)
}
// 移动鼠标
const mousemove = (e: MouseEvent) => {
  if (state.flag) {
    //判断如果重右下往左上画，这种画法直接return
    if ((state.downX - e.offsetX > 0 || state.downY - e.offsetY > 0) && state.angleIndex % 2 === 0) {
      console.log('重右下往左上画')
      return
    } else {
      //如果重左上往右下画，计算出鼠标移动的距离，也就是矩形框的宽和高
      state.rectWidth = Math.abs(state.downX - e.offsetX)
      state.rectHeight = Math.abs(state.downY - e.offsetY)
      //判断这个宽高的长度，如果小于10，直接return，因为鼠标移动距离过于短
      //防止点击页面时,会画成一个点，没有意义
      if (state.rectWidth < 2 || state.rectHeight < 2) {
        state.rectWidth = 0
        state.rectHeight = 0
        return
      }
      clear() //清空画布
      redrawAll()
      drawRect(state.downX, state.downY, state.rectWidth, state.rectHeight)
    }
  }
}
// 抬起鼠标
const mouseup = () => {
  state.flag = false
  let a = new Date().getTime()
  if (a - state.atime > 150) {
    state.rectTag = false
  } else {
    state.rectTag = true
  }
  if (state.rectWidth || state.rectHeight) {
    //将画出的数据保存在totalRect中
    let obj = {
      beforex: state.downX,
      beforey: state.downY,
      rectW: state.rectWidth,
      rectH: state.rectHeight,
    }
    state.totalRect.push(obj)
    state.dialogFormVisible = true
  }
}

//清除画布
const clear = () => {
  context.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
}
const drawRect = (x: any, y: any, lineW: any, lineY: any) => {
  //   开始绘制;
  context.beginPath()
  //   //设置线条颜色，必须放在绘制之前
  context.strokeStyle = 'red'
  //   // 线宽设置，必须放在绘制之前
  context.lineWidth = 1
  // strokeRect参数：（左上角x坐标，y:左上角y坐标，绘画矩形的宽度，绘画矩形的高度）
  // 判断旋转角度
  if (state.angleIndex % 2 === 1) {
    lineW = -lineW
    lineY = -lineY
  }
  context.strokeRect(x, y, lineW, lineY)
  context.strokeRect(x, y, lineW, lineY)
  context.strokeRect(x, y, lineW, lineY)
}
//点击画布
const findRect = (e: MouseEvent) => {
  state.dialogVisible = false
  if (state.rectTag) {
    //当点击画布的时候，计算有没有点再矩形框内、哪个矩形框内
    state.totalRect.map((item: any, index: any) => {
      if (
        item.beforex < e.offsetX &&
        e.offsetX < item.beforex + item.rectW &&
        item.beforey < e.offsetY &&
        e.offsetY < item.beforey + item.rectH
      ) {
        state.delIndex = index
        item.selected = true
      } else {
        item.selected = false
      }
    })
    // 循环遍历selected
    state.totalRect.map((item: any, index) => {
      if (item.selected) {
        state.dialogVisible = true
        dislog.value!.style.left = e.pageX - (e.offsetX - item.beforex) + 1 + 'px'
        dislog.value!.style.top = e.pageY - 160 - (e.offsetY - item.beforey) + 1 + 'px'
      }
    })
  }
}
const redrawAll = () => {
  //    console.log("先画之前画过的图，保证画多个的时候看起来像前一个不消失");
  if (state.totalRect.length > 0) {
    state.totalRect.forEach((e: any) => {
      drawRect(e.beforex, e.beforey, e.rectW, e.rectH)
    })
  }
}
//点击删除按钮
const del = () => {
  state.dialogVisible = false
  //删除
  context.clearRect(
    state.totalRect[state.delIndex].beforex - 2,
    state.totalRect[state.delIndex].beforey - 2,
    state.totalRect[state.delIndex].rectW + 4,
    state.totalRect[state.delIndex].rectH + 4
  )
  //删掉totalRect的数据，真正的项目中需要调用后台接口，删掉数据库中存储的数据
  state.totalRect.splice(state.delIndex, 1)
  //删掉之后，再画一次，刷新页面
  redrawAll()
}
// 重置事件
const reset = () => {
  state.angle = 0
  state.angleIndex = 0
  state.scaleIndex = 0.5
  state.translateX = 0
  state.translateY = 0
  state.totalRect = []
  clear() //清空画布
}

// 旋转事件
const rotateEv = () => {
  reset()
  state.angleIndex++
  state.angle = state.angleIndex * 180
}
// 放大
const zoomInEv = () => {
  if (state.scaleIndex > 1) {
    warnMessage('已达到最大缩放比例')
    return
  }
  state.scaleIndex = state.scaleIndex + 0.1
  let offsetHeight = imgContainerRef.value?.offsetHeight as number
  let offsetWidth = imgContainerRef.value?.offsetWidth as number
  let height = canvas.height as number
  let width = canvas.width as number
  console.log('offsetWidth--->', offsetWidth)
  // console.log('height--->', height)
  // console.log('state.scaleIndex--->', state.scaleIndex)
  console.log('width--->', width * state.scaleIndex)
  if (height * state.scaleIndex > offsetHeight) {
    if (state.angleIndex % 2 === 0) {
      state.translateY = (height * state.scaleIndex - offsetHeight) / state.scaleIndex / 1.5
    } else {
      state.translateY = -(height * state.scaleIndex - offsetHeight) / state.scaleIndex / 1.5
    }
  }
  if (width * state.scaleIndex > offsetWidth) {
    if (state.angleIndex % 2 === 0) {
      state.translateX = (width * state.scaleIndex - offsetWidth) / state.scaleIndex
    } else {
      state.translateX = -(width * state.scaleIndex - offsetWidth) / state.scaleIndex
    }
  }
}
// 缩小
const zoomOutEv = () => {
  if (state.scaleIndex < 0.2) {
    warnMessage('已达到最小缩放比例')
    return
  }
  state.scaleIndex = state.scaleIndex - 0.1
}

// 监听count
watch(
  () => props.imgList,
  (newVal, oldVal) => {
    console.log(`watch监听变化前的数据：${oldVal}`)
    console.log(`watch监听变化后的数据：${newVal}`, newVal)
    if (newVal.length > 0) {
      imgUrl.value = newVal[0].imagePath
    }
  },
  {
    immediate: true, // 立即执行
    deep: true, // 深度监听
  }
)

// 将方法、变量暴露给父组件使用，父组件才可通过ref API拿到子组件暴露的数据
defineExpose({
  // 解构state
  totalRect,
})
</script>

<style lang="scss" scoped>
.img-view {
  position: relative;
  display: flex;
  min-width: 1000px;
  min-height: 744px;
  background: #f5f7fa;
  box-sizing: border-box;
  .img-container {
    position: relative;
    flex: 0 0 92%;
    box-sizing: border-box;
    width: 100%;
    height: 744px;
    overflow: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    #canvas {
      box-sizing: border-box;
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
    }
    .dislog {
      position: absolute;
      top: 0;
      left: 0;
    }
    > img {
      width: 200px;
      height: 200px;
    }
  }
  .btn-container {
    width: 100px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-left: 1px solid #e7e7e7;
    > div {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
    }
    .page-container {
      padding: 10px 0;
      > .el-button {
        margin: 10px 0;
        width: 60px;
        text-align: center;
        padding: 7px 0px;
      }
    }
    .btn {
      height: 180px;
      padding: 20px 0;
      > i {
        cursor: pointer;
      }
    }
  }
  // 调整弹框样式
  :deep(.el-dialog) {
    position: absolute;
    left: 26%;
  }
}
</style>
