import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { WishListService } from 'src/app/services/wish-list.service';

@Component({
  selector: 'app-dialog-wish',
  templateUrl: './dialog-wish.component.html',
  styleUrls: ['./dialog-wish.component.scss']
})
export class DialogWishComponent implements OnInit {

  public wishForm !: FormGroup;
  public dialogTitle : string = "Add Wish";
  public actionBtn : string = "Submit";

  public imageChangedEvent: any = '';
  public croppedImage: any = '';
  public showCropper = false;

  private userId: string | null = '';
  private key: any;


  constructor( private formBuilder : FormBuilder,
    private wishListService: WishListService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogReg: MatDialogRef<DialogWishComponent>,
    private snackbar: SnackBarService
  ) {}

  ngOnInit(): void {
    this.wishForm = this.formBuilder.group({
      image: new FormControl('', Validators.required),
      title : new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(70)]),
      price : new FormControl('', [Validators.required, Validators.min(0.01), Validators.max(100000000)]),
      link : new FormControl('', [Validators.required])
    });

    if(this.editData) {
      this.dialogTitle = "Edit Todo";
      this.actionBtn = "Save";
      this.wishForm.controls['image'].setValue(this.editData.image);
      this.wishForm.controls['title'].setValue(this.editData.title);
      this.wishForm.controls['price'].setValue(this.editData.price);
      this.wishForm.controls['link'].setValue(this.editData.link);
      this.key = this.editData.key;
    }
  }

  get image() {
    return this.wishForm.get('image');
  }

  get title(){
    return this.wishForm.get('title');
  }

  get price(){
    return this.wishForm.get('price');
  }

  get link(){
    return this.wishForm.get('link');
  }

  addWish(): void {
    if(!this.editData){
      if(this.wishForm.valid){
        this.wishListService.createWish(this.wishForm.value);
        this.dialogReg.close();
      }
    } else {
      this.updateWish();
    }
  }

  updateWish(){
    this.wishListService.updateWish(this.wishForm.value, this.key);
    this.dialogReg.close();
    this.snackbar.openSnackBar('Wish Updated', 'Close');
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
    this.snackbar.openSnackBar('Load image is failed', 'Close');
  }

}
