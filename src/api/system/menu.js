import request from '@/utils/request'

export function apiEnumMenuType() {
  return request({
    url: '/system/auth/menu/enum/menu_type',
    method: 'get'
  })
}

export function apiMenuList(query) {
  return request({
    url: '/system/auth/menu/list',
    method: 'get',
    params: query
  })
}

export function apiMenuCreate(data) {
  return request({
    url: '/system/auth/menu/create',
    method: 'post',
    data
  })
}

export function apiMenuUpdate(filter, params) {
  return request({
    url: '/system/auth/menu/update',
    method: 'post',
    data: {
      filter: filter,
      params: params
    }
  })
}

export function apiMenuDelete(data) {
  return request({
    url: '/system/auth/menu/delete',
    method: 'post',
    data
  })
}
