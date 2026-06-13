import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriorityStatusComponent } from './priority-status.component';
import { PriorityPipe } from '@core/pipes';
import { PriorityIconPipe } from '@core/pipes';

@NgModule({
  declarations: [PriorityStatusComponent],
  imports: [CommonModule, PriorityPipe, PriorityIconPipe],
  exports: [PriorityStatusComponent]
})
export class PriorityStatusModule { }
