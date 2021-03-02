import { getToken } from '@/utils/auth'

export default function({ store, route, redirect, req }) {
  // If the user is not authenticated
  const token = getToken()
  const routePath = route.path
  const whiteList = ['/login', 'front/login', '/login/']
  console.log(
    'authenticated token and loggedIn:',
    Boolean(token),
    store.state.user.loggedIn,
    routePath
  )
  if (whiteList.includes(routePath)) {
    // console.log('login 页面不需要检查 token')
    return
  }
  if (!token) {
    // 跳转到登录页面
    // console.log('token 不存在，请先登录')
    return redirect('/login')
  } else {
    return store.dispatch('user/getUserInfo')
  }
}
