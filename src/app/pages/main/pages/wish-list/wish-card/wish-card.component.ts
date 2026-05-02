import { Component, inject, input } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddEditWishComponent } from '@core/components/dialogs/add-edit-wish/add-edit-wish.component';
import { Wish } from 'src/app/core/models/wish.model';
import { WishListService } from '@core/services/wish-list/wish-list.service';

@Component({
    standalone: true,
    selector: 'app-wish-card',
    imports: [MatDialogModule],
    templateUrl: './wish-card.component.html',
    styleUrls: ['./wish-card.component.scss'],
})
export class WishCardComponent {
  public wishList = input<Wish[]>([]);

  public dialog = inject(MatDialog);
  public wishService = inject(WishListService);

  editWish(row : Wish): void {
    this.dialog.open(AddEditWishComponent, {
      width: '420px',
      data:row
    })
  }

  deleteWish(key: any): void {
    this.wishService.deleteWish(key);
  }

}
