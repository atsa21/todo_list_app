import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEditWishComponent } from '@core/components/dialogs/add-edit-wish/add-edit-wish.component';
import { WishListService } from '@core/services/wish-list/wish-list.service';
import { AnimationOptions } from 'ngx-lottie';
import { map } from 'rxjs';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.scss']
})
export class WishListComponent implements OnInit {
  public wishList: any;
  public options: AnimationOptions = {
    path: '/assets/animation/house.json',
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
      className: "lottie-svg-class"
    }
  };

  public styles: Partial<CSSStyleDeclaration> = {
    maxWidth: '400px',
    maxHeight: '400px',
  };

  constructor(
    private dialog: MatDialog,
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
    this.dialog.open(AddEditWishComponent, {
      width: '420px'
    });
  }
}
