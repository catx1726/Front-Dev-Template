import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScratchCardComponentComponent } from './scratch-card-component.component';

@NgModule({
  declarations: [ScratchCardComponentComponent],
  imports: [CommonModule],
  exports: [ScratchCardComponentComponent]
})
export class ScratchCardComponentModule {}
