import request from '@/utils/request'
// 数据字典初始化查询
export function salesPublic() {
  return request({
    url: '/salesPublicClass',
    method: 'patch'
  })
}
// 数据字典添加
export function salesPublicadd(data) {
  return request({
    url: '/salesPublicClass',
    method: 'post',
    data
  })
}
// 数据字典删除
export function salesPublicdelete(params) {
  return request({
    url: '/salesPublicClass',
    method: 'delete',
    params: params
  })
}
// 数据字典修改
export function salesPublicput(data) {
  return request({
    url: '/salesPublicClass',
    method: 'put',
    data
  })
}
// 数据字典模糊查询
export function salesPublicSelect(data) {
  return request({
    url: '/salesPublicClass/name',
    method: 'post',
    data
  })
}
