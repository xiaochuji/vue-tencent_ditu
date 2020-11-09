import request from '@/utils/request'
// 初始化查询
export function getUser(data) {
  return request({
    url: '/user',
    method: 'patch',
    data
  })
}
// 添加用户
export function addUser(data) {
  return request({
    url: '/user',
    method: 'post',
    data
  })
}
// 编辑用户信息
export function editUser(data) {
  return request({
    url: '/user',
    method: 'put',
    data
  })
}
// 重置密码
export function resetPass(data) {
  return request({
    url: '/password',
    method: 'put',
    data
  })
}
