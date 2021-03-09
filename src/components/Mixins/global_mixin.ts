import Vue from 'vue'
import { userRuleShowPage } from '@/utils/permission'
import { popToast } from '@/utils/uni_pop'

const CONSOLE_TAG = 'Components Mixins global_mixin'

/* 
  OK
  这边可以简单配置一下路由守卫，前提是不做H5端
  那么所有的路由应该都是通过下列方法进行跳转 
*/

export default Vue.mixin({
  methods: {
    red: (url: string) => {
      console.log(`${CONSOLE_TAG} red:`, url)
      if (!userRuleShowPage(url)) {
        popToast({ title: '无权限', icon: 'none' })
        return
      }
      uni.redirectTo({
        url: url
      })
    },
    nav: (url: string) => {
      console.log(`${CONSOLE_TAG} nav:`, url)
      if (!userRuleShowPage(url)) {
        popToast({ title: '无权限', icon: 'none' })
        return
      }
      uni.navigateTo({
        url: url
      })
    },
    back: () => {
      uni.navigateBack({
        delta: 1
      })
    },
    swi: (url: string) => {
      console.log(`${CONSOLE_TAG} swi:`, url)
      uni.switchTab({
        url: url
      })
    }
  }
})
