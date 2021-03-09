import appConfig from '../config'
import { token } from './storage/token'
import cpop from './uni_pop'

const send = (
  url: string,
  data = {},
  method: any = 'GET',
  showLoading: boolean = true,
  base_url = appConfig.BASE_URL
) => {
  uni.showLoading({
    title: '加载中'
  })
  return new Promise((resolve, reject) => {
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
        /* 
          写在这里是因为，
          后端请求均是返回 200，
          通过 ErrorCode 来判断成功失败 
        */
        uni.hideLoading()
        handleError(res.data)
        resolve(res.data)
      },
      fail: (err) => {
        uni.hideLoading()
        reject(err)
      }
    })
  })
}

export const request = {
  get: (url: string, data?: {} | undefined): any => {
    return send(url, data, 'GET')
  },
  post: (url: string, data?: {} | undefined): any => {
    return send(url, data, 'POST')
  },
  put: (url: string, data?: {} | undefined): any => {
    return send(url, data, 'PUT')
  }
}

function handleError(ResObj: { ErrorCode: number; Info: Object | string } | any) {
  if (ResObj.ErrorCode === -1) {
    // 没错，放过，但是后续可以在这里处理成功请求
    return
  }
  if (ResObj.Info) {
    // 有错，瘦死
    let msg: any =
      Object.prototype.toString.call(ResObj.Info) === '[object Object]' ? '发生错误' : ResObj.Info || '操作失败'
    cpop.popToast({ title: msg, icon: 'none' })
  }
  return
}
