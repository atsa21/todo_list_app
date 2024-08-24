import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriorityStatusComponent } from './priority-status.component';
import { PriorityPipeModule } from '@core/pipes/priority-pipe/priority.pipe.module';
import { PriorityIconPipeModule } from '@core/pipes/priority-icon-pipe/priority-icon.pipe.module';

@NgModule({
  declarations: [PriorityStatusComponent],
  imports: [CommonModule, PriorityPipeModule, PriorityIconPipeModule],
  exports: [PriorityStatusComponent]
})
export class PriorityStatusModule { }
