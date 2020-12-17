import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Injectable()
export class HintTools {
  constructor(private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController) {
    
  }
  
  /**
   * 创建并返回一个Alert，需使用present控制显示
   * @param {string} title
   * @param {string} subTitle
   * @param {string} message
   * @param {ButtonOption[]} buttons
   * @param {boolean} backdropDismiss
   * @param {string} cssClass
   * @returns {Promise<HTMLIonAlertElement>}
   */
  async createAlert(title: string, subTitle: string, message: string, buttons: ButtonOption[]=[], backdropDismiss:boolean=true, cssClass = '') {
    return await this.alertCtrl.create(
      {
        header: title,
        subHeader: subTitle,
        message,
        buttons,
        backdropDismiss,
        cssClass,
        inputs:[
          {
            label:'',
            type:'checkbox',
          }
        ]
      });
  }
  
  /**
   * 创建并显示一个Alert，无按钮时不可设置backdropDismiss为false
   * @param {string} title
   * @param {string} subTitle
   * @param {string} message
   * @param {ButtonOption[]} buttons
   * @param {boolean} backdropDismiss
   * @param {string} cssClass
   * @returns {Promise<void>}
   */
  async presentAlert(title: string, subTitle: string, message: string, buttons: ButtonOption[], backdropDismiss:boolean=true, cssClass = '') {
    if((buttons==[] || buttons===undefined || buttons==null)&&!backdropDismiss){
      console.error("invalid alert options");
    }
    else{
      (await this.alertCtrl.create(
        {
          header: title,
          subHeader: subTitle,
          message,
          buttons,
          backdropDismiss,
          cssClass
        })).present();
    }
  }
  
  /**
   * 创建并返回一个Toast，需使用present控制显示，当duration为0时需使用dismiss关闭
   * @param {string} message
   * @param {number} duration
   * @param {string} cssClass
   * @returns {Promise<HTMLIonToastElement>}
   */
  async createToast(message: string, duration: number = 2000, cssClass = '') {
    return await this.toastCtrl.create(
      {
        message,
        cssClass,
        duration
      });
  }
  
  /**
   * 创建并显示一个Toast。duration需>0
   * @param {string} message
   * @param {number} duration
   * @param {string} cssClass
   * @returns {Promise<void>}
   */
  async presentToast(message: string, duration: number = 2000, cssClass = '') {
    if(duration<0){
      console.error('invalid toast duration');
    }
    else{
      (await this.toastCtrl.create(
        {
          message,
          cssClass,
          duration
        })).present();
    }
  }
  
  /**
   * 创建并返回一个Loader，需使用present控制显示。当duration为0时需使用dismiss关闭
   * @param {string} message
   * @param {SpinnerStyleEnum} spinner
   * @param {number} duration
   * @param {string} cssClass
   * @returns {Promise<HTMLIonLoadingElement>}
   */
  async createLoader(message:string = '', spinner: SpinnerStyleEnum = SpinnerStyleEnum.BUBBLES, duration: number = 0, cssClass = '') {
    return await this.loadingCtrl.create(
      {
        message,
        spinner,
        cssClass,
        duration
      });
  }
  
  /**
   * 创建并显示一个Loader，duration需>0
   * @param {string} message
   * @param {SpinnerStyleEnum} spinner
   * @param {number} duration
   * @param {string} cssClass
   * @returns {Promise<void>}
   */
  async presentLoader(message:string = '', spinner: SpinnerStyleEnum = SpinnerStyleEnum.BUBBLES, duration: number = 1, cssClass = '') {
    if(duration<=0){
      console.error('invalid loader duration');
    }
    else{
      (await this.loadingCtrl.create(
        {
          message,
          spinner,
          cssClass,
          duration
        })).present();
    }
  }
}

// export interface AlertOptions{
//   header?:string;
//   subHeader?:string;
//   message:string;
//   inputs?: InputOption[];
//   buttons?: ButtonOption[];
// }

// export interface InputOption {
//   type?: TextFieldTypes | 'checkbox' | 'radio' | 'textarea';
//   name?: string;
//   placeholder?: string;
//   value?: any;
//   label?: string;
//   checked?: boolean;
//   disabled?: boolean;
//   id?: string;
//   handler?: any;
//   cssClass?: string | string[];
// }

export interface ButtonOption {
  text: string;
  role: string;
  handler: any;
}

export enum SpinnerStyleEnum {
  BUBBLES = 'bubbles',
  CIRCLES = 'circles',
  CIRCULAR = 'circular',
  CRESCENT = 'crescent',
  DOTS = 'dots',
  LINES = 'lines',
  LINES_SMALL = 'lines-small'
}

// type TextFieldTypes = 'date' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url' | 'time' | 'week' | 'month' | 'datetime-local';