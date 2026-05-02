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
    loadComponent: () =>
      import('./pages/todo-list/todo-list.component').then((mod) => mod.TodoListComponent),
  },
  {
    path: appRouts.wish_list.routerPath,
    loadComponent: () =>
      import('./pages/wish-list/wish-list.component').then((mod) => mod.WishListComponent),
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
