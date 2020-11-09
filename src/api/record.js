import request from '@/utils/request'
function getRecordList(params) {
  return request({
    url: '/tenantry',
    method: 'patch',
    data: params
  })
}
function addRecord(params) {
  return request({
    url: '/leaseHolder',
    method: 'post',
    data: params
  })
}
function deleteRecord(params) {
  return request({
    url: '/leaseHolder',
    method: 'delete',
    params: params
  })
}
function getRecordDetail(params) {
  return request({
    url: '/leaseHolders/find',
    method: 'post',
    params: params
  })
}
function saveRecord(params) {
  return request({
    url: '/leaseHolder',
    method: 'put',
    params: params
  })
}
function uploadFile(params) {
  return request({
    url: '/leaseHolders/upload',
    method: 'post',
    data: params
  })
}
function findById(params) {
  return request({
    url: '/tenantry/find',
    method: 'post',
    params: params
  })
}
export {
  getRecordList,
  addRecord,
  deleteRecord,
  getRecordDetail,
  saveRecord,
  uploadFile,
  findById
}
