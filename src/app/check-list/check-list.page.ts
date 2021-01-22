import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { getUserCheckList_API, postUserGiftsState_API } from 'src/apis/check-list';
import { UserGiftsState } from 'src/enums/CheckStateEnum';
import { WinUserInterface } from 'src/model/win-user';
import { HttpClientServiceProvider } from 'src/providers/httpClientService';

@Component({
  selector: 'app-check-list',
  templateUrl: './check-list.page.html',
  styleUrls: ['./check-list.page.scss']
})
export class CheckListPage implements OnInit {
  private CONSOLE_TAG = 'CheckListPage';

  public checkStateList = [
    { text: '已领奖', value: UserGiftsState.GIVEN },
    { text: '未领奖', value: UserGiftsState.STANDEBY }
  ];

  public showUserList: Array<WinUserInterface | any> = [];

  public searchStr: string;

  // 前端搜索，所以需要一个备份，清空搜索内容时，直接重新拉取数据库，免得写深拷贝
  public backupUserList: Array<WinUserInterface> = this.showUserList;

  constructor(public translate: TranslateService, public http: HttpClientServiceProvider) {}

  ngOnInit() {
    this.getUserList();
  }

  async getUserList() {
    // TODO 获取所有中奖人的信息检查领奖状态
    try {
      this.showUserList = await this.http.get(getUserCheckList_API({ year: 2021 }));
      this.backupUserList = this.showUserList;
      console.log(this.CONSOLE_TAG, 'getUserList !');
    } catch (error) {
      console.log(this.CONSOLE_TAG, 'getUserList error:', error);
    }
  }

  onSearch(val) {
    try {
      this.showUserList = this.backupUserList;
      this.showUserList = this.showUserList.filter((item) => {
        return item.Participation.Name.includes(val);
      });
      console.log(this.CONSOLE_TAG, 'onSearch!', val, this.showUserList, this.backupUserList);
    } catch (error) {
      console.log(this.CONSOLE_TAG, 'onSearch error!', error);
    }
  }

  async onStateChange(stateVal, uItem) {
    try {
      // TODO 拿到 UItem 的 ID 和 state 交给后端
      uItem.State = stateVal;
      await this.http.post(postUserGiftsState_API({ awardId: uItem.AwardId, pId: uItem.Participation.Id }));
      await this.getUserList();
      console.log(this.CONSOLE_TAG, 'onStateChange:', stateVal, uItem);
      return true;
    } catch (error) {
      console.log(this.CONSOLE_TAG, 'onStateChange error:', error);
      return false;
    }
  }
}
