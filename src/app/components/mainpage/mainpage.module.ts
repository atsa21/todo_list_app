import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainpageRoutingModule } from './mainpage-routing.module';
import { TodoListPageComponent } from './todo-list-page/todo-list-page.component';
import { WishListPageComponent } from './wish-list-page/wish-list-page.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';

import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { WishCardComponent } from './wish-list-page/wish-card/wish-card.component';

@NgModule({
  declarations: [
    TodoListPageComponent,
    WishListPageComponent,
    ProfilePageComponent,
    WishCardComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MainpageRoutingModule,
    SharedModule
  ],
  providers: [
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class MainpageModule { }
