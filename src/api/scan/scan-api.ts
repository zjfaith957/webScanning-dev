import http from '@/api/http/index'
const path ='/scan-task'
// const path =''

// 1. 扫描答题卡页面接口
// 根据学校id查询最新客户端版本
const getClient = (schoolId:String) => http.get(`/webcloud/school-app-info/latest-version/${schoolId}`)


// 2. 扫描记录页面接口
// 获取班级
const getClass = (examId:String,paperId:String,schoolId:String) => http.get(`${path}/student-info/class-options?examId=${examId}&paperId=${paperId}&schoolId=${schoolId}`)

//  查询批次
const getBatch = (examId:String,paperId:String,schoolId:String) => http.get(`${path}/scan-batch/batch-id-options?examId=${examId}&paperId=${paperId}&schoolId=${schoolId}`)

// 按班级查看扫描记录分页列表
const getRecordByClass = (params:any) => http.post(`${path}/student-info/page`, params)

// 按批次查看扫描记录分页列表
const getRecordByBatch = (params:any) => http.post(`${path}/scan-info/page`, params)

// 获取题卡图片- 扫描记录
const getRecordmg = (examId:String,paperId:String,zkzh:String) => http.get(`${path}/scan-image/list-by-zkzh?examId=${examId}&paperId=${paperId}&zkzh=${zkzh}`)

// 班级概况
const getClassOverview = (examId:String,paperId:String,schoolId:String) => http.get(`${path}/student-info/class-overview?examId=${examId}&paperId=${paperId}&schoolId=${schoolId}`)

// 批次概况
const getBatchOverview = (examId:String,paperId:String,schoolId:String) => http.get(`${path}/scan-batch/batchId-overview?examId=${examId}&paperId=${paperId}&schoolId=${schoolId}`)

 // 导出记录
const exportRecord = (params:any) => http.post(`${path}/student-info/export-records`, params,{ responseType: 'blob' })

// 2. 扫描答卷接口
// 获取
const getScanInfo = (examId:String,paperId:String,orgNo:String) => http.get(`${path}/scan-batch/scanLeftPaperInfo/${examId}/${paperId}/${orgNo}`)

// 上传文件
const uploadFile = (params:any) => http.post(`/upload/uploadCardScan`, params)

export default {
  getClient,
  //
  getClass,
  getBatch,
  getRecordByClass,
  getRecordByBatch,
  exportRecord,
  getClassOverview,
  getBatchOverview,
  getRecordmg,
  getScanInfo,
  uploadFile
}
 