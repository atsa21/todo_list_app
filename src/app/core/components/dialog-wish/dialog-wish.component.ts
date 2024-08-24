import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { Currency } from 'src/app/core/models/currency.model';
import { SnackBarService } from '@core/services/snack-bar/snack-bar.service';
import { WishListService } from '@core/services/wish-list/wish-list.service';
import { Patterns } from 'src/assets/patterns/patterns';

@Component({
  selector: 'app-dialog-wish',
  templateUrl: './dialog-wish.component.html',
  styleUrls: ['./dialog-wish.component.scss']
})
export class DialogWishComponent implements OnInit {
  public wishForm!: FormGroup;
  public dialogTitle: string = "Add Wish";
  public currencyList: Currency[] = [
    { name: 'UAH - Ukrainian hryvnia', value: 'UAH' },
    { name: 'USD - United States dollar', value: 'USD' },
    { name: 'EUR - Euro', value: 'EUR' }
  ]
  public actionBtn: string = "Submit";

  public imageEdit: string = '';
  public imageChangedEvent: any = '';
  public croppedImage: any = '';
  public showCropper = false;
  public isEditImage: boolean = false;

  private key: string = '';

  constructor(
    private fb : FormBuilder,
    private wishListService: WishListService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogReg: MatDialogRef<DialogWishComponent>,
    private snackbar: SnackBarService
  ) {}

  ngOnInit(): void {
    this.wishForm = this.fb.group({
      image: new FormControl(null),
      title: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(70)]),
      price: new FormControl(null, [Validators.required, Validators.min(0.01), Validators.max(100000000)]),
      currency: new FormControl(null, Validators.required),
      link : new FormControl(null, Validators.pattern(Patterns.LinkPattern))
    });
    console.log(this.wishForm);

    if(this.editData) {
      this.isEditImage = true;
      this.dialogTitle = "Edit Wish";
      this.actionBtn = "Save";
      this.imageEdit = this.editData.image;
      this.wishForm.controls['title'].setValue(this.editData.title);
      this.wishForm.controls['price'].setValue(this.editData.price);
      this.wishForm.controls['currency'].setValue(this.editData.currency);
      this.wishForm.controls['link'].setValue(this.editData.link);
      this.key = this.editData.key;
    }
  }

  get image() {
    return this.wishForm.get('image');
  }

  get title() {
    return this.wishForm.get('title');
  }

  get price() {
    return this.wishForm.get('price');
  }

  get currency() {
    return this.wishForm.get('currency');
  }

  get link() {
    return this.wishForm.get('link');
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

  private updateWish(): void {
    this.wishListService.updateWish(this.wishForm.value, this.key);
    this.dialogReg.close();
    this.snackbar.openSnackBar('Wish Updated', 'success', 'Close');
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  } 

  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64;
    this.image?.setValue(this.croppedImage);
  }

  imageLoaded(image: LoadedImage): void {
    this.showCropper = true;
  }

  loadImageFailed(): void {
    this.snackbar.openSnackBar('Load image is failed', 'error', 'Close');
  }

}
