import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '@core/components/loader/loader.module';
import { RouterModule, Routes } from '@angular/router';

import { WishListComponent } from './wish-list.component';
import { WishCardComponent } from './wish-card/wish-card.component';
import { MatIconModule } from '@angular/material/icon';
import { AddEditWishModule } from '@core/components/dialogs/add-edit-wish/add-edit-wish.module';
import { MatButtonModule } from '@angular/material/button';
import { LottieComponent } from "ngx-lottie";

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
    AddEditWishModule,
    MatButtonModule,
    LottieComponent
]
})
export class WishListModule { }
