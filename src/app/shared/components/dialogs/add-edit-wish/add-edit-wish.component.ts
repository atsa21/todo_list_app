import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Currency } from 'src/app/core/models/currency.model';
import { SnackBarService } from '@core/services/snack-bar.service';
import { WishListService } from '@core/services/wish-list.service';
import { AddEditWishFormService } from './services/add-edit-wish-form.service';
import { EControlNames } from '@core/enums';
import { CURRENCIES } from '@core/constants/currencies.const';
import { DialogShellComponent } from '@shared/components/dialogs/dialog-shell/dialog-shell.component';
import { ImageCropperFieldComponent } from '@shared/components/image-cropper-field/image-cropper-field.component';

@Component({
  standalone: true,
    selector: 'app-add-edit-wish',
    templateUrl: './add-edit-wish.component.html',
    styleUrls: ['./add-edit-wish.component.scss'],
    imports: [
      ReactiveFormsModule,
      DialogShellComponent,
      ImageCropperFieldComponent
    ],
    providers: [AddEditWishFormService],
})
export class AddEditWishComponent implements OnInit, AfterViewInit {
  @ViewChild('titleInput') private titleInput?: ElementRef<HTMLInputElement>;

  public wishForm!: FormGroup;
  public currencyList: Currency[] = CURRENCIES;

  public imageEdit: string = '';

  private key: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private wishListService: WishListService,
    private addEditWishFormService: AddEditWishFormService,
    private dialogReg: MatDialogRef<AddEditWishComponent>,
    private snackbar: SnackBarService
  ) {}

  public get dialogTitle(): string {
    return this.editData ? 'Edit Wish' : 'Add Wish';
  }

  public get subline(): string {
    return this.editData
      ? 'Update the details of your wish'
      : "Save something you'd love to have";
  }

  public get actionBtn(): string {
    return this.editData ? 'Save' : 'Add wish';
  }

  get image(): FormControl {
    return this.wishForm.get(EControlNames.Image) as FormControl;
  }

  get title(): FormControl {
    return this.wishForm.get(EControlNames.Title) as FormControl;
  }

  get price(): FormControl {
    return this.wishForm.get(EControlNames.Price) as FormControl;
  }

  get currency(): FormControl {
    return this.wishForm.get(EControlNames.Currency) as FormControl;
  }

  get link(): FormControl {
    return this.wishForm.get(EControlNames.Link) as FormControl;
  }

  ngOnInit(): void {
    if (this.editData) {
      this.imageEdit = this.editData.image;
      this.key = this.editData.key;
    }

    this.wishForm = this.addEditWishFormService.createForm(this.editData);

    if (!this.editData && !this.currency.value) {
      this.currency.setValue('USD');
    }
  }

  ngAfterViewInit(): void {
    this.titleInput?.nativeElement.focus();
  }

  public selectCurrency(value: string): void {
    this.currency.setValue(value);
    this.currency.markAsDirty();
    this.currency.markAsTouched();
  }

  public close(): void {
    this.dialogReg.close();
  }

  public addWish(): void {
    if(!this.editData){
      if(this.wishForm.valid){
        this.wishListService.createWish(this.wishForm.value);
        this.dialogReg.close();
      }
    } else {
      this.updateWish();
    }
  }

  public onImageCropped(base64: string): void {
    this.image.setValue(base64);
  }

  private updateWish(): void {
    this.wishListService.updateWish(this.wishForm.value, this.key);
    this.dialogReg.close();
    this.snackbar.openSnackBar('Wish Updated', 'success', 'Close');
  }
}
