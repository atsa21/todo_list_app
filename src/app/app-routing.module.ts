import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth/auth.guard';
import { appRouts } from '@core/constants';


const routes: Routes = [
  {
    path: '',
    redirectTo: appRouts.main.routerPath,
    pathMatch: 'full'
  },
  {
    path: appRouts.main.routerPath,
    loadChildren: () =>
      import('./pages/main/main.module').then((mod) => mod.MainModule),
    canActivate: [AuthGuard],
  },
  {
    path: appRouts.login.routerPath,
    loadChildren: () =>
      import('./pages/auth/login/login.module').then((mod) => mod.LoginModule),
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

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
