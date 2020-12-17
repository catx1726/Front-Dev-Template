import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-scratch-cards',
  templateUrl: './scratch-cards.page.html',
  styleUrls: ['./scratch-cards.page.scss']
})
export class ScratchCardsPage implements OnInit {
  constructor(public translate: TranslateService) {}

  ngOnInit() {}

  /* 
  TODO
  * 刮刮卡样式 
  * 刮刮卡刮时逻辑 
  * 刮刮卡生成逻辑 
  * 刮刮卡选中逻辑 
  */
}
