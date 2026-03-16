import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditTodoComponent } from './add-edit-todo.component';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { PriorityPipeModule } from '@core/pipes/priority-pipe/priority.pipe.module';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { AddEditTodoFormService } from './services/add-edit-todo-form.service';

@NgModule({
  declarations: [AddEditTodoComponent],
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatOptionModule,
    PriorityPipeModule,
    MatChipsModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  providers: [AddEditTodoFormService]
})
export class AddEditTodoModule { }
