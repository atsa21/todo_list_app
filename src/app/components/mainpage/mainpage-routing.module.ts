import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { TodoListPageComponent } from './todo-list-page/todo-list-page.component';
import { WishListPageComponent } from './wish-list-page/wish-list-page.component';

const routesMainPage: Routes = [
    { path: 'todo',  component: TodoListPageComponent },
    { path: 'wish', component: WishListPageComponent },
    { path: 'profile', component: ProfilePageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routesMainPage)],
  exports: [RouterModule]
})
export class MainpageRoutingModule { }
