import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ResponseCodeEnum } from '../enums/ResponseCodeEnum';
import { API_URL, IS_DEBUGGING } from './apiUrl';

@Injectable()
export class Utils {
  /**
   * @description debugging output func
   * @param {Array} objectArr
   * @memberof Utils
   */
  static debuggingOutPut(objectArr) {
    try {
      if (IS_DEBUGGING) {
        objectArr.forEach((item) => {
          console.log(item?.message || 'debuggingOutPut', '——_——', item?.data);
        });
      }
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  static isNotNullOrWhitespace(str) {
    return !this.isNullOrWhitespace(str);
  }

  // DES 从左至右，函数组合，ref doc https://juejin.im/post/6844903910834962446#heading-5
  static fnComposePipe(...fns) {
    return function (x) {
      return fns.reduceRight(function (arg, fn) {
        return fn(arg);
      }, x);
    };
  }

  static isNullOrUndefined(obj): boolean {
    return obj == null || obj === undefined;
  }

  static isNotNullOrUndefined(obj) {
    return !this.isNullOrUndefined(obj);
  }

  static isNullOrWhitespace(str): boolean {
    if (typeof str === 'string') {
      str = str.trim();
    }
    return str != '0' && (str == null || str == undefined || str == '');
  }

  /**
   * 判断传入对象是否为有效数组并移除空元素
   * @param {any[]} array
   * @param {number} validLength
   * @returns {boolean}
   * @constructor
   */
  static isValidArray(array: any[], validLength: number = 1) {
    if (array && Array.isArray(array) && array.length >= validLength) {
      for (let i = array.length - 1; i >= 0; i--) {
        if (Utils.isNullOrUndefined(array[i])) {
          array.splice(i, 1);
        }
      }
      return array.length > 0;
    } else {
      return false;
    }
  }

  static timeOffset(offset: any) {
    let d = new Date();
    let nd = new Date(d.getTime() + 3600000 * offset); //60*60*1000
    return nd.toISOString();
  }

  static correctTimeString(datetime) {
    if (datetime != null && datetime != undefined && datetime.charAt(datetime.length - 1) != 'Z') {
      let i = datetime.lastIndexOf('.');
      let t1 = datetime.substring(0, i + 1);
      let t2 = datetime.substring(i + 1, datetime.length);
      while (t2.length < 3) {
        t2 += '0';
      }
      datetime = t1 + t2;
      return datetime + 'Z';
    } else {
      return datetime;
    }
  }

  /**
   * 获取headers，可拓展
   * @param {Array<{name: string; value: string}>} extra 拓展
   * @returns {{headers: HttpHeaders}}
   */
  static headers(extra: Array<{ name: string; value: string }> = []) {
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + window.localStorage.getItem('access_token')
    });
    if (Utils.isValidArray(extra)) {
      for (let header of extra) {
        headers.append(header.name, header.value);
      }
    }
    return { headers: headers };
  }

  static betweenIncludeMaxAndMin(target: number, min: number, max: number): boolean {
    if (Utils.isNullOrUndefined(target) || Utils.isNullOrUndefined(min) || Utils.isNullOrUndefined(max)) {
      return false;
    }
    return min <= max && min <= target && target <= max;
  }

  static betweenIncludeMax(target: number, min: number, max: number): boolean {
    if (Utils.isNullOrUndefined(target) || Utils.isNullOrUndefined(min) || Utils.isNullOrUndefined(max)) {
      return false;
    }
    return min <= max && min < target && target <= max;
  }

  static betweenIncludeMin(target: number, min: number, max: number): boolean {
    if (Utils.isNullOrUndefined(target) || Utils.isNullOrUndefined(min) || Utils.isNullOrUndefined(max)) {
      return false;
    }
    return min <= max && min <= target && target < max;
  }

  static betweenNotIncludeMaxAndMin(target: number, min: number, max: number): boolean {
    if (Utils.isNullOrUndefined(target) || Utils.isNullOrUndefined(min) || Utils.isNullOrUndefined(max)) {
      return false;
    }
    return min < max && min < target && target < max;
  }

  /**
   * 获取服务器数据时获取错误信息
   * @param {ResponseCodeEnum} code
   * @returns {string}
   */
  static getResponseErrorInfo(code: ResponseCodeEnum) {
    switch (code) {
      case ResponseCodeEnum.FAILED:
        return '获取信息失败';
      case ResponseCodeEnum.EXPIRED_DATA:
        return '无效的数据';
      case ResponseCodeEnum.ILLEGAL:
        return '非法的请求数据';
      default:
        return '发生错误';
    }
  }

  /**
   * 获取服务器数据时获取异常信息
   * @param {HttpErrorResponse} err
   * @returns {any}
   */
  static getHttpErrorInfo(err: HttpErrorResponse) {
    try {
      if (err.status === 404) {
        return '访问对象不存在';
      } else if (err.status === 0) {
        return '服务器未响应';
      } else if (err.status / 100 >= 4 && err.status / 100 < 5) {
        return '服务器拒绝访问';
      } else {
        if (err.status === 200 && !err.ok) {
          return '登录信息已失效，请重新登录';
        } else {
          return '意外的错误';
        }
      }
    } catch (ex) {
      return ex;
    }
  }

  /**
   * 序列化对象
   */
  static serializeObj(obj) {
    const result = [];
    for (const property in obj) {
      if (Utils.isNotNullOrUndefined(property)) {
        result.push(encodeURIComponent(property) + '=' + encodeURIComponent(obj[property]));
      }
    }
    return result.join('&');
  }

  static encode(str: string) {
    return encodeURI(str);
  }

  static sCompareFnNumberOrderAscending(a, b) {
    if (a.Order > b.Order) {
      return 1;
    } else if (a.Order < b.Order) {
      return -1;
    } else {
      return 0;
    }
  }

  static sCompareFnStringNameAscending(a, b) {
    if (a.Name > b.Name) {
      return 1;
    } else if (a.Name < b.Name) {
      return -1;
    } else {
      return 0;
    }
  }

  static sISOStringToDate(isoString, showConsole: boolean = false): any {
    try {
      let ds = isoString.replace(/-/g, '/').replace(/T/g, ' ');
      ds = ds.slice(0, ds.length - 1);
      if (showConsole) {
        console.log(ds, 'temp string');
        console.log(new Date(ds), 'temp date');
        console.log(Date.parse(ds), 'parsed date');
      }
      return new Date(ds);
      // return new Date(Date.parse(ds));
    } catch {
      return '-';
    }
  }

  static sGetFormattedDatetime(datetime: Date) {
    // console.log("datetime:", datetime);
    try {
      const year = datetime.getFullYear();
      const month = datetime.getMonth() + 1;
      const date = datetime.getDate();
      const hours = datetime.getHours();
      const minutes = datetime.getMinutes();

      return (
        year.toString() +
        '-' +
        (month >= 10 ? month.toString() : '0' + month.toString()) +
        '-' +
        (date >= 10 ? date.toString() : '0' + date.toString()) +
        ' ' +
        (hours >= 10 ? hours.toString() : '0' + hours.toString()) +
        ':' +
        (minutes >= 10 ? minutes.toString() : '0' + minutes.toString())
      );
    } catch (ex) {
      return '-';
    }
  }

  static sGetFormattedDate(datetime: Date) {
    // console.log("datatime:", datetime);
    try {
      const year = datetime.getFullYear();
      const month = datetime.getMonth() + 1;
      const date = datetime.getDate();
      // let seconds=datetime.getSeconds();

      return (
        year.toString() +
        '-' +
        (month >= 10 ? month.toString() : '0' + month.toString()) +
        '-' +
        (date >= 10 ? date.toString() : '0' + date.toString())
      );
    } catch (ex) {
      // console.log(ex, "convert time error");
      // console.log("convert time error");
      return '-';
    }
  }

  static sConvertDateStringToISOString(dateStr) {
    if (Utils.isNullOrWhitespace(dateStr)) {
      return null;
    }
    return new Date(dateStr).toISOString();
  }

  static sGetDateWithoutHMS(datetime: Date): Date {
    const y = datetime.getFullYear();
    const m = datetime.getMonth() + 1;
    const d = datetime.getDate();
    const dateStr = y + '-' + m + '-' + d + ' 00:00:00';
    return new Date(dateStr);
  }

  static sGetLoginId(): string {
    return window.sessionStorage.getItem('loginId') || '';
  }

  static sSetLoginId(id) {
    window.sessionStorage.setItem('loginId', id);
  }

  static sSetFileUploaded(file) {
    if (Utils.isNotNullOrUndefined(file)) {
      file.Uploaded = true;
    }
  }

  static sSetFilePathFromServer(file, propertyStr = 'Path') {
    if (Utils.isNotNullOrUndefined(file)) {
      // console.log(file,"obj")
      if (file.hasOwnProperty(propertyStr)) {
        file.Thumbnail = API_URL.slice(0, API_URL.length - 4) + file.Path;
      } else {
        // console.log('property not match')
      }
    } else {
      // console.log('null or undefined')
    }
  }

  static debugLog(message, extra = '', level: LogLevelEnum = LogLevelEnum.INFO) {
    if (IS_DEBUGGING) {
      switch (level) {
        case LogLevelEnum.INFO:
          console.info(message, extra);
          break;
        case LogLevelEnum.WARN:
          console.warn(message, extra);
          break;
        case LogLevelEnum.ERROR:
          console.error(message, extra);
          break;
        case LogLevelEnum.FATAL:
          console.exception(message, extra);
          break;
        default:
          break;
      }
    }
  }

  /**
   * 加密字符串/数字
   * @param data
   * @returns {string}
   */
  static btoa(data: any): string {
    return window.btoa(data.toString());
  }

  /**
   * 解密字符串为原字符串
   * @param {string} encodedStr
   * @returns {string}
   */
  static atob(encodedStr: string): string {
    return window.atob(encodedStr);
  }

  /**
   * 解密字符串为原数字
   * @param {string} encodedStr
   * @returns {number}
   */
  static atobNumber(encodedStr: string): number {
    if (encodedStr == null) {
      return null;
    }
    try {
      return Number(window.atob(encodedStr));
    } catch {
      return null;
    }
  }

  /**
   * base64转blob
   * @param dataUrl
   * @returns {Blob}
   */
  static dataURLtoBlob(dataUrl) {
    let arr = dataUrl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  /**
   * blob转base64
   * @param blob 源blob数据
   * @param callback 返回事件
   */
  static blobToDataURL(blob): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      try {
        let a = new FileReader();
        a.onload = function (e) {
          resolve(e.target.result);
        };
        a.readAsDataURL(blob);
      } catch (e) {
        reject(e);
      }
    });
  }
}

export enum LogLevelEnum {
  INFO,
  WARN,
  ERROR,
  FATAL
}
