import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScratchCardsPageRoutingModule } from './scratch-cards-routing.module';

import { ScratchCardsPage } from './scratch-cards.page';
import { ScratchCardComponentModule } from '../components/scratch-card-component/scratch-card-component.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScratchCardsPageRoutingModule,
    ScratchCardComponentModule,
    TranslateModule
  ],
  declarations: [ScratchCardsPage]
})
export class ScratchCardsPageModule {}
