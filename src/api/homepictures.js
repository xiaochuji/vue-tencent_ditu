import request from '@/utils/request'

// 首页图片列表查询
export function Homeselect(data) {
  return request({
    url: '/file',
    method: 'patch',
    data
  })
}
// 首页图片添加
export function Homeadd(data) {
  return request({
    url: '/file',
    method: 'post',
    data
  })
}
// 首页图片上传
export function Homeupload(data) {
  return request({
    url: '/fileupload/file',
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
// 编辑、取消发布、发布
export function Editdelete(data) {
  return request({
    url: '/file',
    method: 'put',
    data
  })
}
// 删除
export function Deleteid(params) {
  return request({
    url: '/file',
    method: 'delete',
    params: params
  })
}
