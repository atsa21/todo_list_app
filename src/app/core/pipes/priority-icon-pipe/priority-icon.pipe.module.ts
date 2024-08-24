import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PriorityIconPipe } from './priority-icon.pipe';

@NgModule({
  declarations: [PriorityIconPipe],
  imports: [CommonModule],
  exports: [PriorityIconPipe],
})
export class PriorityIconPipeModule {}
