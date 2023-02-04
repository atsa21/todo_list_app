import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs';
import { Wish } from 'src/app/models/wish.model';
import { WishListService } from 'src/app/services/wish-list.service';
import { DialogWishComponent } from '../../dialog-wish/dialog-wish.component';

@Component({
  selector: 'app-wish-list-page',
  templateUrl: './wish-list-page.component.html',
  styleUrls: ['./wish-list-page.component.scss']
})
export class WishListPageComponent implements OnInit {

  public wishList: Wish[] = [];

  constructor(
    private dialog : MatDialog,
    private wishService: WishListService
  ) { }

  ngOnInit(): void {
    this.getWishList();
  }

  private getWishList(): void {
    this.wishService.getWish().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.wishList = data;
    });
  }

  openDialog(): void {
    this.dialog.open(DialogWishComponent, {
      width: '420px'
    });
  }

  editWish(row : Wish): void {
    this.dialog.open(DialogWishComponent, {
      width: '420px',
      data:row
    })
  }

}
