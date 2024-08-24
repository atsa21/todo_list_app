import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { appRouts } from '@core/constants';
import { MainComponent } from './main.component';

const children: Routes = [
  {
    path: '',
    redirectTo: appRouts.todo.routerPath,
    pathMatch: 'full',
  },
  {
    path: appRouts.todo.routerPath,
    loadChildren: () =>
      import('./pages/todo-list/todo-list.module').then((mod) => mod.TodoListModule),
  },
  {
    path: appRouts.wish_list.routerPath,
    loadChildren: () =>
      import('./pages/wish-list/wish-list.module').then((mod) => mod.WishListModule),
  },
  {
    path: appRouts.profile.routerPath,
    loadChildren: () =>
      import('./pages/profile/profile.module').then((mod) => mod.ProfileModule),
  }
];

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: children,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
