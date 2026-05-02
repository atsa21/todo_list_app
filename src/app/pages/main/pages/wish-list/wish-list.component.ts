import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AddEditWishComponent } from '@core/components/dialogs/add-edit-wish/add-edit-wish.component';
import { LoaderModule } from '@core/components/loader/loader.module';
import { Wish } from '@core/models/wish.model';
import { WishListService } from '@core/services/wish-list/wish-list.service';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { WishCardComponent } from './wish-card/wish-card.component';

@Component({
    standalone: true,
    selector: 'app-wish-list',
    imports: [
      MatIconModule,
      LoaderModule,
      MatButtonModule,
      LottieComponent,
      WishCardComponent,
    ],
    templateUrl: './wish-list.component.html',
    styleUrls: ['./wish-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WishListComponent {
  public wishList = signal<Wish[] | null>(null);
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

  private dialog = inject(MatDialog);
  private wishService = inject(WishListService);
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.wishService.getWish()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => this.wishList.set(data));
  }

  public openDialog(): void {
    this.dialog.open(AddEditWishComponent, {
      width: '420px'
    });
  }
}
