import request from '@/utils/request'
// 添加菜单
export function addMenu(data) {
  return request({
    url: '/meu',
    method: 'post',
    data
  })
}
// 初始化菜单
export function getMenu(data) {
  return request({
    url: '/meu',
    method: 'patch',
    data
  })
}
// 查询主菜单
export function getMMenu(data) {
  return request({
    url: '/meutype',
    method: 'patch',
    data
  })
}
// 编辑
export function editMenu(data) {
  return request({
    url: '/meu',
    method: 'put',
    data
  })
}
// 删除
export function delMenu(params) {
  return request({
    url: '/meu',
    method: 'delete',
    params
  })
}
// 查询上级菜单
export function TMenu(params) {
  return request({
    url: '/meutype',
    method: 'get',
    params
  })
}
