/**
 * @description 当用户关注了微信公众号，可以直接通过 js_code 直接拿到用户相对于小程序的唯一值 🐱
 */
export const getUniID_API = '/Lottery/WxLogin'

/**
 * @todo
 * @description 用户没有关注公众号，需要通过授权，然后拿到密钥，去后端解密出唯一值 🐱
 */

/**
 * @description 用户真实姓名 + 唯一值 + 一些公开信息 => 注册 🐕
 */
export const postRegister_API = '/Lottery/JoinInLottery'

/**
 * @description 拿到 唯一值 让后端检测是否已经注册，并且返回 ID 🐖
 */
export const getUserRegistered_API = '/Lottery/CheckIsSaved'

/**
 * @description 拿到用户的中奖信息，展示卡片用 🐖
 */
export const getUserSelfLottery_API = '/Lottery/GetSelfLotteryState'

/**
 * @description 后端返回 APPID 用于解密 unionId 🐂
 */
export const getAPPID_API = '/Lottery/GetAppId'

/**
 * @description 检测用户的邀请码是否正确 😈
 */
export const postInviteCode_API = '/Lottery/UserLogin'
