import request from '@/utils/request'
// 房屋管理初始化查询
export function getAllF(data) {
  return request({
    url: '/housesManage',
    method: 'PATCH',
    data
  })
}
// 删除房屋
export function delHome(params) {
  return request({
    url: '/housesManage/deleteByFind',
    method: 'delete',
    params: params
  })
}
// 确认删除房屋
export function DeleteMapping(params) {
  return request({
    url: ' /housesManage/delete',
    method: 'delete',
    params: params
  })
}
// 新增房屋
export function addHome(data) {
  return request({
    url: '/housesManage',
    method: 'post',
    data
  })
}
// 新增房屋
export function saveHome(data) {
  return request({
    url: '/housesManage',
    method: 'put',
    data
  })
}
// 上传房屋建设图
export function upHome(data) {
  return request({
    url: '/housesManageselect/uploaddrawing',
    method: 'post',
    data
  })
}
// 上传现状图
export function upNow(data) {
  return request({
    url: '/housesManageselect/uploadpresent',
    method: 'post',
    data
  })
}
// 新增模块
export function addHouse(data) {
  return request({
    url: '/housesDetails',
    method: 'post',
    data
  })
}
// 根据id查看房屋信息
export function lookHome(params) {
  return request({
    url: '/housesManageselect',
    method: 'post',
    params: params
  })
}
// 获取房间列表
export function getHome(data) {
  return request({
    url: '/housesDetails',
    method: 'patch',
    data
  })
}
// 模块上传图片
export function houseImg(data) {
  return request({
    url: '/housesManageselect/uploadpresentbody',
    method: 'post',
    data
  })
}
// 删除模块
export function delHouse(params) {
  return request({
    url: '/housesDetails',
    method: 'delete',
    params: params
  })
}
// 根据id查询模块
export function findHouse(params) {
  return request({
    url: '/housesDetailslist/find',
    method: 'post',
    params: params
  })
}
// 编辑模块
export function setHouse(data) {
  return request({
    url: '/housesDetails',
    method: 'put',
    data
  })
}
// 获取类型数据
export function getTypeList(data) {
  return request({
    url: '/leaseHolder',
    method: 'patch',
    data
  })
}
// 获取项目列表
export function getRentList(data) {
  return request({
    url: '/housesManage',
    method: 'patch',
    data
  })
}
// 获取模块列表
export function getmodList(data) {
  return request({
    url: '/housesDetailslist/findkong',
    method: 'post',
    data
  })
}
// 新增意向招租
export function addAtten(data) {
  return request({
    url: '/leaseIntent',
    method: 'post',
    data
  })
}
// 获取意向招租列表
export function getAttenList(data) {
  return request({
    url: '/leaseIntent',
    method: 'patch',
    data
  })
}
// 删除意向招租列表
export function delAttenList(params) {
  return request({
    url: '/leaseIntent',
    method: 'delete',
    params: params
  })
}
// 根据id查询
export function findId(params) {
  return request({
    url: '/leaseIntentlist/find',
    method: 'post',
    params: params
  })
}
// 修改意向招租列表
export function editAttenList(data) {
  return request({
    url: '/leaseIntent',
    method: 'put',
    data
  })
}
// 删除交易凭证
export function fileUtil(params) {
  return request({
    url: '/fileUtil/delete',
    method: 'post',
    params: params
  })
}
// 意向提交交易凭证
export function uploadFile(data) {
  return request({
    url: '/fileUtil/jypz',
    method: 'post',
    data
  })
}
// 意向提交会议纪要
export function hyjy(data) {
  return request({
    url: '/fileUtil/hyjy',
    method: 'post',
    data
  })
}
// 意向获取交易凭证
export function queryFileByID(params) {
  return request({
    url: '/leaseIntentlist/queryFileByID',
    method: 'get',
    params: params
  })
}
// 提交审核:
export function subCheck(data) {
  return request({
    url: 'leaseIntentlist/commit',
    method: 'post',
    data
  })
}
// 提交审核:
export function approval(data) {
  return request({
    url: 'leaseIntentlist/approval',
    method: 'post',
    data
  })
}
// 获取全部抵押信息:
export function mortgage(data) {
  return request({
    url: 'mortgage',
    method: 'patch',
    data
  })
}
// 新增抵押信息:
export function addMortgage(data) {
  return request({
    url: 'mortgage',
    method: 'post',
    data
  })
}
// 新增抵押信息:
export function putMortgage(data) {
  return request({
    url: 'mortgage',
    method: 'put',
    data
  })
}
// 删除抵押信息:
export function delMortgage(params) {
  return request({
    url: 'mortgage',
    method: 'delete',
    params: params
  })
}
// 获取相关合同列表
export function getAllList(data) {
  return request({
    url: 'leasingcontract',
    method: 'patch',
    data
  })
}
// 上传抵押手续
export function diyaupload(data) {
  return request({
    url: 'mortgageupload/uploadaccessory',
    method: 'post',
    data
  })
}
// 删除抵押手续
export function deldiyaupload(params) {
  return request({
    url: 'mortgageupload',
    method: 'delete',
    params: params
  })
}
// 意向招租处理接口
export function leaseintentoperation(data) {
  return request({
    url: 'leaseintentoperation',
    method: 'post',
    data
  })
}
// 获取上级企业部门和本级企业部门
export function getDepart(data) {
  return request({
    url: 'leaseintentoperation',
    method: 'patch',
    data
  })
}
// 获取所有的一级模块
export function housesManageselect(data) {
  return request({
    url: 'housesManageselect',
    method: 'post',
    data
  })
}
// 获取房产相关租赁合同
export function getHomeDepList(data) {
  return request({
    url: '/leasingcontract',
    method: 'patch',
    data
  })
}
// 获取流程房产
export function getHouse(data) {
  return request({
    url: '/evaluation/housePage',
    method: 'post',
    data
  })
}
// 公开编辑获取房产
export function getHouses(data) {
  return request({
    url: '/openLeasess/findHouse',
    method: 'post',
    data
  })
}
// 意向获取房产
export function getxiangHouse(data) {
  return request({
    url: 'leaseIntentlist/findHouse',
    method: 'post',
    data
  })
}
// 意向获取房产
export function leasingcontracts(data) {
  return request({
    url: '/leasingcontract/findPage',
    method: 'post',
    data
  })
}
