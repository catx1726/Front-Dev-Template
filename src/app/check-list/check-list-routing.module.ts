import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckListPage } from './check-list.page';

const routes: Routes = [
  {
    path: '',
    component: CheckListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckListPageRoutingModule {}
