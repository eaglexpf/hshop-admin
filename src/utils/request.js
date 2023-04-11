import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'Bear ' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 0) {
      checkError(res)
    }
    return res
  },
  error => {
    console.log('err' + error) // for debug
    // 40101: Token expired; 40102: Token error;
    if (error.response.status === 200 && error.response.data.code !== 0) {
      // to re-login
      checkError(error.response.data)
    } else {
      Message({
        // message: error.message,
        message: error.response.data.msg || error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

function checkError(response) {
  if (response.code === 401 || response.code === 40101 || response.code === 40102) {
    // to re-login
    MessageBox.confirm(response.msg || 'Error', '登录异常', {
      confirmButtonText: '确认',
      showCancelButton: false,
      showClose: false,
      closeOnClickModal: false,
      type: 'warning'
    }).then(() => {
      store.dispatch('user/resetToken').then(() => {
        location.reload()
      })
    })
  } else {
    Message({
      // message: error.message,
      message: response.msg || 'Error',
      type: 'error',
      duration: 5 * 1000
    })
  }
}

export default service
