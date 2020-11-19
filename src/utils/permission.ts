import { token } from './token'
import store from '@/store/index'
import { popToast } from '@/utils/uni_pop'

export function userAuthNeedLogin() {
  if (!token.get() || !store.state.user.token || !store.state.user.name) {
    popToast({ title: '请先登录', icon: 'none' })
    return false
  }

  return true
}
