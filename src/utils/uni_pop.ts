/* 
  封装理由
  *. 后期可以做错误收集
  *. 统一处理 fail 和 success
 */

import { popLoadingInfoTypes, popModalInfoTypes, popSheetInfoTypes, popToastInfoTypes, popTypes } from '@/model/uni-pop'

export function popToast(info: popToastInfoTypes = { title: '提示', icon: 'none', duration: 2000, mask: true }) {
  uni.showToast({
    ...info,
    success(res) {
      console.log('popToast sucess!', res)
    },
    fail(error) {
      console.warn('popToast faild', error)
    },
    complete() {
      console.log('popToast complete!')
    }
  })
}
export function popLoading(info: popLoadingInfoTypes = { title: '加载中', mask: true }) {}

export function popModal(
  info: popModalInfoTypes = {
    title: '弹窗',
    content: '是否发生了什么，您需要仔细斟酌',
    showCancel: true,
    cancelText: '取消',
    confirmText: '确定'
  }
) {
  // TODO
}

export function popSheet(info: popSheetInfoTypes) {
  // TODO
}

const pop = {
  popToast,
  popLoading,
  popModal,
  popSheet
}

export default pop
