import request from '@/utils/request'

export function apiDownloadUploadTemplate(params) {
  return request({
    url: '/system/uploads/csv/template/download',
    method: 'post',
    data: params
  })
}

export function apiUploadCsv(params, file) {
  const fmData = new FormData()
  fmData.append('upload', file)
  for (const key in params) {
    fmData.append(key, params[key])
  }
  return request({
    url: '/system/uploads/csv/upload',
    method: 'post',
    data: fmData
  })
}

export function apiUploadLists(query) {
  return request({
    url: '/system/uploads/csv/list',
    method: 'get',
    params: query
  })
}

export function apiDownloadUploadErrorFile(params) {
  return request({
    url: '/system/uploads/csv/export/error',
    method: 'post',
    data: params
  })
}
