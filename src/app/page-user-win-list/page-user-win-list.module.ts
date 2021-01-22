import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PageUserWinListPageRoutingModule } from './page-user-win-list-routing.module';

import { PageUserWinListPage } from './page-user-win-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageUserWinListPageRoutingModule
  ],
  declarations: [PageUserWinListPage]
})
export class PageUserWinListPageModule {}
