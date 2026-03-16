import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';

import { LoaderModule } from '@core/components/loader/loader.module';
import { TodoListComponent } from './todo-list.component';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { FormsModule } from '@angular/forms';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { AddEditTodoModule } from '@core/components/dialogs/add-edit-todo/add-edit-todo.module';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
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
