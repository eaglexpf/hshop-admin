import request from '@/utils/request'

export function apiEnumDriver() {
  return request({
    url: '/system/wechat/setting/enum/driver',
    method: 'get'
  })
}

export function apiWechatList() {
  return request({
    url: '/system/wechat/setting/list',
    method: 'get'
  })
}

export function apiWechatCreate(data) {
  return request({
    url: '/system/wechat/setting/create',
    method: 'post',
    data
  })
}

export function apiWechatUpdate(filter, data) {
  return request({
    url: '/system/wechat/setting/update',
    method: 'post',
    data: {
      filter: filter,
      params: data
    }
  })
}

export function apiWechatDelete(data) {
  return request({
    url: '/system/wechat/setting/delete',
    method: 'post',
    data
  })
}
