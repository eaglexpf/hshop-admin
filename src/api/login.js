import request from '@/utils/request'

export function apiLogin(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function apiUserInfo() {
  return request({
    url: '/info',
    method: 'get'
  })
}

export function apiLogout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
