import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime } from 'rxjs';
import { AddEditWishComponent } from '@shared/components/dialogs/add-edit-wish/add-edit-wish.component';
import { Wish } from '@core/models/wish.model';
import { WishListService } from '@core/services/wish-list/wish-list.service';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { WishCardComponent } from './wish-card/wish-card.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';

type WishSort = 'newest' | 'priceAsc' | 'priceDesc';

@Component({
  standalone: true,
  selector: 'app-wish-list',
  imports: [CommonModule, ReactiveFormsModule, LottieComponent, LoaderComponent, WishCardComponent],
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WishListComponent {
  public options: AnimationOptions = {
    path: '/assets/animation/house.json',
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
      className: 'lottie-svg-class',
    },
  };

  public styles: Partial<CSSStyleDeclaration> = {
    maxWidth: '400px',
    maxHeight: '400px',
  };

  public todayDate = new Date();

  public searchControl = new FormControl('');
  public search = signal('');
  public sort = signal<WishSort>('newest');
  public openSort = signal(false);

  public readonly sortKeys: WishSort[] = ['newest', 'priceAsc', 'priceDesc'];
  public readonly sortLabels: Record<WishSort, string> = {
    newest: 'Newest first',
    priceAsc: 'Price · low to high',
    priceDesc: 'Price · high to low',
  };
  public readonly sortShort: Record<WishSort, string> = {
    newest: 'Newest',
    priceAsc: 'Price ↑',
    priceDesc: 'Price ↓',
  };

  private wishes = signal<Wish[] | null>(null);

  public loaded = computed(() => this.wishes() !== null);
  public count = computed(() => (this.wishes() ?? []).length);
  public hasWishes = computed(() => this.count() > 0);

  public visibleWishes = computed<Wish[]>(() => {
    const q = this.search().trim().toLowerCase();
    const list = (this.wishes() ?? []).filter((w) =>
      q ? (w.title ?? '').toLowerCase().includes(q) : true,
    );
    switch (this.sort()) {
      case 'priceAsc':
        return list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
      case 'priceDesc':
        return list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      default:
        // Push keys are chronological; descending key = newest first.
        return list.sort((a, b) => (b.key ?? '').localeCompare(a.key ?? ''));
    }
  });

  private dialog = inject(MatDialog);
  private wishService = inject(WishListService);
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.wishService
      .getWish()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => this.wishes.set(data));

    this.searchControl.valueChanges
      .pipe(debounceTime(250), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.search.set(value ?? ''));
  }

  public toggleSort(event: MouseEvent): void {
    event.stopPropagation();
    this.openSort.update((open) => !open);
  }

  @HostListener('document:click')
  public closePopovers(): void {
    this.openSort.set(false);
  }

  public setSort(sort: WishSort): void {
    this.sort.set(sort);
    this.openSort.set(false);
  }

  public openDialog(): void {
    this.dialog.open(AddEditWishComponent, {
      width: '480px',
      panelClass: 'wish-dialog-panel',
      backdropClass: 'wish-dialog-backdrop',
    });
  }
}
