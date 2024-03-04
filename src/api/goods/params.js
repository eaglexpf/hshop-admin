import request from '@/utils/request'

export function apiGoodsParamsList(query) {
  return request({
    url: '/goods/params/list',
    method: 'get',
    params: query
  })
}

export function apiGoodsParamsCreate(data) {
  return request({
    url: '/goods/params/create',
    method: 'post',
    data
  })
}

export function apiGoodsParamsUpdate(filter, data) {
  return request({
    url: '/goods/params/update',
    method: 'post',
    data: {
      filter: filter,
      params: data
    }
  })
}
