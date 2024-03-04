import request from '@/utils/request'

export function apiGoodsSpuInfo(query) {
  return request({
    url: '/goods/spu/info',
    method: 'get',
    params: query
  })
}

export function apiGoodsSpuList(query) {
  return request({
    url: '/goods/spu/list',
    method: 'get',
    params: query
  })
}

export function apiGoodsSpuCreate(data) {
  return request({
    url: '/goods/spu/create',
    method: 'post',
    data
  })
}

export function apiGoodsSpuUpdate(filter, data) {
  return request({
    url: '/goods/spu/update',
    method: 'post',
    data: {
      filter: filter,
      params: data
    }
  })
}

export function apiGoodsSpuUpdateSome(filter, data) {
  return request({
    url: '/goods/spu/update_some',
    method: 'post',
    data: {
      filter: filter,
      params: data
    }
  })
}

export function apiGoodsSpuDelete(data) {
  return request({
    url: '/goods/spu/delete',
    method: 'post',
    data
  })
}
