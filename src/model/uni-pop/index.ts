export enum popTypes {
  TOAST = 0,
  LOADING = 1,
  MODAL = 2,
  SHEET = 3
}

export interface popToastInfoTypes extends UniApp.ShowToastOptions {}
// title: string
// icon?: string
// image?: string
// mask?: boolean
// duration?: number
// position?: string
// success?: Function
// fail?: Function
// complete?: Function

export interface popLoadingInfoTypes extends UniApp.ShowLoadingOptions {}
// title: string
// mask?: boolean
// success?: Function
// fail?: Function
// complete?: Function

export interface popModalInfoTypes extends UniApp.ShowModalOptions {}

export interface popSheetInfoTypes extends UniApp.ShowActionSheetOptions {}
