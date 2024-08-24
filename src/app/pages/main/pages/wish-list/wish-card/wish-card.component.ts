import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogWishComponent } from 'src/app/core/components/dialog-wish/dialog-wish.component';
import { Wish } from 'src/app/core/models/wish.model';
import { WishListService } from '@core/services/wish-list/wish-list.service';

@Component({
  selector: 'app-wish-card',
  templateUrl: './wish-card.component.html',
  styleUrls: ['./wish-card.component.scss']
})
export class WishCardComponent {
  @Input() wishList: any;

  constructor(
    private dialog : MatDialog,
    private wishService: WishListService
  ) { }

  editWish(row : Wish): void {
    this.dialog.open(DialogWishComponent, {
      width: '420px',
      data:row
    })
  }

  deleteWish(key: any): void {
    this.wishService.deleteWish(key);
  }

}
