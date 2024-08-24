import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '@core/components/loader/loader.module';
import { RouterModule, Routes } from '@angular/router';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';

import { WishListComponent } from './wish-list.component';
import { WishCardComponent } from './wish-card/wish-card.component';
import { MatIconModule } from '@angular/material/icon';
import { DialogWishModule } from '@core/components/dialog-wish/dialog-wish.module';
import { MatButtonModule } from '@angular/material/button';

export function playerFactory() {
  return player;
}

const routes: Routes = [
  {
    path:'',
    component: WishListComponent
  }
];

@NgModule({
  declarations: [WishListComponent, WishCardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    LoaderModule,
    LottieModule.forRoot({ player: playerFactory }),
    DialogWishModule,
    MatButtonModule,
  ]
})
export class WishListModule { }
