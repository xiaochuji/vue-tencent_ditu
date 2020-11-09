import request, { baseUrl } from '@/utils/request'
export const uploadPath = baseUrl + '/tenantry/card'
export function sendCode(params) {
  return request({
    url: '/tenantry/sms?tel=' + params.tel,
    method: 'post'
    // data: params
  })
}
export function registerPer(params) {
  return request({
    url: '/tenantry',
    method: 'post',
    data: params
  })
}
