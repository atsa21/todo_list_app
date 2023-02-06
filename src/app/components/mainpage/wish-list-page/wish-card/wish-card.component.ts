import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogWishComponent } from 'src/app/components/dialog-wish/dialog-wish.component';
import { Wish } from 'src/app/models/wish.model';
import { WishListService } from 'src/app/services/wish-list.service';

@Component({
  selector: 'app-wish-card',
  templateUrl: './wish-card.component.html',
  styleUrls: ['./wish-card.component.scss']
})
export class WishCardComponent implements OnInit {

  @Input() wishList: any;

  constructor(
    private dialog : MatDialog,
    private wishService: WishListService
  ) { }

  ngOnInit(): void {
  }

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
