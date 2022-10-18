/*
 * @Author: 🐱‍🐉cad
 * @Date: 2021-08-17 15:53:01
 * @Last Modified by: 🐱‍🐉cad
 * @Last Modified time: 2022-04-28 14:26:41
 */
import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { Info } from '@/components/info_box'

export const axiosTimeout = 60000

const instance = axios.create({
    baseURL: import.meta.env.VUE_APP_BASE_ROOT,
    timeout: axiosTimeout // 1分钟时效
  }),
  BSValidType = {
    ok: { tag: 'success', code: '00000', text: '业务逻辑正常' },
    no: { tag: 'success', code: 'B0001', text: '服务器出错' }
  },
  ResCodeHandler: any = {
    c_200: {
      msg: '操作成功',
      showAlert: false,
      handler: (response) => {
        console.log('c_200 handler !')
        return Promise.resolve(response)
      }
    },
    c_300: {
      msg: '操作成功',
      showAlert: false,
      handler: (response) => {
        console.log('c_300 handler !')
        return Promise.resolve(response)
      }
    },
    c_400: {
      msg: '您暂无权限访问，请尝试重新登录',
      showAlert: true,
      handler: (response) => {
        console.log('c_400 handler !')
        return Promise.reject(response)
      }
    },
    c_401: {
      msg: '您暂无权限访问，请尝试重新登录',
      showAlert: true,
      handler: (response) => {
        console.log('c_401 handler !')
        return Promise.reject(response)
      }
    },
    c_404: {
      msg: '无效的请求，请稍后再试',
      showAlert: true,
      handler: (response) => {
        console.log('c_404 handler !')
        return Promise.reject(response)
      }
    },
    c_405: {
      msg: '请求方法不能被用于请求相应的资源，请稍后再试',
      showAlert: true,
      handler: (response) => {
        console.log('c_405 handler !')
        return Promise.reject(response)
      }
    },
    c_500: {
      msg: '服务器异常',
      showAlert: false,
      handler: (response) => {
        console.log('c_500 handler !')
        return Promise.reject(response)
      }
    }
  }

instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // TODO token 处理
    if (!config.headers) return config

    return config
  },
  (error) => {
    console.log('instance.interceptors.request.use error:', error)
  }
)

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('interceptors response :', response)

    const res = response.data

    // 如果后端没有返回 code，就直接用 httpStatusCode
    if (!res.code) res.code = response.status

    // success
    return responseInterceptor(response)
  },
  (error) => {
    console.log('interceptors error :', error.response, error.request, error.message)
    return handleAxiosInterceptorError(error)
  }
)

export default instance

/**
 *
 * @description 校验、包装 code
 * @param {string} code
 */
function handleCode(code: string) {
  const errorCodeKeys = Object.keys(ResCodeHandler)
  // 找到对应的handler
  if (errorCodeKeys.some((item) => item === `c_${code}`)) return ResCodeHandler[`c_${code}`]
  // 没找到，向下兼容，拿到首个数字 转换成 c_fStr00
  const fStr = code.split('')[0]
  console.log('handleCode:', fStr)
  return ResCodeHandler[`c_${fStr}00`]
}

function responseInterceptor(ResObj: AxiosResponse) {
  let msg = '',
    handleCodeInfo = handleCode(ResObj.status.toString())
  console.log('responseInterceptor:', ResObj)

  // 存在就说明是后端控制的逻辑报错
  if (ResObj.data['code'] && ResObj.data['code'] !== BSValidType.ok.code) {
    msg = ResObj.data['message']
  }

  // 不存在 code 就说明是类似于 404 之类的非后端控制的报错
  if (!ResObj.data || !ResObj.data['code']) {
    msg = handleCodeInfo.msg
  }

  if (msg) {
    // 加延时是因为有的捕获会跳转页面，这样会丢失弹窗，所以先等跳转后在弹窗
    setTimeout(() => Info({ message: msg, type: 'info', duration: 3000, show: true }), 1000)
    return Promise.reject(msg)
  }

  // 逻辑正常
  return Promise.resolve(ResObj.data)
}

/**
 *
 * @description handle request error
 * @export
 * @param {import('axios').AxiosError} error
 * @param {Array} args
 * @returns {import('axios').AxiosError}
 */
function handleAxiosInterceptorError(error: AxiosError, ...args: Array<any>) {
  console.log('handleAxiosInterceptorError:', error, error.request, error.response, error.message)
  // 未正常发出，抛出让用户自己检查网络
  if (!error.request) {
    setTimeout(() => Info({ message: `请检查网络是否正常`, type: 'info', duration: 3000, show: true }), 1000)
    return Promise.reject(error)
  }

  // 未正常收到响应，抛出服务器异常
  if (!error.response) {
    setTimeout(() => Info({ message: `${ResCodeHandler.c_500.msg}: ${error.message}!`, type: 'info', duration: 3000, show: true }), 1000)
    return Promise.reject(error)
  }

  // 正常接收到响应，抛出服务器返回的信息
  let resData = {
    ...error.response,
    data: {
      message: error.response.data?.message,
      errorMessage: error.response.statusText || error.message
    }
  }

  return responseInterceptor(resData)
}
