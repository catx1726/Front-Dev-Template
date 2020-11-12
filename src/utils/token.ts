import appConfig from '../config'

export const token = {
  set: (s: any) => {
    uni.setStorageSync(appConfig.TOKEN_KEY, s)
  },
  get: () => {
    return uni.getStorageSync(appConfig.TOKEN_KEY)
  },
  clear: () => {
    uni.removeStorageSync(appConfig.TOKEN_KEY)
  }
}
