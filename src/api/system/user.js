import request from '@/utils/request'

export function apiUserList() {
  return request({
    url: '/system/auth/user/list',
    method: 'get'
  })
}

export function apiUserCreate(data) {
  return request({
    url: '/system/auth/user/create',
    method: 'post',
    data
  })
}

export function apiUserUpdate(filter, data) {
  return request({
    url: '/system/auth/user/update',
    method: 'post',
    data: {
      filter: filter,
      params: data
    }
  })
}

export function apiUserDelete(data) {
  return request({
    url: '/system/auth/user/delete',
    method: 'post',
    data
  })
}
