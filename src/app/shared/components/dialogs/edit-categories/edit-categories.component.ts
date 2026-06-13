import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Category } from '@core/models/category.model';
import { CategoryService } from '@core/services/category.service';
import { SnackBarService } from '@core/services/snack-bar.service';
import { DialogShellComponent } from '@shared/components/dialogs/dialog-shell/dialog-shell.component';
import { FA_ICONS } from './constants/fa-icons.const';
import { IconOptionModel } from './models/icon-option.model';

@Component({
  standalone: true,
  selector: 'app-edit-categories',
  templateUrl: './edit-categories.component.html',
  styleUrls: ['./edit-categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, DialogShellComponent],
})
export class EditCategoriesComponent {
  private readonly dialogRef = inject(MatDialogRef<EditCategoriesComponent>);
  private readonly categoryService = inject(CategoryService);
  private readonly snackbar = inject(SnackBarService);
  private readonly data = inject<{ categories: Category[] }>(MAT_DIALOG_DATA);

  public readonly icons: IconOptionModel[] = FA_ICONS;

  public readonly categories = signal<Category[]>(this.data.categories.map(c => ({ ...c })));
  public readonly newName = signal('');
  public readonly newIcon = signal('fa-tag');
  public readonly duplicateError = signal(false);

  public add(): void {
    const name = this.newName().trim().toLowerCase();
    if (!name) return;

    if (this.categories().some(c => c.name === name)) {
      this.duplicateError.set(true);
      return;
    }

    this.categories.update(cats => [
      ...cats,
      {
        id: name.replace(/\s+/g, '-'),
        name,
        icon: this.newIcon(),
        isHidden: false,
        isInitial: false,
      },
    ]);
    this.newName.set('');
    this.newIcon.set('fa-tag');
    this.duplicateError.set(false);
  }

  public toggleHidden(cat: Category): void {
    this.categories.update(cats =>
      cats.map(c => c.id === cat.id ? { ...c, isHidden: !c.isHidden } : c),
    );
  }

  public remove(index: number): void {
    this.categories.update(cats => cats.filter((_, i) => i !== index));
  }

  public close(): void {
    this.dialogRef.close();
  }

  public save(): void {
    this.categoryService.saveCategories(this.categories()).then(() => {
      this.snackbar.openSnackBar('Categories saved', 'success', 'Close');
      this.dialogRef.close(this.categories());
    });
  }
}
