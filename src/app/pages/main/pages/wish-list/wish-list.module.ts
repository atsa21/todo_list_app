import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '@core/components/loader/loader.module';
import { RouterModule, Routes } from '@angular/router';

import { WishListComponent } from './wish-list.component';
import { WishCardComponent } from './wish-card/wish-card.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LottieComponent } from "ngx-lottie";
import { AddEditWishComponent } from '@core/components/dialogs/add-edit-wish/add-edit-wish.component';

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
    AddEditWishComponent,
    MatButtonModule,
    LottieComponent
]
})
export class WishListModule { }
