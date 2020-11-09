import request from '@/utils/request'
export function getLogList(data) {
  return request({
    url: '/logRecord',
    method: 'patch',
    data: data
  })
}
