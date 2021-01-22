import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, MenuController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { postLogin_API } from 'src/apis/permission';
import { HintTools } from 'src/providers/HintTools';
import { HttpClientServiceProvider } from 'src/providers/httpClientService';
import { Utils } from 'src/providers/utils';
import { AuthService } from 'src/providers/utils/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  CONSOLE_TAG = 'Page Login';

  public userInfoForm = { UserName: '', Password: '' };

  public config = { needName: true, needPassword: true, loginLock: false };

  public loaderConfig = { message: '', duration: 1000, spinner: null, cssClass: 'mloader' };

  constructor(
    public hint: HintTools,
    private router: Router,
    public translate: TranslateService,
    public auth: AuthService,
    public menu: MenuController,
    public http: HttpClientServiceProvider
  ) {}

  ngOnInit() {
    console.log(this.CONSOLE_TAG, 'ngOnint!');
  }
  ionViewWillEnter() {
    // 清理之前的登录信息
    this.auth.quit();
    this.menu.close();
    console.log(this.CONSOLE_TAG, 'ngViewWillEnter!');
  }

  async login() {
    try {
      this.config.loginLock = true;
      await this.hint.presentLoader(this.loaderConfig);

      let { UserName, Password } = this.userInfoForm;
      let msg = this.translate.instant('Login.Erorr-Require');
      // TODO 2020年12月30日 对接后台，返回 token
      if (!Utils.isNotNullOrWhitespace(UserName)) {
        this.hint.presentToast({ message: msg });
        return;
      }
      await this.http.post(postLogin_API({ account: UserName, password: Password }));

      await this.hint.loaderDismiss();

      Utils.sSetLoginId(UserName);
      this.auth.setToken('temp-token');
      this.auth.setUId(UserName);
      this.router.navigate(['/Index']);
      this.config.loginLock = false;
    } catch (error) {
      this.config.loginLock = false;
      this.hint.presentToast({ message: '账号密码错误', duration: 2000 });
      console.log(`${this.CONSOLE_TAG} error:`, error);
    }
  }
}
