import request from '@/utils/request'

export function apiBackendLogList(query) {
  return request({
    url: '/system/operation_log/list',
    method: 'get',
    params: query
  })
}
