import request from '@/utils/request'

export function apiRoleList(query) {
  return request({
    url: '/system/auth/role/list',
    method: 'get',
    params: query
  })
}

export function apiRoleCreate(data) {
  return request({
    url: '/system/auth/role/create',
    method: 'post',
    data
  })
}

export function apiRoleUpdate(filter, data) {
  return request({
    url: '/system/auth/role/update',
    method: 'post',
    data: {
      filter: filter,
      params: data
    }
  })
}

export function apiRoleDelete(data) {
  return request({
    url: '/system/auth/role/delete',
    method: 'delete',
    data
  })
}
