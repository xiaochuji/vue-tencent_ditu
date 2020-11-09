import request from '@/utils/request'
// 添加权限
export function addPer(data) {
  return request({
    url: '/permission',
    method: 'post',
    data
  })
}
// 初始化查询
export function getPer(data) {
  return request({
    url: '/permission',
    method: 'patch',
    data
  })
}
