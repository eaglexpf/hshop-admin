import request from '@/utils/request'

export function apiRequestEnumMethod() {
  return request({
    url: '/third-party/request-log/enum/method',
    method: 'get'
  })
}

export function apiRequestEnumStatus() {
  return request({
    url: '/third-party/request-log/enum/status',
    method: 'get'
  })
}

export function apiRequestEnumStatusCode() {
  return request({
    url: '/third-party/request-log/enum/status_code',
    method: 'get'
  })
}

export function apiRequestLogList(query) {
  return request({
    url: '/third-party/request-log/list',
    method: 'get',
    params: query
  })
}
