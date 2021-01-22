import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ScratchCardComponentComponent } from '../components/scratch-card-component/scratch-card-component.component';
import { HintTools } from 'src/providers/HintTools';
import { HttpClientServiceProvider } from 'src/providers/httpClientService';
import { getGiftsLevelInfo_API, postCurrentLotteryNumber_API } from 'src/apis/scratch-card';
import { ReloadEnum } from 'src/enums/ReloadEnum';
import { AlertOptions } from '@ionic/core';
import { GiftsLevelInfoTypes } from 'src/model/scratch-card';

@Component({
  selector: 'app-scratch-cards',
  templateUrl: './scratch-cards.page.html',
  styleUrls: ['./scratch-cards.page.scss']
})
export class ScratchCardsPage implements OnInit {
  DOC = document;

  @ViewChild(ScratchCardComponentComponent) scratchc: ScratchCardComponentComponent;

  CONSOLE_MSG_INFO = 'scratch-card-page';

  public pageConfig = { year: 2021 };

  public scratchCount = [{ text: '牛' }, { text: '年' }, { text: '大' }, { text: '吉' }]; // 存放循环次数 和 字

  public scratchText = ['牛', '运', '亨', '通']; // 存放 字

  public scratchWinUserList: Array<GiftsLevelInfoTypes> = []; // 存放中奖的用户，管理员选择好卡片之后将其付给循环

  public lock = false; // 防止组件中的方法过多调用的一把锁

  public loaderConfig = { message: '', duration: 1000, spinner: null, cssClass: 'mloader' };

  public scratchCardConfig = { needHead: false };

  public giftsLevelList: Array<GiftsLevelInfoTypes> = []; // 奖品级别以及轮数等信息

  public currentLevel: GiftsLevelInfoTypes = {
    Id: '',
    Amount: '',
    ImgSrc: '',
    Level: '',
    LevelDesc: '',
    Name: '',
    Value: '',
    Year: '',
    Rest: '',
    Round: '',
    Numbers: '',
    Done: false
  }; // 当前级别

  public ReloadEnum = ReloadEnum;

  private invalidLock: boolean = false; // 检测到一切非法行为,立即停止刮卡

  constructor(public httpC: HttpClientServiceProvider, public translate: TranslateService, public hint: HintTools) {}

  ngOnInit() {
    this.getGiftsLevelInfo();
  }

  ngAfterViewInit() {
    console.log(`${this.CONSOLE_MSG_INFO} ngAfterViewInit!`);
  }

  ionViewDidEnter() {
    /* 
    先注册 clickMask 的监听，
    当用户确定选择之后，卸载相关监听，
    移除其他DOM，注册当前 Canvas(handleDefaultEvent()) 
    */
    console.log(`${this.CONSOLE_MSG_INFO} ionViewDidEnter!`);
    this.scratchc.handleClickMaskEvent();
  }

  ngOnDestroy() {}

  onShowSideSetting(e: Event) {
    let sideDOM = this.DOC.querySelector('.select-level_container');
    sideDOM.classList.toggle('hide');
    // console.log(this.CONSOLE_MSG_INFO, 'onShowSideSetting:', e);
  }

  /* 本地更新奖品剩余数，在用户选择了卡片之后，由 scratch-card 组件 触发*/
  handleLocalUpdateGiftsRest() {
    this.currentLevel.Rest = Number(this.currentLevel.Rest) - Number(this.currentLevel.Numbers);
  }

  /* OK 拿到当前轮的中奖用户，由 scratch-card 组件 触发*/
  async getLotteryUser() {
    try {
      this.scratchWinUserList = await this.httpC.post(
        postCurrentLotteryNumber_API({ awardId: this.currentLevel.Id, number: this.currentLevel.Numbers })
      );
      console.log(`${this.CONSOLE_MSG_INFO} getLotteryUser!`);
    } catch (error) {
      this.getGiftsLevelInfo();
      this.hint.presentToast({ message: error, duration: 3000 });
      console.log(`${this.CONSOLE_MSG_INFO} getLotteryUser error:`, error);
    }
  }

  /* OK 处理 用户刮完之后更新该级别的奖品信息，如 奖品剩余数 */
  handleUpdatedCurrentGiftsLevelInfo() {
    try {
      console.log(`${this.CONSOLE_MSG_INFO} handleUpdatedCurrentGiftsLevelInfo!`);
      // 第一次进来
      if (!this.currentLevel || !this.currentLevel.Id) {
        this.currentLevel = this.giftsLevelList[0];
        return;
      }
      // 刮过几次后上瘾了
      this.currentLevel = this.giftsLevelList.filter((item: GiftsLevelInfoTypes) => {
        return item.Id === this.currentLevel.Id;
      })[0];
    } catch (error) {
      console.log(`${this.CONSOLE_MSG_INFO} handleUpdatedCurrentGiftsLevelInfo error!`, error);
    }
  }

  /* OK 拿到奖品级别 以及 相应级别的信息，如 轮数 / 人数.. */
  async getGiftsLevelInfo() {
    try {
      this.giftsLevelList = await this.httpC.get(getGiftsLevelInfo_API({ year: this.pageConfig.year }));
      this.handleUpdatedCurrentGiftsLevelInfo();
      console.log(this.CONSOLE_MSG_INFO, 'getGiftsLevelInfo!', this.giftsLevelList, this.currentLevel);
    } catch (error) {
      console.log(this.CONSOLE_MSG_INFO, 'getGiftsLevelInfo error!', error);
    }
  }

  /* OK 切换奖品等级，同步currentLevel，数据拉取更新时也会触发 */
  async onGiftsLevelChange(val) {
    if (!val.Rest) {
      this.currentLevel = this.currentLevel;
      return;
    }

    this.currentLevel = val;

    // 切换时默认把 Round 设置 总数
    this.currentLevel.Round = this.currentLevel.Rest;

    // 切换时默认把 Numbers 设置成 1
    this.currentLevel.Numbers = 1;

    // 计算 每轮人数 以及 抽奖轮数
    // await this.handleAlertInfo();

    // 切换时刷新卡片
    this.handleReload(ReloadEnum.ON_CHANGE_LEVEL);

    console.log(this.CONSOLE_MSG_INFO, 'onGiftsLevelChange:', val);
  }

  /* OK 检查该级别的轮数是否用完 */
  handleCheckLimit(Round) {
    let msg = this.translate.instant('Scratch-Card.LimitDeplete');
    if (!Round) {
      // 用尽
      this.hint.presentToast({ message: msg });
      this.currentLevel.Done = true;
      return false;
    }
    return true; // 未用尽
  }

  /* OK 设定该级别奖品的中奖人数 */
  handleCurrentGiftsNumbers(val) {
    this.currentLevel.Numbers = val;
  }

  /* OK 根据人数计算剩余轮数 */
  handleCurrentGiftsRound(val) {
    this.currentLevel.Round = Math.ceil(+this.currentLevel.Rest / val) - 1;
  }

  handleValidatorIsTruly(val) {
    // console.log('handleValidatorIsTruly:', val);
    let msg = this.translate.instant('HintInfo.InvalidValues');
    if (!+val) {
      this.hint.presentToast({ message: msg });
      return false;
    }
    return true;
  }

  /* OK 校验是否符合规范,最大最小值限制 */
  handleValidatorMaxOrMin(val: string | number, min: string | number, max: string | number, msg: string = '奖品') {
    // console.log('handleValidatorMaxOrMin:', val);
    if (max === 0) {
      this.hint.presentToast({ message: `${msg}数量耗尽`, duration: 3000 });
      return false;
    }
    if (val > 15) {
      // 以免卡片显示的人名溢出
      this.hint.presentToast({ message: `每轮抽取数，最高不得超过 15 人` });
      return false;
    }
    if (min > val) {
      this.hint.presentToast({ message: `不得小于${min}` });
      return false;
    }
    if (val > max) {
      this.hint.presentToast({ message: `每轮抽取数 不得大于 ${msg} 剩余数量:${max}`, duration: 3000 });
      return false;
    }
    return true;
  }

  /* OK 弹框计算 每轮人数 和 轮数 */
  async handleAlertInfo() {
    let alertInfo: AlertOptions = {
      header: this.currentLevel.LevelDesc,
      subHeader: this.translate.instant('Scratch-Card.SetLevelNumbers'),
      backdropDismiss: false,
      inputs: [
        {
          type: 'text',
          name: 'currentNumbers',
          placeholder: this.translate.instant('Scratch-Card.SetLevelNumbers')
        }
      ],
      buttons: [
        {
          text: '确认',
          handler: (val) => {
            let check =
              this.handleValidatorIsTruly(val.currentNumbers) &&
              this.handleValidatorMaxOrMin(val.currentNumbers, 0, this.currentLevel.Rest);
            console.log('check:', check);
            if (!check) return false;
            // 设定每轮人数
            this.handleCurrentGiftsNumbers(val.currentNumbers);
            // 设定轮数
            this.handleCurrentGiftsRound(val.currentNumbers);
            return true;
          }
        }
      ]
    };
    await this.hint.presentAlert(alertInfo);
  }

  /* OK 用户输入 每轮人数 来计算抽奖的轮数 */
  onChangeNumbers(val) {
    let check = this.handleValidatorIsTruly(val) && this.handleValidatorMaxOrMin(val, 0, this.currentLevel.Rest);
    console.log('check:', check);
    if (!check) {
      this.invalidLock = true;
      return false;
    }

    this.invalidLock = false;
    // 设定每轮人数
    this.handleCurrentGiftsNumbers(val);
    // 设定轮数
    this.handleCurrentGiftsRound(val);
    return true;
  }

  async handleReload(type) {
    /* 
    OK
    刷新组件 
    测试发现，是调用顺序有误，以下代码，
    会首先执行 handleClickMaskEvent，打印 handleReload，
    执行了 component 的 ngOnDestroy，清空了相关的监听事件，
    而我们要的正常顺序是 ngOnDestroy -> handleClickMaskEvent；
    查阅了相关文档和资料后，发现 component 每次都会调用 ngAfterViewInit 这个钩子
    这个钩子的相关解释是 `Angular 完全初始化了组件的视图后调用`，
    所以我在 Component 中的 ngAfterViewInit 中直接调用了 this.handleClickMaskEvent()，
    缺点就是因为监听的方法使用的是 document(全局).querSelector 导致会多次注册
    */
    if (!this.handleCheckLimit(this.currentLevel.Round)) return;

    /* 
      OK 在切换奖项的时候不进行次数的减损，
      OK 每轮人数 number 由管理员设定，0 < number < amounts，每次切换奖品级别时，弹窗设定 
      OK 抽奖轮数 rounds = 奖品总数 amounts / 管理员设定的每轮人数 numbers
      只有在点击了 Reload 按钮的时候才会触发 减损
    */
    if (type === ReloadEnum.ON_RELOAD_CLICK) {
      this.handleDomAnimate();
      this.getGiftsLevelInfo();
      this.currentLevel.Round = this.currentLevel.Round ? +this.currentLevel.Round - 1 : this.currentLevel.Round;
    }

    let time = null;
    await this.hint.presentLoader(this.loaderConfig);
    time = window.setTimeout(() => {
      console.log(`${this.CONSOLE_MSG_INFO} handleReload!`);
      this.scratchCount = [{ text: '牛' }, { text: '年' }, { text: '大' }, { text: '吉' }];
      window.clearTimeout(time);
      time = null;
    }, this.loaderConfig.duration);
  }

  /* OK 在 loader 时，给现存的 card 加动画，可提为 service */
  handleDomAnimate() {
    let domList = this.DOC.querySelectorAll('.card_container');
    console.log(`${this.CONSOLE_MSG_INFO} handleDomAnimate!`, domList);
    domList.forEach((item) => {
      item.classList.add('anim', 'shake');
    });
  }
  /* 
  TODO
  * 刮刮卡样式 
  * 刮刮卡刮时逻辑 
  * 刮刮卡生成逻辑 
  * 刮刮卡选中逻辑 
  */
}
