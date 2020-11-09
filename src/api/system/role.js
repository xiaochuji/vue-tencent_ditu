import request from '@/utils/request'
// 添加角色
export function addRole(data) {
  return request({
    url: '/role',
    method: 'post',
    data
  })
}
// 初始化角色列表
export function getRole(data) {
  return request({
    url: '/role',
    method: 'patch',
    data
  })
}
// 删除
export function delRole(params) {
  return request({
    url: '/role',
    method: 'delete',
    params: params
  })
}
// 权限设置
export function putRole(data) {
  return request({
    url: '/role',
    method: 'put',
    data
  })
}
// 页面设置下级菜单
export function sMenu(params) {
  return request({
    url: '/meu',
    method: 'get',
    params: params
  })
}
// 获取所有菜单
export function AllMenu() {
  return request({
    url: '/meu',
    method: 'get'
  })
}
