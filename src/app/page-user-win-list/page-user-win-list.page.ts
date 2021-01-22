import { Component, OnInit } from '@angular/core';
import { getUserWinList_API } from 'src/apis/user-win-list';
import { WinUserInterface } from 'src/model/win-user';
import { HttpClientServiceProvider } from 'src/providers/httpClientService';

@Component({
  selector: 'app-page-user-win-list',
  templateUrl: './page-user-win-list.page.html',
  styleUrls: ['./page-user-win-list.page.scss']
})
export class PageUserWinListPage implements OnInit {
  public CONSOLE_TAG = 'PageUserWinListPage';

  public showUserList: Array<WinUserInterface | any> = [];

  constructor(public http: HttpClientServiceProvider) {}

  ngOnInit() {
    this.getUserWinList();
  }

  /* TODO 拿到所有中奖的人员信息 */
  async getUserWinList() {
    this.showUserList = await this.http.get(getUserWinList_API({ year: 2021 }));
    console.log(this.CONSOLE_TAG, 'getUserWinList!');
  }
}
