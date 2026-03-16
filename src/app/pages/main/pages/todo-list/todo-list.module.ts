import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';

import { LoaderModule } from '@core/components/loader/loader.module';
import { TodoListComponent } from './todo-list.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AddEditTodoModule } from '@core/components/dialogs/add-edit-todo/add-edit-todo.module';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PriorityStatusModule } from '@core/components/priority-status/priority-status.module';
import { PriorityPipeModule } from '@core/pipes/priority-pipe/priority.pipe.module';

export function playerFactory() {
  return player;
}

const routes: Routes = [
  {
    path:'',
    component: TodoListComponent
  }
];

@NgModule({
  declarations: [TodoListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    LoaderModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatTableModule,
    PriorityStatusModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSortModule,
    AddEditTodoModule,
    PriorityPipeModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    LottieModule.forRoot({ player: playerFactory }),
  ],
})
export class TodoListModule { }
