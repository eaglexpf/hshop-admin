import request from '@/utils/request'

export function apiGoodsCategoryCascadeList(query) {
  return request({
    url: '/goods/category/cascade',
    method: 'get',
    params: query
  })
}
