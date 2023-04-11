import request from '@/utils/request'

export function apiExportDownload(params) {
  return request({
    url: '/system/export/download',
    method: 'post',
    data: params
  })
}

export function apiExportTypeList(query) {
  return request({
    url: '/system/export/type/list',
    method: 'get',
    params: query
  })
}

export function apiExportLogList(query) {
  return request({
    url: '/system/export/log/list',
    method: 'get',
    params: query
  })
}
