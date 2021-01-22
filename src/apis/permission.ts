import { API_URL } from '../providers/apiUrl';
import { Utils } from '../providers/utils';

/**
 *
 * @description 拿到所有中将人员的信息及其领奖状态
 * @param {string} [year=2021]
 */
export function postLogin_API({ account, password }) {
  let reqUrl = API_URL + '/Lottery/AdminLogin?' + Utils.serializeObj(arguments[0]);
  return reqUrl;
}
