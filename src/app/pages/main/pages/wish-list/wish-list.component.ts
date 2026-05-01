import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEditWishComponent } from '@core/components/dialogs/add-edit-wish/add-edit-wish.component';
import { WishListService } from '@core/services/wish-list/wish-list.service';
import { AnimationOptions } from 'ngx-lottie';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-wish-list',
    templateUrl: './wish-list.component.html',
    styleUrls: ['./wish-list.component.scss'],
    standalone: false
})
export class WishListComponent implements OnInit, OnDestroy {
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

  private destroy$ = new Subject<boolean>();

  constructor(
    private dialog: MatDialog,
    private wishService: WishListService
  ) { }

  ngOnInit(): void {
    this.getWishList();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  private getWishList(): void {
    this.wishService.getWish()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.wishList = data;
      });
  }

  openDialog(): void {
    this.dialog.open(AddEditWishComponent, {
      width: '420px'
    });
  }
}
