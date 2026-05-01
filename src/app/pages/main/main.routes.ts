import { Routes } from '@angular/router';
import { appRouts } from '@core/constants';

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
    loadComponent: () =>
      import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
  }
];

export const MAIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./main.component').then(m => m.MainComponent),
    children: children,
  },
];
