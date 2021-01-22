import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageUserWinListPage } from './page-user-win-list.page';

const routes: Routes = [
  {
    path: '',
    component: PageUserWinListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageUserWinListPageRoutingModule {}
