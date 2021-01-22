import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DomSpyDirective } from './directives/dom-spy.directive';
import { HintTools } from 'src/providers/HintTools';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { NgZorroAntdMobileModule } from 'ng-zorro-antd-mobile';
import { HttpClientServiceProvider } from 'src/providers/httpClientService';

//翻译加载程序需要知道在哪里加载i18n文件
//在Ionic的静态资产管道中
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  declarations: [AppComponent, DomSpyDirective],
  entryComponents: [],
  imports: [
    NgZorroAntdMobileModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    HttpClientServiceProvider,
    TranslateService,
    StatusBar,
    SplashScreen,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    HintTools
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
