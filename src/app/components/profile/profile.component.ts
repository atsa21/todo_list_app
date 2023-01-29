import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UsersService } from 'src/app/services/users.service';
import { map } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Patterns } from 'src/assets/patterns/patterns';
import { Dimensions, ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public user: User = {};
  public edit: boolean = false;
  public profileForm: any;

  public imageChangedEvent: any = '';
  public croppedImage: any = '';
  public showCropper = false;

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private snackbar: SnackBarService
  ) { }

  ngOnInit(): void {
    this.getUser();
    this.initForm();
  }

  initForm(): void {
    this.profileForm = this.fb.group({
      username: new FormControl('', [Validators.required, Validators.pattern(Patterns.NamePattern)]),
      profile_photo: (''),
      key: ('')
    })
  }

  getUser(): void {
    this.userService.getUser().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.user = data[0];
      this.username.setValue(this.user.username);
      this.profile_photo.setValue(this.user.profile_photo);
      this.key.setValue(this.user.key);
    });
  }

  get username(){
    return this.profileForm.get('username');
  }

  get profile_photo(){
    return this.profileForm.get('profile_photo');
  }

  get key(){
    return this.profileForm.get('key');
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  } 

  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64;
    this.profile_photo.setValue(this.croppedImage);
  }

  imageLoaded(image: LoadedImage): void {
    this.showCropper = true;
  }

  cropperReady(sourceImageDimensions: Dimensions): void {
    console.log('Cropper ready', sourceImageDimensions);
  }

  loadImageFailed(): void {
    this.snackbar.openSnackBar('Load image is failed', 'Close');
  }

  submit(): void {
    if(this.profileForm.valid) {
      this.profileForm.key = this.user.key;
      this.profile_photo.setValue(this.croppedImage);
      this.userService.changeUser(this.profileForm.value);
    }
  }

}
