import request from '@/utils/request'
// 查询一级菜单
export function getAllF(params) {
  return request({
    url: '/firm/findAutoCodeFirm',
    method: 'get',
    params: params
  })
}
// 添加二级菜单
export function addSecond(data) {
  return request({
    url: '/aPPmeu',
    method: 'post',
    data
  })
}
// 获取初始化列表
export function getSList(data) {
  return request({
    url: '/firm/getFirmList',
    method: 'post',
    data
  })
}
// 编辑二级菜单
export function editSList(data) {
  return request({
    url: '/aPPmeu',
    method: 'put',
    data
  })
}
// 删除
export function delSList(params) {
  return request({
    url: '/dictionary/deleteDictionary',
    method: 'get',
    params: params
  })
}
// 批量删除
export function delSome(params) {
  return request({
    url: '/dictionary/deleteDictionaryAll',
    method: 'get',
    params: params
  })
}
// 上传图片
export function uploadFile(data) {
  return request({
    url: '/fileupload/file',
    method: 'post',
    data
  })
}
// 删除上传图片
export function delUploadFile(params) {
  return request({
    url: '/fileupload',
    method: 'delete',
    params: params
  })
}
// 获取字典界面左侧数据
export function getAllleft(data) {
  return request({
    url: '/dictionary/findDictionaryBySelectAgg',
    method: 'post',
    data
  })
}
// 新增以及字典
export function addFirst(data) {
  return request({
    url: '/dictionary/saveDictionaryOne',
    method: 'post',
    data
  })
}
// 新增二级字典
export function saveDictionaryTwo(data) {
  return request({
    url: '/dictionary/saveDictionaryTwo',
    method: 'post',
    data
  })
}
// 组织机构管理获取左侧树形图
export function findAutoCodeFirm(params) {
  return request({
    url: '/firm/findAutoCodeFirm',
    method: 'get',
    params: params
  })
}
// 组织机构初始化列表
export function getFirmList(data) {
  return request({
    url: '/firm/getFirmList',
    method: 'post',
    data
  })
}
// 新增父组织机构
export function saveOneFirm(data) {
  return request({
    url: '/firm/saveOneFirm',
    method: 'post',
    data
  })
}
// 删除组织机构
export function deleteFirm(params) {
  return request({
    url: '/firm/deleteFirm',
    method: 'get',
    params: params
  })
}
// 修改菜单
export function prowSave(data) {
  return request({
    url: '/power',
    method: 'put',
    data
  })
}
// 新增菜单
export function prowAdd(data) {
  return request({
    url: '/power/save',
    method: 'post',
    data
  })
}
// 菜单管理初始化查询
export function getById(data) {
  return request({
    url: '/power/select',
    method: 'post',
    data
  })
}
export function getById1(data) {
  return request({
    url: '/power/select1',
    method: 'post',
    data
  })
}
export function getAuthorizedById(data) {
  return request({
    url: '/power/select2',
    method: 'post',
    data
  })
}
// 上传菜单图标
export function fileupload(data) {
  return request({
    url: '/fileupload',
    method: 'post',
    data
  })
}
// 删除菜单
export function delOne(params) {
  return request({
    url: '/power/delete',
    method: 'delete',
    params: params
  })
}
// 组织加载树形根节点
export function getTree(params) {
  return request({
    url: '/firm/selectsuper',
    method: 'post',
    params: params
  })
}
// 组织加载下级节点
export function getTreeLower(data) {
  return request({
    url: '/firm/findAutoCodeallFirm',
    method: 'post',
    data
  })
}
// 菜单加载树形根节点
export function getMTree(data) {
  return request({
    url: '/power/selectsuper',
    method: 'post',
    data
  })
}
// 修改字典状态
export function updateDictionaryState(params) {
  return request({
    url: '/dictionary/updateDictionaryState',
    method: 'get',
    params: params
  })
}
// 获取打卡列表
export function getPunkList(data) {
  return request({
    url: '/punchCardRecord/findBySelectAgg',
    method: 'post',
    data
  })
}
export function getOutList(data) {
  return request({
    url: '/registration/getRegister',
    method: 'post',
    data
  })
}
// 获取门卫体温信息
export function getGuardList(data) {
  return request({
    url: '/guard/getPageList',
    method: 'post',
    data
  })
}
// 获取未录入列表
export function getNList(data) {
  return request({
    url: '/appuserFirm/findUserList',
    method: 'post',
    data
  })
}
// 文件上传
export function upData(data) {
  return request({
    url: '/firm/importFirm',
    method: 'post',
    data
  })
}