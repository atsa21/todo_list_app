import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainpageComponent } from './components/mainpage/mainpage.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AuthGuardGuard } from './shared/auth-guard.guard';

const routes: Routes = [
  { path:'', redirectTo:'login', pathMatch:'full' },
  { path:'login', component: LoginComponent },
  { path:'signup', component: SignUpComponent },
  { path:'mainpage', component: MainpageComponent, canActivate: [AuthGuardGuard],
    loadChildren: () => import('./components/mainpage/mainpage.module').then((mod) => mod.MainpageModule)},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
