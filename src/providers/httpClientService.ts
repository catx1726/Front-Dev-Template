import { Injectable } from '@angular/core'
import { Utils } from './utils'
import { HttpClient, HttpErrorResponse, HttpUploadProgressEvent } from '@angular/common/http'
import {API_URL, IS_API_FINISHED, IS_DEBUGGING} from './apiUrl'
import { ResponseCodeEnum } from '../enums/ResponseCodeEnum'
import { Observable } from 'rxjs'

/**
 * 封装httpClient，加上headers，用于授权访问，登陆时需要使用原生的httpC，api端需要做安全性验证
 */
@Injectable()
export class HttpClientServiceProvider {
  constructor(private httpC: HttpClient) {}

  private requestGet(url = '', extra: Array<{ name: string; value: string }> = []): Observable<any> {
    return this.httpC.get(url, Utils.headers(extra))
  }

  private requestPost(url = '', body = null, loader = null, extra: Array<{ name: string; value: string }> = []): Observable<any> {
    if(loader==null){
      return this.httpC.post(url, body, Utils.headers(extra))
    }
    else{
      // let headrs = Utils.headers(extra);
      // this.httpC.request({
      //   method: 'post',
      //   url: url,
      //   body: body,
      //   reportProgress: true,
      //   headers:Utils.headers(extra).headers,
      //
      // }).
      return this.httpC.post(url, body, Utils.headers(extra))
    }
  }

  private requestPut(url = '', body = null, extra: Array<{ name: string; value: string }> = []): Observable<any> {
    return this.httpC.put(url, body, Utils.headers(extra))
  }

  private requestDelete(url, extra: Array<{ name: string; value: string }> = []): Observable<any> {
    return this.httpC.delete(url, Utils.headers(extra))
  }

  login(uName: string, pwd: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (IS_API_FINISHED) {
        const body = 'grant_type=password&username=' + uName + '&password=' + pwd
        const url = API_URL.substr(0, API_URL.length - 4) + 'Token'
        this.httpC.post(url, body).subscribe(
          (res: any) => {
            window.localStorage.setItem('access_token', res.access_token)
            window.localStorage.setItem('user_name', res.userName)
            resolve()
          },
          (err: HttpErrorResponse) => {
            if (err.error.error === ResponseCodeEnum.ERROR_LOGIN_INFO.toString()) {
              reject('账号或密码错误')
            } else if (err.status === 404 || err.status === 0) {
              reject('服务器未响应')
            } else {
              if (err.status / 100 >= 4 && err.status / 100 <= 4) {
                reject('服务器拒绝访问')
              } else {
                reject('意外的错误')
              }
            }
          }
        )
      } else {
        window.localStorage.setItem('access_token', 'test')
        window.localStorage.setItem('user_id', uName)
        window.localStorage.setItem('user_name', uName)
        resolve(ResponseCodeEnum.SUCCESS)
      }
    })
  }

  //region  template

  public get(url = '', body = null, extraHeaders = []): Promise<any> {
    let isLocal: boolean = url.includes('assets')
    // console.log('isLocal request!', isLocal)
    return new Promise<any>((resolve, reject) => {
      this.requestGet(url, extraHeaders).subscribe(
        (data) => {
          if (isLocal) {
            resolve(data)
          }
          this.handleErrorCode(data, resolve, reject)
        },
        (error) => {
          console.log('get error :', error)
          reject(Utils.getHttpErrorInfo(error))
        }
      )
    })
  }

  public post(url = '', body = null, loader = null, extraHeaders = []): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.requestPost(url, body, extraHeaders).subscribe(
        (data) => {
          this.handleErrorCode(data, resolve, reject)
        },
        (error) => {
          if (IS_DEBUGGING) {
            console.error(error, 'http error')
          }
          reject(Utils.getHttpErrorInfo(error))
        }
      )
    })
  }
  
  public put(url = '', body = null, extraHeaders = []): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.requestPut(url, body, extraHeaders).subscribe(
        (data) => {
          this.handleErrorCode(data, resolve, reject)
        },
        (error) => {
          reject(Utils.getHttpErrorInfo(error))
        }
      )
    })
  }

  public delete(url = '', extraHeaders = []): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.requestDelete(url, extraHeaders).subscribe(
        (data) => {
          this.handleErrorCode(data, resolve, reject)
        },
        (error) => {
          reject(Utils.getHttpErrorInfo(error))
        }
      )
    })
  }

  public handleErrorCode(data, resolve, reject) {
    if (data.ErrorCode === ResponseCodeEnum.SUCCESS) {
      resolve(data.Info)
    } else {
      Utils.debugLog(data)
      if (Utils.isNullOrWhitespace(data.Info)) {
        reject(Utils.getResponseErrorInfo(data.ErrorCode))
      } else {
        reject(data.Info)
      }
    }
  }

  toastShow(msg) {}

  //endregion
  
}
