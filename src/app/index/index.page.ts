import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HintTools, SpinnerStyleEnum } from 'src/providers/HintTools';
import { NavService } from 'src/providers/services/nav.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss']
})
export class IndexPage implements OnInit {
  constructor(public translate: TranslateService, public nav: NavService, public hint: HintTools) {}

  CONSOLE_TAG = 'page index';

  public loaderConfig = { message: '', duration: 4000, spinner: null, cssClass: 'mloader' };

  ngOnInit() {}

  ionViewWillEnter() {
    console.log(this.CONSOLE_TAG, 'ngViewWillEnter!');
  }

  handleUrl(url) {
    this.nav.go(url, { queryParams: { name: 'cad' } });
  }

  async onCowClick(e) {
    let curDOM: Element = e.srcElement || e.target;
    curDOM.classList.add('anim', 'shake');
    // delay 的时间配合 shake 的 duration
    await this.hint.presentLoader(this.loaderConfig);
    let timer = setTimeout(() => {
      this.nav.go('/Scratch-Card', {});
      curDOM.classList.remove('anim', 'shake');
      window.clearTimeout(timer);
    }, 3000);
    console.log(this.CONSOLE_TAG, ' onCowClick!', e);
  }

  /* 
    TODO 2020年12月29日 🥚
    * 界面绘制 OK 2020年12月30日
    * preloader 添加(因为图片太多了)
  */
}
