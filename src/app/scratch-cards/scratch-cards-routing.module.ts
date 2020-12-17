import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScratchCardsPage } from './scratch-cards.page';

const routes: Routes = [
  {
    path: '',
    component: ScratchCardsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScratchCardsPageRoutingModule {}
