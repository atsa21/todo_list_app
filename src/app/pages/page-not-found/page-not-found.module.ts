import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found.component';
import { LottieComponent } from "ngx-lottie";


const routes: Routes = [
  {
    path:'',
    component: PageNotFoundComponent
  }
];

@NgModule({
  declarations: [PageNotFoundComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    LottieComponent
],
})
export class PageNotFoundModule { }
