import request from '@/utils/request'
// 新增
export function addItem(data) {
  return request({
    url: '/Journalism/save',
    method: 'post',
    data
  })
}
// 查询列表
export function findAll(data) {
  return request({
    url: '/Journalism/findAll',
    method: 'post',
    data
  })
}
// 查询已读人员列表
export function findyi(data) {
  return request({
    url: '/Journalism/selectin',
    method: 'post',
    data
  })
}
// 查询未读人员列表
export function findUnreadFn(data) {
  return request({
    url: '/Journalism/selectout',
    method: 'post',
    data
  })
}
// 注销
export function writeOff(params) {
  return request({
    url: '/Journalism/delete',
    method: 'post',
    params: params
  })
}
// 上下架
export function upDown(params) {
  return request({
    url: '/Journalism/lowershelf',
    method: 'post',
    params
  })
}