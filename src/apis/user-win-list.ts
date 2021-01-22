import { API_URL } from '../providers/apiUrl';
import { Utils } from '../providers/utils';

/**
 *
 * @description 拿到所有中将人员的信息
 * @param {string} [year=2021]
 */
export function getUserWinList_API({ year }) {
  let reqUrl = API_URL + '/Lottery/GetLotteryStateList?' + Utils.serializeObj(arguments[0]);
  return reqUrl;
}
