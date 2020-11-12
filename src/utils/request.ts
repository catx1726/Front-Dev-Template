import appConfig from '../config'
import { token } from './token'

const send = (
  url: string,
  data = {},
  method: any = 'GET',
  showLoading: boolean = true,
  base_url = ''
) => {
  uni.showLoading({
    title: '加载中'
  })
  return new Promise((resolve) => {
    uni.request({
      method,
      url: (base_url ? base_url : appConfig.BASE_URL) + url,
      data: data,
      header: (() => {
        const tokeValue = token.get()
        let config: any = {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
        if (tokeValue) {
          config[appConfig.TOKEN_KEY] = tokeValue
        }
        return config
      })(),
      success: (res) => {
        uni.hideLoading()
        resolve(res.data)
      }
    })
  })
}

export const request = {
  get: (url: string, data: {} | undefined) => {
    return send(url, data, 'GET')
  },
  post: (url: string, data: {} | undefined) => {
    return send(url, data, 'POST')
  }
}
