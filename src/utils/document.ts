import { RouteLocationNormalized } from 'vue-router'

/**
 *
 * @description 在 路由守卫 中设定浏览器 tab 标题时调用
 * @export
 * @param {object} to
 * @return {string}
 */
export function getPageTitle(to: RouteLocationNormalized): string | undefined | boolean {
  const suffix = import.meta.env.VITE_PG_TITLE
  if (to && to.meta && to.meta.title) return `${to.meta.title}-${suffix}`
  return suffix || ''
}

/**
 *
 * @description 拿到浏览器的名称及其版本
 * @export
 * @return {{name,version}}
 */
export function getBrowserVersionAndName() {
  let ua = navigator.userAgent,
    tem,
    M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || []
    return { name: 'IE', version: tem[1] || '' }
  }
  if (M[1] === 'Chrome') {
    tem = ua.match(/\bOPR|Edge\/(\d+)/)
    if (tem != null) {
      return { name: 'Opera', version: tem[1] }
    }
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?']
  if ((tem = ua.match(/version\/(\d+)/i)) != null) {
    M.splice(1, 1, tem[1])
  }
  return {
    name: M[0].toLowerCase(),
    version: M[1]
  }
}

/**
 *
 * @description = =
 * @export
 * @return {*}
 */
export function checkBrowserVersion() {}

/**
 *
 * @description blobURL get a real blob
 * @example blobURl:blob:https://localhost....
 * @export
 * @param {*} blobURL
 * @return {*}
 */
export async function blobURLgetFile(blobURL: string) {
  // do a request to the blob uri
  const response = await fetch(blobURL),
    // response has a method called .blob() to get the blob file
    file = await response.blob()
  return file
}

/**
 *
 * @description blob => base65-1 =-=
 * @param {*} blob
 * @return {*}
 */
export function getBase64(blob: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.readAsDataURL(blob)

    reader.onload = () => resolve(reader.result)

    reader.onerror = (error) => reject(error)
  })
}

// TODO 可优化，下面很多方法是废弃的
/**
 *
 * @description base65-1 => blob
 * @param {*} base64Data
 * @return {*}
 */
export function dataURLtoBlob(base64Data: string) {
  // 判断是否是 dataURL，以 data: 开头，是则是0，非0则不是
  if (base64Data.indexOf('data:')) return false

  let byteString

  if (base64Data.split(',')[0].indexOf('base64') >= 0) {
    byteString = atob(base64Data.split(',')[1])
  } else {
    byteString = unescape(base64Data.split(',')[1])
  }

  const mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0],
    ia = new Uint8Array(byteString.length)

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }

  const blob = new Blob([ia], {
    type: mimeString
  })

  return blob
}

/**
 *
 * @description 创建 canvas 实例
 * @export
 * @return {*}
 */
export function createCanvas() {
  const canvas = document.createElement('canvas'),
    context = canvas.getContext('2d')
  return { cas: canvas, ctx: context }
}

/**
 *
 * @description 拿到宽高比例
 * @export
 * @param {*} width
 * @param {*} height
 * @param {*} [maxLength=1080]
 * @return {*}
 */
export function getResizeScale(width: number, height: number, maxLength = 1080) {
  const x = width > height ? width : height
  return x > maxLength ? maxLength / x : 1
}

/**
 *
 * @description 压缩图片：传入 base64，找到最长边，缩放到指定的长度，按比例缩放剩下边，创建 canvas ，根据 quality 进行压缩
 * @export
 * @param {*} imgURL
 * @param {*} quality
 * @param {*} maxLength
 * @return {*}
 */
export function customPhotoCompress(imgURL: string, quality: string | number, maxLength: number) {
  const { cas, ctx } = createCanvas(),
    imgInstance = new Image()

  imgInstance.src = imgURL

  return new Promise((resolve, reject) => {
    imgInstance.onload = function () {
      let { height, width } = imgInstance,
        compressedBase64 = null
      const scale = +getResizeScale(width, height, maxLength)

      height = height * scale
      width = width * scale

      imgInstance.height = height
      imgInstance.width = width
      cas.height = height
      cas.width = width

      if (!ctx) return false

      ctx.clearRect(0, 0, cas.width, cas.height)
      ctx.drawImage(imgInstance, 0, 0, cas.width, cas.height)
      compressedBase64 = cas.toDataURL('image/jpeg', quality)

      resolve({ url: compressedBase64, size: computeBase64Size(compressedBase64) })
    }
  })
}

/**
 *
 * @description 计算 base64 大小
 * @export
 * @param {*} base64
 * @return {*}
 */
export function computeBase64Size(base64: string) {
  // REF:https://stackoverflow.com/questions/53228948/how-to-get-image-file-size-from-base-64-string-in-javascript
  const equalIndex = base64.indexOf('='),
    headerLen = base64.indexOf(',')
  let baseStrLen = base64.slice(headerLen, equalIndex).length

  equalIndex === -1 ? baseStrLen++ : ''
  return baseStrLen * (3 / 4)
}
