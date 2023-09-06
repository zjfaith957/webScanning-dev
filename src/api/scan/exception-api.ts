import http from '@/api/http/index'
const path ='/scan-task'

// 获取异常状态数量
const getExceptionCount = (examId:String,paperId:String,schoolId:String) => 
http.get(`${path}/scan-exception/statistics-exception-num?examId=${examId}&paperId=${paperId}&schoolId=${schoolId}`)

// 查询异常列表(定位异常/考号异常/考号重复/图像异常)
const getExceptionList = (params:any) => http.post(`${path}/scan-exception/paper-page`, params)

// 定位异常-提交坐标点
const submitPoint = (params:any) => http.post(`/card-distinguish/distinguish-info/getPointLocation`, params)

// 定位异常-重新识别
const reidentification = (params:any) => http.post(`${path}/scan-exception-handle/locationDistinguishAgain`, params)

// 定位异常-删除考试
const delExamOfException = (params:any) => http.post(`${path}/scan-exception-handle/deleteLocationException`, params)


// 题号分组查询异常列表(主观题选做题异常/客观题异常/手阅打分异常)
const getExceptionListByTitle = (params:any) => http.post(`${path}/scan-exception/th-page`, params)

//按题号获取详情(主观题选做题异常/客观题异常/手阅打分异常)
const getDetailsByTitle = (params:any) => http.post(`${path}/scan-exception/th-detail-page`, params)

// 缺考异常列表查询
const getExceptionOfAbsent = (params:any) => http.post(`${path}/scan-exception/qk-page`, params)
// 缺考异常提交
const submitExceptionOfAbsent = (params:any) => http.post(`${path}/scan-exception-handle/handle-qk`, params)

// 获取题卡图片- 异常
const getExamImg = (examId:String,paperId:String,studentKey:String,batchIndex?:String) => 
http.get(`${path}/scan-image/list?examId=${examId}&paperId=${paperId}&studentKey=${studentKey}&batchIndex=${batchIndex}`)

// 根据准考证号查询学生信息
const getStudentInfo = (examId:String,paperId:String,schoolId:String,zkzh:String) =>
http.get(`${path}/student-info/info/${examId}/${paperId}/${schoolId}/${zkzh}`)
// 确认考号提交
const submitZkzh = (params:any) => http.post(`${path}/scan-exception-handle/confirm-zkzh`, params)
// 删除考试
const delExam = (params:any) => http.delete(`${path}/scan-exception-handle`, params)

// 客观题异常提交
const submitObjective = (params:any) => http.post(`${path}/scan-exception-handle/handle-kgt`, params)

// 处理手阅打分异常-重新打分
const submitScore = (params:any) => http.post(`${path}/scan-exception-handle/re-score`, params)


export default {
  getExceptionCount,
  getExceptionList,
  submitPoint,
  reidentification,
  delExamOfException,
  getExceptionListByTitle,
  getExceptionOfAbsent,
  submitExceptionOfAbsent,
  getDetailsByTitle,
  getExamImg,
  getStudentInfo,
  submitZkzh,
  delExam,
  submitScore,
  submitObjective
}
 