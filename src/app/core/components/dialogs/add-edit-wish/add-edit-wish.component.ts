import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog'
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { Currency } from 'src/app/core/models/currency.model';
import { SnackBarService } from '@core/services/snack-bar/snack-bar.service';
import { WishListService } from '@core/services/wish-list/wish-list.service';
import { AddEditWishFormService } from './services/add-edit-wish-form.service';
import { EControlNames } from '@core/enums';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { CURRENCIES } from '@core/constants/currencies.const';

@Component({
  standalone: true,
    selector: 'app-add-edit-wish',
    templateUrl: './add-edit-wish.component.html',
    styleUrls: ['./add-edit-wish.component.scss'],
    imports: [
      MatDialogModule,
      MatIconModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatOptionModule,
      MatInputModule,
      MatButtonModule,
      MatSelectModule,
      ImageCropperComponent
    ],
    providers: [AddEditWishFormService],
})
export class AddEditWishComponent implements OnInit {
  public wishForm!: FormGroup;
  public currencyList: Currency[] = CURRENCIES;

  public imageEdit: string = '';
  public imageChangedEvent: any = '';
  public croppedImage: any = '';
  public showCropper = false;

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

  public get actionBtn(): string {
    return this.editData ? 'Save' : 'Submit';
  }

  public get isEditImage(): boolean {
    return !!this.editData?.image;
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

  public fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  } 

  public imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64;
    this.image.setValue(this.croppedImage);
  }

  public imageLoaded(): void {
    this.showCropper = true;
  }

  public loadImageFailed(): void {
    this.snackbar.openSnackBar('Load image is failed', 'error', 'Close');
  }

  private updateWish(): void {
    this.wishListService.updateWish(this.wishForm.value, this.key);
    this.dialogReg.close();
    this.snackbar.openSnackBar('Wish Updated', 'success', 'Close');
  }
}
