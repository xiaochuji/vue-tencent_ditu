import request from '@/utils/request'

// 添加物资类型
export function save(data) {
  return request({
    url: 'sysMaterial/save',
    method: 'post',
    data
  })
}
// 获取列表页
export function getAllList(data) {
  return request({
    url: 'sysMaterial/findAll',
    method: 'post',
    data
  })
}
// 获取第二个列表页
export function getTwoList(data) {
  return request({
    url: 'sysMaterialRecord/findAll',
    method: 'post',
    data
  })
}
// 设置半径
export function updatejindu(data) {
  return request({
    url: 'firm/updatejindu',
    method: 'post',
    data
  })
}
// 获取打卡范围
export function findFirmbyid(params) {
  return request({
    url: '/firm/findFirmbyid',
    method: 'get',
    params: params
  })
}
// 入库
export function SysMaterialRecord(data) {
  return request({
    url: 'sysMaterialRecord/save',
    method: 'post',
    data
  })
}
// 物资类型导出
export function exported(data) {
  return request({
    url: '/sysMaterial/export',
    method: 'post',
    data
  })
}