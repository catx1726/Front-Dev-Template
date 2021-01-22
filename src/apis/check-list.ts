import { API_URL } from '../providers/apiUrl';
import { Utils } from '../providers/utils';

/**
 *
 * @description 拿到所有中将人员的信息及其领奖状态
 * @param {string} [year=2021]
 */
export function getUserCheckList_API({ year }) {
  let reqUrl = API_URL + '/Lottery/GetLotteryStateList?' + Utils.serializeObj(arguments[0]);
  return reqUrl;
}

/**
 *
 * @description 修改用户的领奖状态
 * @param {string} [year=2021]
 */
export function postUserGiftsState_API({ awardId, pId }) {
  let reqUrl = API_URL + '/Lottery/ReceiveLottery?' + Utils.serializeObj(arguments[0]);
  return reqUrl;
}
