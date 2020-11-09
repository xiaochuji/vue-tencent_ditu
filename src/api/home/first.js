import request from '@/utils/request'
// 添加一级菜单
export function addFirst(data) {
  return request({
    url: '/user/saveUser',
    method: 'post',
    data
  })
}
// 初始化菜单列表
export function getList(data) {
  return request({
    url: 'user/findUserBySelectAgg',
    method: 'post',
    data
  })
}
// 菜单授权
export function update(data) {
  return request({
    url: 'role/update1',
    method: 'put',
    data
  })
}
// 编辑
export function editList(data) {
  return request({
    url: '/aPPmeu',
    method: 'put',
    data
  })
}
// 删除
export function delList(params) {
  return request({
    url: '/user/deleteUser',
    method: 'get',
    params: params
  })
}
// 获取所有企业
export function getAlldepart(data) {
  return request({
    url: '/firm/findAutoCodeallFirm2',
    method: 'post',
    data
  })
}
// 初始化密码
export function resetPass(params) {
  return request({
    url: '/user/updateUserPassword',
    method: 'get',
    params: params
  })
}
// 获取角色列表
export function findRole(data) {
  return request({
    url: '/role/findRole',
    method: 'post',
    data
  })
}
// 修改用户状态
export function setuserState(params) {
  return request({
    url: 'appuserFirm/relieve',
    method: 'post',
    params: params
  })
}
// 新增角色
export function saveRole(data) {
  return request({
    url: '/role/saveRole',
    method: 'post',
    data
  })
}
// 删除角色deleteRole
export function deleteRole(params) {
  return request({
    url: '/role/deleteRole',
    method: 'DELETE',
    params: params
  })
}
// 角色管理二级
export function getById(data) {
  return request({
    url: '/user/selectRosefeny',
    method: 'post',
    data
  })
}
// 角色管理授权
export function authorize(data) {
  return request({
    url: '/user/insertuser_roles',
    method: 'post',
    data
  })
}
// 角色管理移除授权
export function deleteuser(data) {
  return request({
    url: '/user/deleteuser_roles',
    method: 'post',
    data
  })
}
// 角色管理获取菜单
export function treeList(data) {
  return request({
    url: '/power/select',
    method: 'post',
    data
  })
}
// 财务管理菜单
export function caiwu(data) {
  return request({
    url: 'rentManagementEntity',
    method: 'patch',
    data
  })
}
// 获取小程序用户列表
export function getUserList(data) {
  return request({
    url: '/appuserFirm/findListPage',
    method: 'post',
    data
  })
}
// 判断该部门下是否有数据
export function isgetAllExcelRecord(params) {
  return request({
    url: '/appuserFirm/isgetAllExcelRecord',
    method: 'get',
    params: params
  })
}

// 查询定位列表
export function sysLocationCheck(data) {
  return request({
    url: 'sysLocationCheck',
    method: 'POST',
    data
  })
}
// 查询打卡清空
export function cardCount(params) {
  return request({
    url: '/punchCardRecord/cardCount',
    method: 'get',
    params: params
  })
}

// 修改密码
export function setPass(params) {
  return request({
    url: '/user/updateUserPassword1',
    method: 'post',
    params: params
  })
}
// 员工信息导入
export function upDataFn(data) {
  return request({
    url: '/user/importUser',
    method: 'post',
    data
  })
}
