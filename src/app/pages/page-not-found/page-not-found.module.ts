import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';

import { PageNotFoundComponent } from './page-not-found.component';

export function playerFactory() {
  return player;
}

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
    LottieModule.forRoot({ player: playerFactory }),
  ],
})
export class PageNotFoundModule { }
