import { token } from './token'
import store from '@/store/index'
import { popToast } from '@/utils/uni_pop'

export function userAuthNeedLogin() {
  if (token.get()) {
    if (!store.state.user.name || !store.state.user.token) {
      store.dispatch('user/getInfo')
    }
    return true
  }

  popToast({ title: '请先登录', icon: 'none' })
  return false
}
