import { Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth/auth.guard';
import { appRouts } from '@core/constants';


export const routes: Routes = [
  {
    path: '',
    redirectTo: appRouts.main.routerPath,
    pathMatch: 'full'
  },
  {
    path: appRouts.main.routerPath,
    loadChildren: () =>
      import('./pages/main/main.routes').then((mod) => mod.MAIN_ROUTES),
    canActivate: [AuthGuard],
  },
  {
    path: appRouts.login.routerPath,
    loadComponent: () =>
      import('./pages/auth/login/login.component').then((mod) => mod.LoginComponent),
  },
  {
    path: appRouts.sign_up.routerPath,
    loadChildren: () =>
      import('./pages/auth/sign-up/sign-up.module').then((mod) => mod.SignUpModule),
  },
  {
    path: '**',
    loadChildren: () =>
      import('./pages/page-not-found/page-not-found.module').then((mod) => mod.PageNotFoundModule),
  }
];
