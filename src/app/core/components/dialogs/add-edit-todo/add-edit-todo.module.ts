import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditTodoComponent } from './add-edit-todo.component';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { PriorityPipeModule } from '@core/pipes/priority-pipe/priority.pipe.module';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
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
