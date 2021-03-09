import { USER_INFO_AUTH_KEY } from '../../config'

export const info_auth = {
  set: (open: boolean) => {
    uni.setStorageSync(USER_INFO_AUTH_KEY, open)
  },
  get: () => {
    return uni.getStorageSync(USER_INFO_AUTH_KEY)
  },
  clear: () => {
    uni.removeStorageSync(USER_INFO_AUTH_KEY)
  }
}
