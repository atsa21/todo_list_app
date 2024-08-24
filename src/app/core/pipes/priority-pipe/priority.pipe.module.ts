import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PriorityPipe } from './priority.pipe';

@NgModule({
  declarations: [PriorityPipe],
  imports: [CommonModule],
  exports: [PriorityPipe],
})
export class PriorityPipeModule {}
