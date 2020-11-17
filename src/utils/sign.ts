import appConfig from '../config'

export const sign = {
  set: (info = { time: '', signed: true }) => {
    uni.setStorageSync(appConfig.SIGN_TIME_KEY, info.time)
    uni.setStorageSync(appConfig.SIGN_TAG_KEY, info.signed)
  },
  get: () => {
    return { time: uni.getStorageSync(appConfig.SIGN_TIME_KEY), signed: uni.getStorageSync(appConfig.SIGN_TAG_KEY) }
  },
  clear: () => {
    uni.removeStorageSync(appConfig.SIGN_TAG_KEY)
    uni.removeStorageSync(appConfig.SIGN_TIME_KEY)
  }
}
