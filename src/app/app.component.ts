import { Component, OnInit } from '@angular/core';

import { LoadingController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { NavService } from 'src/providers/services/nav.service';
import { AuthService } from 'src/providers/utils/auth.service';
import { HintTools, SpinnerStyleEnum } from 'src/providers/HintTools';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  providers: [NavService]
})
export class AppComponent implements OnInit {
  private CONSOLE_TAG = 'APP';
  private uStateLock = false;
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Index',
      url: '/Index',
      icon: 'home',
      show: true
    },
    {
      title: 'Scratch-Card',
      url: '/Scratch-Card',
      icon: 'gift',
      show: true
    },
    {
      title: 'User-Win-List',
      url: '/User-Win-List',
      icon: 'person',
      show: true
    },
    {
      title: 'Check-List',
      url: '/Check-List',
      icon: 'happy',
      show: true
    },
    {
      title: 'Login',
      url: '/Login',
      icon: 'log-in',
      show: true
    },
    {
      title: 'Quit',
      url: '/Login',
      icon: 'log-out',
      show: false
    }
  ];
  public loaderConfig = { message: '', duration: 1000, spinner: SpinnerStyleEnum.LINES, cssClass: 'mloader' };

  public show: boolean;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public translate: TranslateService,
    public nav: NavService,
    public auth: AuthService,
    public hint: HintTools,
    public loader: LoadingController
  ) {
    this.initializeApp();
    this.handleDefaultLang();
    this.show = false;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    this.handleRoute();
    console.log(this.CONSOLE_TAG, ' ngOnInit!');
  }
  ionViewWillEnter() {
    console.log(this.CONSOLE_TAG, ' ionViewWillEnter!');
  }

  ionViewDidEnter() {
    console.log(this.CONSOLE_TAG, ' ionViewDidEnter!');
  }

  ngAfterContentInit() {
    console.log(this.CONSOLE_TAG, ' ngAfterContentInit!');
  }

  ngAfterViewInit() {
    this.show = true;
    this.handlePreloader();
    console.log(this.CONSOLE_TAG, ' ngAfterViewInit!');
  }

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

  /* 
  当路由通过非点击 menu-item 改变时
  没有找到好的方法，同步 menu-item 的变化
  只好在即将打开的 event 上去检查 router 
  */
  handleRoute() {
    let curPath = window.location.hash.split('#/')[1];
    // console.log(`${this.CONSOLE_TAG} handleRoute:`, curPath);
    if (!curPath) return;
    this.selectedIndex = this.appPages.findIndex((page) => page.title.toLowerCase() === curPath.toLowerCase());
    this.handleAuthSyncRoute();
  }

  handleAuthSyncRoute() {
    let logged = this.auth.logged();
    // console.log(this.CONSOLE_TAG, ' handleAuthSyncRoute:', this.appPages, 'logged:', logged, this.uStateLock);
    if (logged && !this.uStateLock) {
      return this.handleRouteLoop(logged);
    }
    if (!logged && this.uStateLock) {
      return this.handleRouteLoop(logged);
    }
  }
  /* 将 Login 和 Logout 的显示状态进行切换，用在登录或者登出的状态 😫 */
  handleRouteLoop(logged) {
    this.appPages.forEach((page) => {
      page.show = page.url === '/Login' ? !page.show : page.show;
    });
    this.uStateLock = logged;
  }

  async handlePreloader() {
    await this.hint.presentLoader({
      message: this.loaderConfig.message,
      spinner: this.loaderConfig.spinner,
      duration: this.loaderConfig.duration / 5
    });
  }
}
