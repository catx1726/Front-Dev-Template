import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AlertOptions, LoadingOptions, ToastOptions } from '@ionic/core';

@Injectable()
export class HintTools {
  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

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
  async createAlert(Info: AlertOptions) {
    return await this.alertCtrl.create(Info);
  }

  /**
   * 创建并显示一个Alert，无按钮时不可设置backdropDismiss为false
   * @param {string} title
   * @param {string} subTitle
   * @param {string} message
   * @param {ButtonOption[]} buttons
   * @param {boolean} backdropDismiss
   * @param {string} cssClass
   * @param {Array} inputs
   * @returns {Promise<void>}
   */
  async presentAlert(Info: AlertOptions) {
    if ((Info.buttons == [] || Info.buttons === undefined || Info.buttons == null) && !Info.backdropDismiss) {
      console.error('invalid alert options');
    } else {
      (await this.alertCtrl.create(Info)).present();
    }
  }

  /**
   * 创建并返回一个Toast，需使用present控制显示，当duration为0时需使用dismiss关闭
   * @param {string} message
   * @param {number} duration
   * @param {string} cssClass
   * @returns {Promise<HTMLIonToastElement>}
   */
  async createToast(Info: ToastOptions) {
    return await this.toastCtrl.create(Info);
  }

  /**
   * 创建并显示一个Toast。duration需>0
   * @param {string} message
   * @param {number} duration
   * @param {string} cssClass
   * @returns {Promise<void>}
   */
  async presentToast(Info: ToastOptions) {
    if (Info.duration < 0) {
      console.error('invalid toast duration');
    } else {
      (await this.toastCtrl.create(Info)).present();
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
  async createLoader(Info: LoadingOptions) {
    return await this.loadingCtrl.create(Info);
  }

  /**
   * 创建并显示一个Loader，duration需>0
   * @param {string} message
   * @param {SpinnerStyleEnum} spinner
   * @param {number} duration
   * @param {string} cssClass
   * @returns {Promise<void>}
   */
  async presentLoader(Info: LoadingOptions) {
    if (Info.duration <= 0) {
      console.error('invalid loader duration');
    } else {
      (await this.loadingCtrl.create(Info)).present();
    }
  }

  async loaderDismiss() {
    try {
      return await this.loadingCtrl.dismiss();
    } catch (error) {
      this.presentToast({ message: error });
      console.log('loaderDismiss error:', error);
      return false;
    }
  }
}

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
