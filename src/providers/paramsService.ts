import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Utils } from './utils';

@Injectable()
export class ParamsService {
  private params: any={};

  constructor(public router: Router) {}

  set(params) {
    try {
      // this.params = params;
      for(let param in params){
        if(this.params.hasOwnProperty(param)){
          Utils.debugLog('exist',"set param")
        }
        else{
          Utils.debugLog('new',"set param")
        }
        this.params[param] = params[param];
        Utils.debugLog(this.params,"set param")
      }
    } catch (error) {
      Utils.debugLog('ParamsService Set Error:', error)
    }
  }

  get(str = null) {
    try {
      if (str == null) {
        return this.params
      } else {
        return this.params[str]
      }
    } catch (error) {
      // TODO 当页面刷新后，某些数据因为没有API 就拿不到数据，且存储在全局的数据也丢失了，那就直接返回 ProjList
      // FIXME 当返回到首页之后，会破坏 Detail 的布局
      // this.router.navigate(['/proj/proj-list'])
      // console.log('ParamsService Get Error:', error)
      return null;
    }
  }
}
