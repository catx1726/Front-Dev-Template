import { API_URL } from '../providers/apiUrl';
import { Utils } from '../providers/utils';

/**
 *
 * @description 拿到奖品的等级和相关轮数信息
 * @param {string} [year=2021]
 */
export function getGiftsLevelInfo_API({ year }) {
  let reqUrl = API_URL + '/Lottery/GetAwardList?' + Utils.serializeObj(arguments[0]);
  return reqUrl;
}

/**
 *
 * @description 拿到奖品的等级和相关轮数信息
 * @param {string} [awardId]
 * @param {string} [number]
 *
 */
export function postCurrentLotteryNumber_API({ awardId, number }) {
  let reqUrl = API_URL + '/Lottery/PostNumbersOfLotteryState?' + Utils.serializeObj(arguments[0]);
  return reqUrl;
}
