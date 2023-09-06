<template>
  <div class="scan-paper">
    <div class="left-content">
      <div class="title">考试场次名称</div>
      <div class="details">
        题卡类型：
        {{
          scaninfo.cardType === 0
            ? '在线网阅题卡'
            : scaninfo.cardType === 4
            ? '在线手阅题卡'
            : scaninfo.cardType === 1
            ? '第三方网阅题卡'
            : '第三方手阅题卡'
        }}
      </div>
      <div class="details">阅卷方式： 手阅</div>
      <div class="details">年级学科： 高一历史</div>
      <div class="details">应扫描张数： {{ scaninfo.scanNum }}</div>
      <div class="details">计划人数： {{ scaninfo.studentNum }}</div>
      <div class="details">学校： 深圳石头中学</div>
    </div>
    <div class="right-content">
      <div class="scan-top">
        <div class="status" v-if="status === 2">
          <span class="first">扫描状态：</span>
          <span class="second">连接中</span>
        </div>
        <div class="status" v-if="status === 1">
          <span class="first">扫描状态：</span>
          <span class="second">扫描仪已连接</span>
        </div>
        <div class="status" v-if="status === 3">
          <span class="first">扫描状态：</span>
          <span class="second" style="color: #f24646">客户端未运行</span>
          <span class="third">点击<a href="javascript:void(0)" @click="downLoad">下载客户端</a></span>
        </div>
        <div class="refresh" @click="refresh">
          <img src="../../../assets/imgs/refresh.png" alt="" />
          <span>刷新</span>
        </div>
      </div>
      <div class="scan-details">
        <div class="scan-status">
          <!-- 连接成功 -->
          <div class="scan-connect" v-if="scanStatus === 2">
            <div v-if="status === 2">
              <img src="../../../assets/imgs/scan_status_checking.png" alt="" />
              <div class="status-tips">扫描仪状态检测中</div>
            </div>
            <div v-if="status === 1">
              <img src="../../../assets/imgs/scan_status_success.png" alt="" />
              <div class="status-tips">扫描仪已连接</div>
            </div>
            <div v-if="status === 3">
              <img src="../../../assets/imgs/scan_status_abnormal.png" alt="" />
              <div class="status-tips">扫描仪连接异常</div>
            </div>
          </div>
          <!-- 开始扫描 -->
          <div class="scan-result" v-if="scanStatus === 1">
            <div>
              <div class="result">
                <div class="count">32</div>
                <div class="descript">已经扫描</div>
              </div>
            </div>
            <div>
              <div class="result">
                <div class="count">25</div>
                <div class="descript">已经识别</div>
              </div>
            </div>
            <div>
              <div class="result">
                <div class="count">7</div>
                <div class="descript">识别异常</div>
              </div>
              <div class="status-tips" @click="trunTo">处理异常</div>
            </div>
          </div>
        </div>
        <div class="scan-type">
          <span>扫描类型：</span>
          <el-radio v-model="radio" :label="1">纸质题卡</el-radio>
          <el-radio v-model="radio" :label="2">题卡文件夹</el-radio>
          <!-- 扫描纸质题卡 -->
          <div v-if="radio === 1">
            <el-button class="scan-btn" type="primary" size="small" @click="beginScan" :disabled="scanStatus === 2">{{
              scanStatus === 1 ? '开始扫描' : scanStatus === 2 ? '扫描中' : '继续扫描'
            }}</el-button>
            <el-button class="scan-btn" plain size="small" @click="stopScan">停止扫描</el-button>
          </div>
          <!-- 扫描文件夹 -->
          <div v-show="radio === 2" class="drag-container">
            <input id="selectFile" type="file" webkitdirectory multiple class="clip" @change="uploadFile" />
            <label for="selectFile" class="upload-btn">扫描文件夹</label>
            <label for="selectFile" id="drag" @drop="drop" @dragenter="prevent" @dragover="prevent">
              <el-icon style="vertical-align: middle"> <UploadFilled /></el-icon>
              <span style="vertical-align: middle"> 拖拽文件上传 </span>
              <input type="file" webkitdirectory multiple hidden />
            </label>
            <el-popover
              placement="bottom"
              :width="260"
              trigger="hover"
              content="将图片文件拖到此处或点击上传，仅支持上传jpg/png格式文件，单个文件数量建议在300张。"
            >
              <template #reference>
                <el-icon style="vertical-align: middle; margin-left: 6px"> <QuestionFilled /></el-icon>
              </template>
            </el-popover>
          </div>
        </div>
      </div>
      <div class="scan-info">
        <div>
          <el-table ref="multipleTable" :data="state.tableData" align="center" size="medium" border style="width: 100%">
            <el-table-column property="batch" label="扫描批次" width="116" align="center" />
            <el-table-column property="count" label="已扫描" align="center" />
            <el-table-column property="count" label="已上传" align="center" />
            <el-table-column property="count" label="未上传" align="center" />
            <el-table-column property="count" label="已识别" align="center" />
            <el-table-column property="count" label="已同步" align="center" />
            <el-table-column property="count" label="未同步" align="center" />
            <el-table-column property="count" label="异常数量" align="center" />
            <el-table-column property="name" label="扫描员" align="center" />
            <el-table-column label="操作" width="135" align="center">
              <template #default>
                <el-button type="text" size="small" @click="repeatRecognition">重新识别</el-button>
                <el-button type="text" size="small">查看全部</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, toRefs, onUnmounted } from 'vue'
import { normalMessage, successMessage, warnMessage, errorMessage } from '@/utils/notice/message'
import { UploadFilled, QuestionFilled, Promotion } from '@element-plus/icons'
import { useRouter } from 'vue-router'
import Api from '@/api/scan/scan-api'
import { WBST } from '@/utils/websocket/websocket.js'

// 声明事件
const emit = defineEmits(['refresh'])

let ws: any
const router = useRouter()
const radio = ref(2)
const status = ref(2)
const scanStatus = ref(1)
const state = reactive({
  scaninfo: <any>{}, // 图片预览列表
  tableData: [
    {
      batch: 'XXX-10-13-01',
      count: '245',
      name: '李丽',
      progress: 50,
    },
    {
      batch: 'XXX-10-13-01',
      count: '245',
      name: '李丽',
      progress: 80,
    },
    {
      batch: 'XXX-10-13-01',
      count: '245',
      name: '李丽',
      progress: 100,
    },
  ],
  multipleSelection: [],
})
const { scaninfo } = toRefs(state)

onMounted(() => {
  console.log('onMounted------>')
  getScanInfo()
  // init()
  // if ('WebSocket' in window) {
  //   // 打开一个 web socket
  //   var ws = new WebSocket('ws://127.0.0.1:11111')
  //   ws.onopen = () => {
  //     // Web Socket 已连接上，使用 send() 方法发送数据
  //     ws.send('发送数据')
  //   }
  //   ws.onmessage = (evt) => {
  //     console.log('e------>', evt)
  //     var received_msg = evt.data
  //     // alert('数据已接收...')
  //   }
  //   ws.onclose = () => {
  //     // 关闭 websocket
  //     // alert('连接已关闭...')
  //   }
  // } else {
  //   // 浏览器不支持 WebSocket
  //   alert('您的浏览器不支持 WebSocket!')
  // }
  // var div = document.querySelector('#drag')

  // div.addEventListener('dragenter', function (e) {
  //   //拖进
  //   e.preventDefault()
  // })
  // div.addEventListener('dragover', function (e) {
  //   //拖来拖去
  //   e.preventDefault()
  // })
  // div.addEventListener('drop', function (event) {
  //   event.preventDefault()
  //   // 将类数组对象 转换成数组
  //   // var fileList = Array.from(event.dataTransfer.files);  //  es6 格式
  //   // var fileList = [].slice.call(event.dataTransfer.files) // es5 格式
  //   // console.log('fileList--------->', fileList)
  // })
})
onUnmounted(() => {
  console.log('onUnmounted-------->')
})
// 查询按钮
const getScanInfo = async () => {
  const res: any = await Api.getScanInfo('042164129778850100255', '042164129778852100256', '001008')
  scaninfo.value = res.data
}
// 页面初始化，连接websoket
const init = () => {
  // const ws = new WBST({
  //   url: `ws://dev.local.yjzhixue.com/api/scan-task/websocket/1/2?token=${import.meta.env.VITE_AUTHORIZATION}`,
  // })
  ws = new WBST({ url: `ws://127.0.0.1:11111` })
  ws.onopen = (e: any) => {
    // Web Socket 已连接上，使用 send() 方法发送数据
    ws.sendMsg({ cmd: 'check_scaner', msg: '连接成功!', code: '1', data: '127.0.0.1:54388' })
  }
  ws.onmessage = (res: any) => {
    console.log('res------>', JSON.parse(res.data))
    const data: any = JSON.parse(res.data)
    if (data.cmd === 'conn_res' && data.code === '1') {
      status.value = 1
    }
    switch (data.cmd) {
      case 'conn_res':
        status.value = 1
        break
      case 'start_scan_res':
        scanStatus.value = 2
        break
      case 'start_scan_upcarding':
        // do something
        break
      case 'scan_over':
        scanStatus.value = 1
        successMessage(data.msg)
        break
      default:
        // this never happens
        break
    }
  }
  // 异常事件：Ws报错后触发
  ws.onerror = (e: any) => {
    status.value = e.target.readyState
  }
}

//开始扫描
const beginScan = () => {
  ws.sendMsg({ cmd: 'start_scan', msg: '连接成功!', code: '1', data: '127.0.0.1:54388' })
}
//停止扫描
const stopScan = () => {
  ws.sendMsg({ cmd: 'stop_scan_res', msg: '连接成功!', code: '1', data: '127.0.0.1:54388' })
}

// 下载客户端
const downLoad = async () => {
  const res: any = await Api.getClient('1')
  if (res.data) {
    window.location.href = res.data.zipPath
  }
}
// 刷新
const refresh = () => {
  emit('refresh')
}
// 扫描文件夹
const uploadFile = (e: any) => {
  console.log('e------>', e.target.files)
  for (let i = 0; i <= e.target.files.length; i++) {
    ;(async (i: any) => {
      let formData: any = new FormData()
      formData.append('examId', '044164017469273400076')
      formData.append('paperId', '044164017469278500077')
      formData.append('schoolId', '084162747207228603286')
      formData.append('batchId', new Date().getTime())
      formData.append('testType', '1') // 测试类型，1：考试，2：课时练
      formData.append('batchIndex', i) // 该批次的第几张
      formData.append('scanNum', e.target.files.length) // 已扫描人数
      formData.append('orgNo', '001017') // 机构编号
      formData.append('examName', '开评缓存') // 考试名称
      formData.append('paperName', '语文') // 试卷名称
      if (i < e.target.files.length) {
        formData.append('file', e.target.files[i])
        formData.append('endFlag', 0) //当前批次是否结束标记,0未结束,1已结束
      } else {
        formData.append('endFlag', 1) //当前批次是否结束标记,0未结束,1已结束
      }
      const res: any = await Api.uploadFile(formData)
    })(i)
  }
}
// 拖拽上传
const drop = async (e: any) => {
  e.preventDefault()

  let domFiles = e.dataTransfer.files
  if (domFiles.length) {
    let ret: any[] = []

    // 注意：接下来大部分的API都是非标准的API，在后续可能有变化，如果需要在公司业务使用，建议标注清楚使用事项和注意事项。
    // FileSystemFileEntry.file()/FileSystemDirectoryEntry.createReader()
    const addFilesFormDirectory = (directory: any, path: any) => {
      const dirReader = directory.createReader()
      dirReader.readEntries((entries: any) => {
        // console.log('entries---->', entries)
        entries.forEach((entry: any) => {
          // 判断是否是文件
          if (entry.isFile) {
            entry.file((fileData: any) => {
              // 用fullPath的值来代替webkitRelativePath
              fileData.fullPath = path + '/' + fileData.name
              ret.push(fileData)
            })
          } else if (entry.isDirectory) {
            // 如果还是文件夹,则递归处理
            addFilesFormDirectory(entry, path + '/' + entry.name)
          }
        })
      })
    }

    let items = e.dataTransfer.items
    for (let i = 0; i < items.length; i++) {
      // webkitGetAsEntry该API来创建一个FileSystemFileEntry或者FileSystemDirectoryEntry对象
      let entry = items[i].webkitGetAsEntry()
      if (entry.isFile) {
        // 写入上传文件的逻辑，调用上传接口
        warnMessage('请选择文件夹拖入！')
      } else if (entry.isDirectory) {
        // 上传文件夹
        addFilesFormDirectory(entry, entry.name)
      }
    }
    console.log('ret------->', ret)
  }
}

// 阻止拖拽默认事件
const prevent = (e: any) => {
  e.preventDefault()
}

const trunTo = () => {
  let routeUrl = router.resolve({
    path: '/exception',
  })
  window.open(routeUrl.href, '_blank')
}
//重新识别
const repeatRecognition = () =>{
  window.location.href=""
}
</script>

<style lang="scss" scoped>
.scan-paper {
  display: flex;
  justify-content: space-between;
}
.left-content {
  width: 280px;
  height: 600px;
  padding: 20px;
  border-right: 1px solid #e8ebf3;
  .title {
    font-size: 16px;
    color: #303030;
    font-weight: 600;
    padding-bottom: 10px;
  }
  .details {
    padding: 10px 0;
    font-size: 14px;
    color: #303030;
  }
}
//
.right-content {
  padding: 20px;
  flex: 1;
  .scan-top {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    .status {
      .first {
        color: #303030;
      }
      .second {
        color: #0090ff;
      }
      .third {
        margin-left: 20px;
      }
    }
    .refresh {
      cursor: pointer;
      img {
        width: 14px;
        height: 14px;
        margin-right: 4px;
        vertical-align: middle;
      }
    }
  }
  //
  .scan-details {
    // width: 840px;
    height: 256px;
    margin-top: 20px;
    .scan-status {
      height: 196px;
      background: url('../../../assets/imgs/scan_bg.png');
      .scan-connect > div {
        height: 168px;
        display: flex;
        padding: 20px 0;
        flex-direction: column;
        align-items: center;
        img {
          width: 112px;
          height: 112px;
        }
        .status-tips {
          width: 134px;
          height: 24px;
          margin-top: 10px;
          font-size: 14px;
          text-align: center;
          line-height: 24px;
          color: #ffffff;
          border: 1px solid #8eceff;
          border-radius: 24px;
        }
      }
      .scan-result {
        display: flex;
        justify-content: space-around;
        align-items: center;
        > div {
          height: 168px;
          display: flex;
          padding: 20px 0;
          flex-direction: column;
          align-items: center;
          .result {
            width: 112px;
            height: 112px;
            box-sizing: border-box;
            padding: 30px 0;
            color: #ffffff;
            text-align: center;
            font-size: 14px;
            background: url('../../../assets/imgs/scan_status_common.png') no-repeat center/contain;
            .count {
              font-size: 28px;
              font-weight: 600;
            }
          }
          .status-tips {
            width: 88px;
            height: 24px;
            margin-top: 10px;
            font-size: 14px;
            text-align: center;
            line-height: 24px;
            color: #ffffff;
            border: 1px solid #8eceff;
            border-radius: 24px;
            cursor: pointer;
          }
        }
      }
    }
  }
  //
  .scan-type {
    height: 60px;
    line-height: 60px;
    vertical-align: baseline;
    border: 1px solid #e8ebf3;
    font-size: 14px;
    color: #303030;
    display: flex;
    align-items: center;
    padding-left: 136px;
    > span {
      display: inline-block;
      line-height: 1.2;
    }
    .scan-btn {
      width: 160px;
    }
    .upload-btn {
      display: inline-block;
      box-sizing: border-box;
      width: 160px;
      height: 32px;
      padding: 8px 16px;
      font-size: 12px;
      text-align: center;
      line-height: 16px;
      color: #ffffff;
      background: #409eff;
      border-radius: 2px;
      cursor: pointer;
      margin-right: 10px;
    }
    .drag-container {
      line-height: 2;
      .clip {
        position: absolute;
        clip: rect(0, 0, 0, 0);
      }
      #drag {
        display: inline-block;
        border: 1px solid #dcdfe6;
        box-sizing: border-box;
        text-align: center;
        width: 160px;
        height: 32px;
        color: #595959;
        font-size: 14px;
        border-radius: 3px;
      }
    }
  }
  //
  .scan-info {
    > div.first {
      padding: 10px 0;
      text-align: right;
    }
  }
}
</style>
