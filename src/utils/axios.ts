/*
 * @Author: 🐱‍🐉cad
 * @Date: 2021-08-17 15:53:01
 * @Last Modified by: 🐱‍🐉cad
 * @Last Modified time: 2022-02-12 14:24:06
 */
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import qs from 'qs'
import { handleAxiosInterceptorRes, handleAxiosInterceptorError } from './error_catch'
import { getToken } from '@/utils/cookies.js'
import { whiteList } from '@/router'

export const axiosTimeout = 60000

let token = getToken(),
  instance = axios.create({
    timeout: axiosTimeout // 1分钟时效
  })

instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // TODO token 处理
    token = getToken()
    console.log('instance.interceptors.request.use :', config)

    if (!config.headers) return config

    if (token) {
      // 判断token是否存在
      config.headers.token = token // 将token设置成请求头
    }

    return handleRequestInterceptor(config, headerQS)
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

    // 检测是否需要走本地校验逻辑，如果是 error_catch 就可以通过此值进行判断，为空或者false则不用(说明报错了)
    if (
      whiteList.needBSAPIList.some((item) => {
        if (response.config.url && item) return response.config.url.includes(item)
      })
    )
      res['needCheckBQ'] = true

    res.httpStatusCode = response.status

    // success
    return handleAxiosInterceptorRes(response, response)
  },
  (error) => {
    console.log('interceptors error :', error.response, error.request, error.message)
    return handleAxiosInterceptorError(error)
  }
)

export default instance

/**
 * @description requestInterceptor handler entry
 * @param {*} config
 * @param {*} method
 * @return {*}
 */
function handleRequestInterceptor(config: AxiosRequestConfig, method: Function):AxiosRequestConfig {
  if (!method || Object.prototype.toString.call(method) !== '[object Function]') return config
  return method(config)
}

/**
 * @description 序列化
 * @param {object} config
 */
function headerQS(config: AxiosRequestConfig) {
  if (!config.url) return config

  const qsConfig = Object.assign(config, {}),
    needQS = whiteList.needQSAPIList.some((item) => {
      if (config.url && item) return config.url.includes(item)
    })

  console.log('needQS', config, needQS, config.url)

  if (!needQS) return config

  qsConfig.headers = { ...config.headers, 'Content-Type': 'application/x-www-form-urlencoded' }

  qsConfig.data = qs.stringify(config.data)

  return qsConfig
}
