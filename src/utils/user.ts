import appConfig from '../config'

export const user = {
  set: (s: any) => {
    uni.setStorageSync(appConfig.USER_ID_KEY, s)
  },
  get: () => {
    return uni.getStorageSync(appConfig.USER_ID_KEY)
  },
  clear: () => {
    uni.removeStorageSync(appConfig.USER_ID_KEY)
  }
}
