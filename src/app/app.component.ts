import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Scratch-Card',
      url: '/Scratch-Card',
      icon: 'gift'
    },
    {
      title: 'Inbox',
      url: '/folder/Inbox',
      icon: 'mail'
    },
    {
      title: 'Spam',
      url: '/folder/Spam',
      icon: 'warning'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public translate: TranslateService
  ) {
    this.initializeApp();
    this.handleDefaultLang();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    console.log('app ngOninit:', path);
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex((page) => page.title.toLowerCase() === path.toLowerCase());
    }
  }
  ionViewWillEnter() {}

  ionViewDidEnter() {}

  ngAfterContentInit() {}

  ngAfterViewInit() {}

  ionViewDidLeave() {}

  async handleDefaultLang() {
    // 语言初始化(若未设置语言, 则取浏览器语言)
    let currentLanguage = (await localStorage.getItem('currentLanguage')) || this.translate.getBrowserCultureLang();
    // 当在assets/i18n中找不到对应的语言翻译时，使用'zh-CN'作为默认语言
    this.translate.setDefaultLang('zh-CN');
    this.translate.use(currentLanguage);
    // 记录当前设置的语言
    localStorage.setItem('currentLanguage', currentLanguage);
    // console.log('AppComponent handleDefaultLang currentLanguage:', currentLanguage);
  }

  async handleChangeLang(lang) {
    let curLang = this.translate.store.currentLang;
    let changeLang = curLang === 'zh-CN' ? 'en-US' : 'zh-CN';
    this.translate.use(changeLang);
    // console.log('AppComponent handleChangeLang:', this.translate);
  }
}
