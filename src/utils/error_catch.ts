/*
 * @Author: 🐱‍🐉cad
 * @Date: 2021-08-17 15:18:04
 * @Last Modified by: 🐱‍🐉cad
 * @Last Modified time: 2022-02-12 14:15:34
 * @Des 下面的逻辑，都可交由 sentry bugsnag 进行监控，也可以自己实现
 */

import { G_UI } from '@/main'
import router from '@/router'
import { AxiosError, AxiosResponse } from 'axios'
import { axiosTimeout } from './axios'
import { removeToken } from './cookies'

let globalLoading: boolean
const ResCodeHandler: { [key: string]: { msg: string; showAlert: boolean; handler: Function } } = {
    c_200: {
      msg: '操作成功',
      showAlert: false,
      handler: (response: AxiosResponse) => {
        console.log('c_200 handler !')
        return Promise.resolve(response)
      }
    },
    c_300: {
      msg: '操作成功',
      showAlert: false,
      handler: (response: AxiosResponse) => {
        console.log('c_300 handler !')
        return Promise.resolve(response)
      }
    },
    c_400: {
      msg: '您暂无权限访问，请尝试重新登录',
      showAlert: true,
      handler: (response: AxiosResponse) => {
        console.log('c_400 handler !')
        return Promise.reject(response)
      }
    },
    c_401: {
      msg: '您暂无权限访问，请尝试重新登录',
      showAlert: true,
      handler: (response: AxiosResponse) => {
        console.log('c_401 handler !')
        router.push({ path: '/login' })
        removeToken()
        return Promise.reject(response)
      }
    },
    c_404: {
      msg: '无效的请求，请稍后再试',
      showAlert: true,
      handler: (response: AxiosResponse) => {
        console.log('c_404 handler !')
        return Promise.reject(response)
      }
    },
    c_405: {
      msg: '请求方法不能被用于请求相应的资源，请稍后再试',
      showAlert: true,
      handler: (response: AxiosResponse) => {
        console.log('c_405 handler !')
        return Promise.reject(response)
      }
    },
    c_500: {
      msg: '服务器异常',
      showAlert: false,
      handler: (response: AxiosResponse) => {
        console.log('c_500 handler !')
        return Promise.reject(response)
      }
    }
  },
  BSValidType = { ok: { tag: 'success', code: '00000', text: '业务逻辑正常' } }

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

/**
 *
 * @description handle response
 * @export
 * @param {import('axios').AxiosResponse} response
 * @param {object} args
 * @return {import('axios').AxiosResponse}
 */
export function handleAxiosInterceptorRes(response: AxiosResponse, ...args: Array<any>) {
  let res = response.data
  console.log('handleAxiosInterceptorRes:', res, response)

  // eslint-disable-next-line prefer-const
  let { httpStatusCode, code, message, errorMessage, needCheckBQ } = res

  // 依次装配、检查 code、msg
  const { showAlert, handler, msg: handlerMsg } = handleCode(httpStatusCode.toString())

  // 如果后端有 msg，没有就用本地的，本地匹配不上就用请求自带的英文 text
  message = message || handlerMsg || errorMessage

  // 这里如果调用了其他厂商的API并且存在 code，就会出现问题，code 很可能不会为 00000，最好的办法是根据域名来判断是否需要走业务逻辑
  // 如果 code !== '00000' 并且 needCheckBQ 存在为 true 意味着业务出错，因为业务逻辑都是基于 httpStatusCode 200
  if (needCheckBQ && code && code !== BSValidType.ok.code) {
    // G_UI.$message({ type: 'info', message: message })
    return Promise.reject(response)
  }

  // 显示提示
  showAlert ? console.log('message:', message) : ''
  // showAlert ? G_UI.$message({ type: 'info', message: message }) : ''

  // 在一定时效之后，关闭 loading
  // setTimeout(() => {
  //   if (!globalLoading) globalLoading = G_UI.$loading()
  //   globalLoading.close()
  // }, axiosTimeout)

  // TODO handler中 处理上报、跳转页面 ...
  return handler(response)
}

/**
 *
 * @description handle request error
 * @export
 * @param {import('axios').AxiosError} error
 * @param {Array} args
 * @returns {import('axios').AxiosError}
 */
export function handleAxiosInterceptorError(error: AxiosError, ...args: Array<any>) {
  console.log('handleAxiosInterceptorError:', error, error.request, error.response, error.message)
  // 未正常发出，抛出让用户自己检查网络
  if (!error.request) {
    // G_UI.$message({ type: 'info', message: '请检查网络是否正常' })
    return Promise.reject(error)
  }

  // 未正常收到响应，抛出服务器异常
  if (!error.response) {
    // G_UI.$message({ type: 'info', message: `${ResCodeHandler.c_500.msg}: ${error.message}!` })
    return Promise.reject(error)
  }

  // 正常接收到响应，抛出服务器返回的信息
  let resData = {
    ...error.response,
    data: {
      message: error.response.data.message,
      httpStatusCode: error.response.status,
      errorMessage: error.response.statusText || error.message
    }
  }

  return handleAxiosInterceptorRes(resData)
}
