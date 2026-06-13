import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEditWishComponent } from '@shared/components/dialogs/add-edit-wish/add-edit-wish.component';
import { Wish } from 'src/app/core/models/wish.model';
import { WishListService } from '@core/services/wish-list/wish-list.service';

/**
 * A single wish rendered as a glass product card. Owns its own kebab menu
 * state; edit opens the shared add/edit dialog and delete is delegated to
 * the WishListService.
 */
@Component({
  standalone: true,
  selector: 'app-wish-card',
  imports: [CommonModule],
  templateUrl: './wish-card.component.html',
  styleUrls: ['./wish-card.component.scss'],
})
export class WishCardComponent {
  public wish = input<Wish | null>(null);

  public menuOpen = false;

  private dialog = inject(MatDialog);
  private wishService = inject(WishListService);
  private host = inject<ElementRef<HTMLElement>>(ElementRef);

  // Symbol-prefix currencies render as `${symbol}${amount}` with the code beside;
  // suffix currencies (e.g. MDL) render the number with the unit beside it.
  private readonly symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', UAH: '₴' };
  private readonly suffixUnits: Record<string, string> = { MDL: 'lei' };

  public get amount(): string {
    const wish = this.wish();
    const value = wish?.price ?? 0;
    const num = Number.isInteger(value)
      ? value.toLocaleString('en-US')
      : value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const symbol = this.symbols[wish?.currency ?? ''];
    return symbol ? `${symbol}${num}` : num;
  }

  public get unit(): string {
    const currency = this.wish()?.currency ?? '';
    return this.suffixUnits[currency] ?? currency;
  }

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.menuOpen = false;
    }
  }

  public toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  public editWish(): void {
    this.menuOpen = false;
    const wish = this.wish();
    if (wish) {
      this.dialog.open(AddEditWishComponent, {
        width: '480px',
        data: wish,
        panelClass: 'wish-dialog-panel',
        backdropClass: 'wish-dialog-backdrop',
      });
    }
  }

  public deleteWish(): void {
    this.menuOpen = false;
    this.wishService.deleteWish(this.wish()?.key);
  }
}
