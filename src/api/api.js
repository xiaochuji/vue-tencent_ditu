// 录音界面初始化查询
import request from '@/utils/request'

// 录音界面添加录音父级目录
export function Recordfather(data) {
  return request({
    url: '/catalogRecording',
    method: 'post',
    data
  })
}

export function catalogRecord() {
  return request({
    url: '/catalogRecording',
    method: 'patch'
  })
}
// 录音界面点击tree查询下级列表
export function catalogRecordcode(params) {
  return request({
    url: '/catalogRecording',
    method: 'get',
    params: params
  })
}

// 录音界面删除
export function Recorddelete(params) {
  return request({
    url: '/catalogRecording',
    method: 'delete',
    params: params
  })
}
// 录音界面修改
export function Recordput(data) {
  return request({
    url: '/catalogRecording',
    method: 'put',
    data
  })
}
// 录音界面上传图标
export function Recordfile(data) {
  return request({
    url: '/fileupload/file',
    method: 'post',
    data
  })
}
// 录音界面上传
export function Recordfileupload(data) {
  return request({
    url: '/fileupload',
    method: 'post',
    data
  })
}
// 录音界面查看是否有录音
export function yesnoluyin(params) {
  return request({
    url: '/soundRecording/getByCatalogRecordingId',
    method: 'post',
    params: params
  })
}

// 录音界面查看是否有录音
// export function luyinshow(data) {
//   return request({
//     url: '/soundRecording',
//     method: 'patch',
//     data
//   })
// }
// 添加录音
export function luyinadda(data) {
  return request({
    url: '/soundRecording',
    method: 'post',
    data
  })
}
// 录音添加后删除
export function lydelete(params) {
  return request({
    url: '/soundRecording',
    method: 'delete',
    params: params
  })
}
// 根据目录id查询当前节点下录音
export function RecordingId(params) {
  return request({
    url: '/soundRecording/getByCatalogRecordingId',
    method: 'get',
    params: params
  })
}
//
export function Recordingedit(data) {
  return request({
    url: '/soundRecording',
    method: 'put',
    data
  })
}
// 录音播放界面初始化
export function initialization(data) {
  return request({
    url: '/soundRecording/findPageSoundRecording',
    method: 'post',
    data
  })
}
// 点击取消删除上传内容
export function deletefileid(params) {
  return request({
    url: '/fileupload',
    method: 'delete',
    params: params
  })
}
