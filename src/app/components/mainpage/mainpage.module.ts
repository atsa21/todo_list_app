import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainpageRoutingModule } from './mainpage-routing.module';
import { TodoListPageComponent } from './todo-list-page/todo-list-page.component';
import { WishListPageComponent } from './wish-list-page/wish-list-page.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TodoListPageComponent,
    WishListPageComponent,
    ProfilePageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MainpageRoutingModule
  ]
})
export class MainpageModule { }
