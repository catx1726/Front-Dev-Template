import { token } from './storage/token'
import store from '@/store/index'
import { popToast } from '@/utils/uni_pop'
import { info_auth } from './storage/info_auth'
import { user } from './storage/user'
import Pages from '@/utils/pages_info'
import { PageRuleEnum } from '@/model/page-rule'

/* 用户手动给予授权 */
export function userGavePublicInfo() {
  return new Promise<UniApp.UserInfo>((resolve, reject) => {
    userPublicInfo()
      .then((res) => {
        resolve(res)
      })
      .catch((res) => {
        reject(userPublicInfo())
      })
  })
}

/* 
  获取用户公开的信息，如 name / city / gender / province / avatar 
  这里有个问题，就是用户拒绝了授权之后，不会再弹出授权框，所以需要一个手动授权
*/
export function userPublicInfo(this: any) {
  let that = this
  return new Promise<UniApp.UserInfo>((resolve, reject) => {
    uni.getUserInfo({
      success: (res) => {
        /* 
          DES 
          为什么不在这里直接写入 store 和 localstorage 
          因为之前的所有逻辑，都是卸载 user.store.login 中，在这里写会很乱 🎅
        */
        let userInfo: UniApp.UserInfo = res.userInfo
        console.log('permission userPublicInfo success:', userInfo)
        /* 
          如果用户再自己点击了授权按钮之后，以后每次拿信息就不用弹窗了
          不过我们需要监听如果拿去信息失败，那么就要跳转到授权页面让用户重新点击按钮进行授权
         */
        store.dispatch('user/setInfoAuth', true)
        resolve(userInfo)
      },
      fail: () => {
        store.dispatch('user/setInfoAuth', false)
        popToast({ title: '请给予授权', icon: 'none' })
        console.log('permission userPublicInfo fail!')
        reject(false)
      }
    })
  })
}

/* 
  获取用户相对小程序的唯一值，需要后端去请求微信服务器，这里只是返回了一个 code 
  通过这个 code 去调取后端请求，拿到 uniID 
*/
export function userPrivateInfoByApp() {
  return new Promise<UniApp.LoginRes>((resolve, reject) => {
    uni.login({
      success: (res) => {
        let userInfo = res
        console.log('permission userPrivateInfoByApp success:', userInfo)
        info_auth.set(true)
        resolve(userInfo)
      },
      fail: () => {
        info_auth.set(false)
        popToast({ title: '发生错误', icon: 'none' })
        console.log('permission userPrivateInfoByApp fail!')
        reject(false)
      }
    })
  })
}

export async function userAuthNeedLogin() {
  if (token.get()) {
    let info = await store.dispatch('user/getInfo')
    console.log('permission userAuthNeedLogin info:', info)
    if (!(info.id && info.openId && info.userName)) {
      popToast({ title: '请先登录', icon: 'none' })
      return false
    }
    return true
  }

  // 无 token
  popToast({ title: '请先登录', icon: 'none' })
  return false
}

/* 
  检测用户是否注册
 */
export function userRegisterCheck() {
  return new Promise<any | boolean>((resolve, reject) => {
    uni.login({
      success: function (res) {
        /* 
        TODO 少接口 
        向后端发起请求，后端判断是否在数据库中已经有该用户，将 res.code 传给后端 
        */
        console.log('login test:', res)
        resolve(false)
      },
      fail: () => {
        popToast({ title: '发生错误', icon: 'none' })
        console.log('permission userRegisterCheck fail!')
        reject(false)
      }
    })
  })
}

/**
 *
 * @description 配合 v-show 或者 v-if 使用该方法，传入元素指定的权限与当前用户的权限作比较
 * @export
 * @param {Array<string>} ruleListt
 * @returns Boolean
 */
export function userRuleShowElement(ruleList: Array<string>) {
  try {
    let userRule = user.get().rule
    console.log('permission userRuleShowElement userRule:', userRule, 'send ruleList:', ruleList)
    // 没有登录导致权限没有记录
    if (userRule === null || userRule === undefined) {
      popToast({ title: '无权限记录', icon: 'none' })
      return
    }
    return ruleList.includes(userRule)
  } catch (error) {
    popToast({ title: '发生错误', icon: 'none' })
    console.log('permission userRuleShowElement error:', error)
  }
}

/**
 * @description 在 nav 和 red 部分进行判断用户是否有权限跳转
 * @export
 * @param {Array<string>} ruleList
 * @returns Boolean
 */
export function userRuleShowPage(url: string) {
  try {
    let userRule = PageRuleEnum[user.get().rule]
    let curPage: any = Pages.Pages.find((i: any) => i.path === url)
    console.log('permission userRuleShowPage userRule:', userRule, 'Pages:', Pages, curPage)
    // 白名单界面(公开界面，不需要检验权限)
    if (curPage.public) return true

    // 没有登录导致权限没有记录
    if (userRule === null || userRule === undefined) {
      popToast({ title: '无权限记录', icon: 'none' })
      return
    }
    return curPage.rule.includes(userRule)
  } catch (error) {
    popToast({ title: '发生错误', icon: 'none' })
    console.log('permission userRuleShowPage error:', error)
  }
}
