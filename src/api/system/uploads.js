import request from '@/utils/request'

export const apiCreateUploadsImage = '/system/uploads/image/upload'

export function apiUploadsImageList(query) {
  return request({
    url: '/system/uploads/image/list',
    method: 'get',
    params: query
  })
}

export function apiDeleteUploadsImage(data) {
  return request({
    url: '/system/uploads/image/delete',
    method: 'post',
    data: data
  })
}

export function apiUploadImages(file) {
  const fmData = new FormData()
  fmData.append('upload', file)
  return request({
    url: apiCreateUploadsImage,
    method: 'post',
    data: fmData
  })
}
